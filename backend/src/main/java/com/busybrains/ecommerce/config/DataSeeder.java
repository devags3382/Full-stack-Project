package com.busybrains.ecommerce.config;

import com.busybrains.ecommerce.product.Product;
import com.busybrains.ecommerce.product.ProductRepository;
import com.busybrains.ecommerce.user.Role;
import com.busybrains.ecommerce.user.User;
import com.busybrains.ecommerce.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, 
                                      ProductRepository productRepository, 
                                      PasswordEncoder passwordEncoder) {
        return args -> {
            // Create Admin
            if (!userRepository.existsByEmail("admin@busybrains.com")) {
                userRepository.save(User.builder()
                        .name("Admin User")
                        .email("admin@busybrains.com")
                        .password(passwordEncoder.encode("password"))
                        .role(Role.ROLE_ADMIN)
                        .provider("local")
                        .build());
            }

            // Create User
            if (!userRepository.existsByEmail("user@busybrains.com")) {
                userRepository.save(User.builder()
                        .name("Regular User")
                        .email("user@busybrains.com")
                        .password(passwordEncoder.encode("password"))
                        .role(Role.ROLE_USER)
                        .provider("local")
                        .build());
            }

            // Create 10 products
            if (productRepository.count() == 0) {
                List<Product> products = List.of(
                        createProduct("Laptop Pro X", "High-performance laptop for professionals", "1299.99"),
                        createProduct("Wireless Headphones", "Noise-cancelling over-ear headphones", "199.99"),
                        createProduct("Smartphone Z", "Latest 5G smartphone with advanced camera", "899.99"),
                        createProduct("Smart Watch 4", "Fitness tracker and smart assistant", "249.99"),
                        createProduct("Mechanical Keyboard", "RGB mechanical keyboard with tactile switches", "129.99"),
                        createProduct("Gaming Mouse", "Ergonomic gaming mouse with high DPI", "59.99"),
                        createProduct("4K Monitor", "27-inch 4K UHD monitor for creators", "349.99"),
                        createProduct("Bluetooth Speaker", "Portable waterproof bluetooth speaker", "79.99"),
                        createProduct("External SSD 1TB", "Fast portable SSD storage", "109.99"),
                        createProduct("Webcam HD", "1080p HD webcam for video conferencing", "49.99")
                );
                productRepository.saveAll(products);
            }
        };
    }

    private Product createProduct(String name, String desc, String priceStr) {
        String encodedName = name.replace(" ", "+");
        return Product.builder()
                .name(name)
                .description(desc)
                .price(new BigDecimal(priceStr))
                .imageUrl("https://placehold.co/300x200?text=" + encodedName)
                .build();
    }
}
