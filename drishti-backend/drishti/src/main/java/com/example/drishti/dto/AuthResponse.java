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

    @Data
    @Builder
    public static class UserPayload {
        private UUID id;
        private String email;
        private String fullName;
        private String role;
        private boolean emailVerified;

        public static UserPayload from(User user) {
            return UserPayload.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .role(user.getRole())
                    .emailVerified(user.isEmailVerified())
                    .build();
        }
    }
}
