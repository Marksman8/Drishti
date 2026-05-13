package com.example.drishti.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String from;
    private final String frontendUrl;

    public EmailService(
            JavaMailSender mailSender,
            @Value("${app.mail.from}") String from,
            @Value("${app.mail.frontend-url}") String frontendUrl) {
        this.mailSender = mailSender;
        this.from = from;
        this.frontendUrl = frontendUrl;
    }

    public void sendVerification(String to, String token) {
        String link = frontendUrl + "/verify-email?token=" + token;
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo(to);
        msg.setSubject("Verify your Drishti account");
        msg.setText("Welcome to Drishti.\n\nClick the link below to verify your email:\n"
                + link
                + "\n\nThis link expires in 24 hours.");
        send(msg, "verification", to);
    }

    public void sendPasswordReset(String to, String token) {
        String link = frontendUrl + "/reset-password?token=" + token;
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo(to);
        msg.setSubject("Reset your Drishti password");
        msg.setText("A password reset was requested for your Drishti account.\n\n"
                + "Click the link below to set a new password:\n"
                + link
                + "\n\nThis link expires in 1 hour. If you did not request this, ignore this email.");
        send(msg, "password reset", to);
    }

    private void send(SimpleMailMessage msg, String kind, String to) {
        try {
            mailSender.send(msg);
        } catch (Exception e) {
            log.error("Failed to send {} email to {}", kind, to, e);
        }
    }
}
