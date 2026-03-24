package com.busybrains.ecommerce.security;

import com.busybrains.ecommerce.user.Role;
import com.busybrains.ecommerce.user.User;
import com.busybrains.ecommerce.user.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
public class CustomOAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    public CustomOAuth2SuccessHandler(JwtUtils jwtUtils, UserRepository userRepository) {
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        Optional<User> userOptional = userRepository.findByEmail(email);

        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
        } else {
            // Register new local user from OAuth callback
            user = User.builder()
                    .name(name)
                    .email(email)
                    .provider("google")
                    .role(Role.ROLE_USER)
                    .build();
            userRepository.save(user);
        }

        // Generate token explicitly from email because we use email as subject
        String token = jwtUtils.generateTokenFromUsername(email);

        // Redirect to frontend with token
        String redirectUrl = "http://localhost:5173/login-success?token=" + token;
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
