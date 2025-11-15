package com.billingsoftware.io;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDetails {
    private String rezorpayOrderId;
    private String rezorpayPaymentId;
    private String rezorpaySignature;
    private PaymentStatus status;

    public enum PaymentStatus{
        PENDING, COMPLETED , FAILED
    }

}
