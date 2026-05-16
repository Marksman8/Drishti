package com.example.drishti.controller;

import com.example.drishti.dto.AuthResponse;
import com.example.drishti.dto.LoginRequest;
import com.example.drishti.dto.RegisterRequest;
import com.example.drishti.dto.ResetPasswordRequest;
import com.example.drishti.service.AuthService;
import com.example.drishti.service.GoogleAuthService;
import com.example.drishti.service.PhoneOtpService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Validated
public class AuthController {

    private final AuthService authService;
    private final GoogleAuthService googleAuthService;
    private final PhoneOtpService phoneOtpService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest req) {
        authService.register(req);
        return ResponseEntity.ok(Map.of(
                "message", "Registration successful. Check your email to verify your account."));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<Map<String, String>> verifyEmail(@RequestParam("token") @NotBlank String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok(Map.of("message", "Email verified. You can now log in."));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email != null && !email.isBlank()) {
            authService.requestPasswordReset(email);
        }
        return ResponseEntity.ok(Map.of(
                "message", "If an account exists for that email, a reset link has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        authService.resetPassword(req);
        return ResponseEntity.ok(Map.of("message", "Password updated. You can now log in."));
    }

    /** Sign in / register with a Google ID token from the "Sign in with Google" button. */
    @PostMapping("/google")
    public ResponseEntity<AuthResponse> google(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
                googleAuthService.loginWithGoogle(body.get("credential"), body.get("role")));
    }

    /** Authenticated: send (dev-mock) OTP to the user's phone. */
    @PostMapping("/phone/send-otp")
    public ResponseEntity<Map<String, Object>> sendOtp(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        String devOtp = phoneOtpService.sendOtp(userId, body.get("phoneNumber"));
        Map<String, Object> resp = new HashMap<>();
        resp.put("message", "OTP sent. (Dev mode: check the backend console.)");
        if (devOtp != null) {
            resp.put("devOtp", devOtp);
        }
        return ResponseEntity.ok(resp);
    }

    /** Authenticated: verify the OTP and mark the phone verified. */
    @PostMapping("/phone/verify-otp")
    public ResponseEntity<Map<String, String>> verifyOtp(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        phoneOtpService.verifyOtp(userId, body.get("otp"));
        return ResponseEntity.ok(Map.of("message", "Phone number verified."));
    }
}
