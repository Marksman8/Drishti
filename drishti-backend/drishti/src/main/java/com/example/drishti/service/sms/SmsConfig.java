package com.example.drishti.service.sms;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SmsConfig {

    private static final Logger log = LoggerFactory.getLogger(SmsConfig.class);

    @Bean
    public SmsSender smsSender(@Value("${app.sms.fast2sms.api-key:}") String fast2smsKey) {
        if (fast2smsKey != null && !fast2smsKey.isBlank()) {
            log.info("SMS provider: Fast2SMS (real SMS enabled)");
            return new Fast2SmsSender(fast2smsKey);
        }
        log.info("SMS provider: console dev-mock (set FAST2SMS_API_KEY for real SMS)");
        return new ConsoleSmsSender();
    }
}
