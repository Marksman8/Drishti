package com.example.drishti.dto;

import com.example.drishti.entity.User;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AuthResponse {
    private String token;
    private UserPayload user;
    // True when this is a brand-new account that still needs phone verification.
    private boolean phoneVerificationRequired;

    @Data
    @Builder
    public static class UserPayload {
        private UUID id;
        private String email;
        private String fullName;
        private String role;
        private boolean emailVerified;
        private boolean phoneVerified;

        public static UserPayload from(User user) {
            return UserPayload.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .role(user.getRole())
                    .emailVerified(user.isEmailVerified())
                    .phoneVerified(user.isPhoneVerified())
                    .build();
        }
    }
}
