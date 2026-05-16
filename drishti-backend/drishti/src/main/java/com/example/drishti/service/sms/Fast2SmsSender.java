package com.example.drishti.service.sms;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestClient;

import java.util.Map;

/**
 * Real SMS via Fast2SMS (https://www.fast2sms.com). Active only when an API key
 * is configured. Uses the OTP route; note Indian delivery still requires DLT.
 */
public class Fast2SmsSender implements SmsSender {

    private static final Logger log = LoggerFactory.getLogger(Fast2SmsSender.class);

    private final String apiKey;
    private final RestClient restClient = RestClient.create();

    public Fast2SmsSender(String apiKey) {
        this.apiKey = apiKey;
    }

    @Override
    public void send(String phoneNumber, String message) {
        // Fast2SMS expects a 10-digit Indian number (no country code / symbols).
        String digits = phoneNumber.replaceAll("\\D", "");
        if (digits.length() > 10) {
            digits = digits.substring(digits.length() - 10);
        }
        try {
            Map<?, ?> resp = restClient.post()
                    .uri("https://www.fast2sms.com/dev/bulkV2")
                    .header("authorization", apiKey)
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .body("route=q&message=" + java.net.URLEncoder.encode(message, java.nio.charset.StandardCharsets.UTF_8)
                            + "&language=english&numbers=" + digits)
                    .retrieve()
                    .body(Map.class);
            log.info("Fast2SMS response for {}: {}", digits, resp);
        } catch (Exception e) {
            log.error("Fast2SMS send failed for {}: {}", digits, e.getMessage());
        }
    }

    @Override
    public boolean isMock() {
        return false;
    }
}
