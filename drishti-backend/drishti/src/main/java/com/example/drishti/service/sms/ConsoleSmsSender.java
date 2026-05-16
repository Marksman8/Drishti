package com.example.drishti.service.sms;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/** Default dev-mock sender: prints the message to the backend console. */
public class ConsoleSmsSender implements SmsSender {

    private static final Logger log = LoggerFactory.getLogger(ConsoleSmsSender.class);

    @Override
    public void send(String phoneNumber, String message) {
        log.info("[DEV SMS -> {}] {}", phoneNumber, message);
    }

    @Override
    public boolean isMock() {
        return true;
    }
}
