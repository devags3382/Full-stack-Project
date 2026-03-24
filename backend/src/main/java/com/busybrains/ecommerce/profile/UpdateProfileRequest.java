package com.busybrains.ecommerce.profile;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String name;
    private String email;
}
