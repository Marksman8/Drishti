package com.example.drishti.service.sms;

/** Abstraction over SMS delivery so providers can be swapped without touching callers. */
public interface SmsSender {

    /** Deliver the message. Implementations must not throw on provider errors — log instead. */
    void send(String phoneNumber, String message);

    /**
     * True when no real SMS leaves the system (console/dev mock). When true the
     * OTP may be surfaced in the API response so it can be tested without a phone.
     */
    boolean isMock();
}
