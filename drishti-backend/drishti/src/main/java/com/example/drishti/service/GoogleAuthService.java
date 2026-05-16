package com.example.drishti.service;

import com.example.drishti.dto.AuthResponse;
import com.example.drishti.entity.User;
import com.example.drishti.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;
import java.util.Map;
import java.util.Set;

/**
 * Verifies a Google ID token (from the "Sign in with Google" button) by calling
 * Google's tokeninfo endpoint, then logs in or registers the matching user.
 */
@Service
@RequiredArgsConstructor
public class GoogleAuthService {

    private static final Set<String> ALLOWED_ROLES = Set.of("STUDENT", "INSTITUTION");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Value("${app.google.client-id:}")
    private String googleClientId;

    private final RestClient restClient = RestClient.create();

    @Transactional
    public AuthResponse loginWithGoogle(String idToken, String desiredRole) {
        if (idToken == null || idToken.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing Google credential");
        }

        Map<?, ?> info;
        try {
            info = restClient.get()
                    .uri("https://oauth2.googleapis.com/tokeninfo?id_token={t}", idToken)
                    .retrieve()
                    .body(Map.class);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Google token");
        }
        if (info == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Google token");
        }

        String aud = String.valueOf(info.get("aud"));
        if (googleClientId != null && !googleClientId.isBlank() && !googleClientId.equals(aud)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google token audience mismatch");
        }

        String email = String.valueOf(info.get("email")).toLowerCase(Locale.ROOT);
        if (email.isBlank() || "null".equals(email)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google account has no email");
        }
        String name = info.get("name") != null ? String.valueOf(info.get("name")) : email;

        User user = userRepository.findByEmail(email).orElse(null);
        boolean newUser = false;

        if (user == null) {
            String role = normalizeRole(desiredRole);
            user = new User();
            user.setEmail(email);
            user.setFullName(name);
            user.setRole(role);
            user.setAuthProvider("GOOGLE");
            user.setEmailVerified(true); // Google already verified the email
            user.setPhoneVerified(false);
            // No usable password for Google accounts; store a random hash.
            user.setPasswordHash(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
            user = userRepository.save(user);
            newUser = true;
        }

        String token = jwtService.issueAccessToken(user);
        return AuthResponse.builder()
                .token(token)
                .user(AuthResponse.UserPayload.from(user))
                .phoneVerificationRequired(newUser || !user.isPhoneVerified())
                .build();
    }

    private String normalizeRole(String role) {
        if (role == null) return "STUDENT";
        String upper = role.trim().toUpperCase(Locale.ROOT);
        return ALLOWED_ROLES.contains(upper) ? upper : "STUDENT";
    }
}
