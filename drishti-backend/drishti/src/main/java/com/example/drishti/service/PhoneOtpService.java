package com.example.drishti.service;

import com.example.drishti.entity.User;
import com.example.drishti.repository.UserRepository;
import com.example.drishti.service.sms.SmsSender;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Dev-mock phone verification. No real SMS is sent — the OTP is logged to the
 * backend console and (in dev) returned in the response so it can be tested.
 * Swap sendSms() for a real provider (Twilio etc.) later.
 */
@Service
@RequiredArgsConstructor
public class PhoneOtpService {

    private static final Logger log = LoggerFactory.getLogger(PhoneOtpService.class);
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final long TTL_MILLIS = 5 * 60 * 1000;

    private final UserRepository userRepository;
    private final SmsSender smsSender;

    @Value("${app.phone.dev-return-otp:true}")
    private boolean devReturnOtp;

    // Fixed OTP that always works for ADMIN accounts (dev convenience).
    @Value("${app.phone.admin-otp:000000}")
    private String adminOtp;

    private record Otp(String code, long expiresAt) {}

    private final ConcurrentHashMap<UUID, Otp> store = new ConcurrentHashMap<>();

    /** @return the OTP if dev mode is on (so the frontend can show it), else null. */
    @Transactional
    public String sendOtp(UUID userId, String phoneNumber) {
        if (phoneNumber == null || phoneNumber.trim().length() < 7) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter a valid phone number");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        user.setPhoneNumber(phoneNumber.trim());
        userRepository.save(user);

        boolean isAdmin = "ADMIN".equalsIgnoreCase(user.getRole());
        if (isAdmin) {
            // Admin uses a fixed master OTP — no need to generate/send one.
            log.info("[ADMIN OTP] {} can verify with the fixed admin OTP", user.getEmail());
            return adminOtp;
        }

        String code = String.format("%06d", RANDOM.nextInt(1_000_000));
        store.put(userId, new Otp(code, System.currentTimeMillis() + TTL_MILLIS));

        smsSender.send(phoneNumber.trim(), "Your DRISHTI verification code is " + code);

        // Only reveal the OTP in the response when no real SMS was sent (dev mock).
        return (smsSender.isMock() && devReturnOtp) ? code : null;
    }

    @Transactional
    public void verifyOtp(UUID userId, String code) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        boolean isAdmin = "ADMIN".equalsIgnoreCase(user.getRole());
        if (isAdmin && adminOtp.equals(code)) {
            // Admin master OTP always passes.
            user.setPhoneVerified(true);
            userRepository.save(user);
            store.remove(userId);
            return;
        }

        Otp otp = store.get(userId);
        if (otp == null || otp.expiresAt() < System.currentTimeMillis()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP expired. Request a new one.");
        }
        if (!otp.code().equals(code)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Incorrect OTP");
        }
        user.setPhoneVerified(true);
        userRepository.save(user);
        store.remove(userId);
    }
}
