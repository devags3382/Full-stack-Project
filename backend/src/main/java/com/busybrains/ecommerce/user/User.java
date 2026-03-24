package com.busybrains.ecommerce.user;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = true) // Can be null for OAuth2 users initially
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    
    // Auth provider for future reference (local, google, etc)
    private String provider;
}
