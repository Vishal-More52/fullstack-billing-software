package com.billingsoftware.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.billingsoftware.io.CheckoutRequest;
import com.billingsoftware.io.OrderResponse;
import com.billingsoftware.io.PaymentRequest;
import com.billingsoftware.io.PaymentVerificationRequest;
import com.billingsoftware.io.StripeOrderResponse;
import com.billingsoftware.service.OrderService;
import com.billingsoftware.service.StripeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final StripeService stripeService;
    private final OrderService orderService;

    @PostMapping("/create-order")
    public StripeOrderResponse createPaymentIntent(@RequestBody PaymentRequest request) throws Exception {
        return stripeService.createPaymentIntent(request.getAmount(), request.getCurrency());
    }
    
    @PostMapping("/create-checkout")
    public Map<String, String> createCheckoutSession(@RequestBody CheckoutRequest request) throws Exception {
        String checkoutUrl = stripeService.createCheckoutSession(request.getAmount(), request.getCurrency(), request.getOrderId());
        Map<String, String> response = new HashMap<>();
        response.put("url", checkoutUrl);
        return response;
    }

    @PostMapping("/verify")
    public OrderResponse verifyPayment(@RequestBody PaymentVerificationRequest request){
        return orderService.verifyPayment(request);
    }
    
    @PostMapping("/session-payment-intent")
    public Map<String, String> getPaymentIntentFromSession(@RequestBody Map<String, String> request) throws Exception {
        String sessionId = request.get("sessionId");
        String paymentIntentId = stripeService.getPaymentIntentFromSession(sessionId);
        Map<String, String> response = new HashMap<>();
        response.put("paymentIntentId", paymentIntentId);
        return response;
    }
}
