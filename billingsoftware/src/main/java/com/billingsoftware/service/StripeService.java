package com.billingsoftware.service;

import com.billingsoftware.io.StripeOrderResponse;

public interface StripeService {

    StripeOrderResponse createPaymentIntent(Double amount, String currency) throws Exception;
    
    String createCheckoutSession(Double amount, String currency, String orderId) throws Exception;
    
    String getPaymentIntentFromSession(String sessionId) throws Exception;

}

