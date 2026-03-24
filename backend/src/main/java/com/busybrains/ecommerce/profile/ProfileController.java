package com.busybrains.ecommerce.profile;

import com.busybrains.ecommerce.security.UserDetailsImpl;
import com.busybrains.ecommerce.user.User;
import com.busybrains.ecommerce.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@PreAuthorize("isAuthenticated()")
public class ProfileController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(null); // Do not return password
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                           @RequestBody UpdateProfileRequest request) {
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        userRepository.save(user);
        
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                            @RequestBody ChangePasswordRequest request) {
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if ("google".equals(user.getProvider()) && user.getPassword() == null) {
            return ResponseEntity.badRequest().body("OAuth2 users cannot change password directly.");
        }

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Old password does not match.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("Password updated successfully.");
    }
}
