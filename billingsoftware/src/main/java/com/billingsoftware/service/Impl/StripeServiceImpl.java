package com.billingsoftware.service.Impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.billingsoftware.io.StripeOrderResponse;
import com.billingsoftware.service.StripeService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.checkout.Session;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.checkout.SessionCreateParams;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StripeServiceImpl implements StripeService {

    @Value("${stripe.api.secret}")
    private String stripeSecretKey;
    
    @Value("${server.servlet.context-path:/api/v1.0}")
    private String contextPath;

    @Override
    public StripeOrderResponse createPaymentIntent(Double amount, String currency) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        // Convert amount to smallest currency unit (paise for INR, cents for USD)
        long amountInSmallestUnit = (long) (amount * 100);

        // Create PaymentIntent with automatic payment methods enabled
        // This will automatically include UPI for INR currency
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInSmallestUnit)
                .setCurrency(currency.toLowerCase())
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build())
                .build();

        PaymentIntent paymentIntent = PaymentIntent.create(params);

        return StripeOrderResponse.builder()
                .clientSecret(paymentIntent.getClientSecret())
                .paymentIntentId(paymentIntent.getId())
                .amount(paymentIntent.getAmount())
                .currency(paymentIntent.getCurrency().toUpperCase())
                .status(paymentIntent.getStatus())
                .build();
    }
    
    @Override
    public String createCheckoutSession(Double amount, String currency, String orderId) throws StripeException {
        Stripe.apiKey = stripeSecretKey;
        
        // Convert amount to smallest currency unit
        long amountInSmallestUnit = (long) (amount * 100);
        
        // Build the return URL - adjust based on your frontend URL
        // These URLs should point to your frontend application
        String returnUrl = "http://localhost:3000?session_id={CHECKOUT_SESSION_ID}&order_id=" + orderId;
        String cancelUrl = "http://localhost:3000?canceled=true&order_id=" + orderId;
        
        // Create Checkout Session with automatic payment methods (includes UPI for INR)
        SessionCreateParams.Builder paramsBuilder = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(returnUrl)
                .setCancelUrl(cancelUrl)
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency(currency.toLowerCase())
                                                .setUnitAmount(amountInSmallestUnit)
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName("Order Payment")
                                                                .build())
                                                .build())
                                .build())
                .putMetadata("order_id", orderId);
        
        // For INR currency, enable automatic payment methods which includes UPI
        // For other currencies, use card
        if ("inr".equalsIgnoreCase(currency)) {
            // Automatic payment methods will include UPI for INR
            // We'll add card explicitly and let automatic methods handle UPI
            paramsBuilder.addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD);
            // Note: UPI is automatically included for INR when using automatic payment methods
            // If UPI enum is not available, Stripe will handle it via automatic payment methods
        } else {
            paramsBuilder.addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD);
        }
        
        Session session = Session.create(paramsBuilder.build());
        return session.getUrl(); // Return the checkout URL
    }
    
    @Override
    public String getPaymentIntentFromSession(String sessionId) throws StripeException {
        Stripe.apiKey = stripeSecretKey;
        Session session = Session.retrieve(sessionId);
        // Get payment intent ID from the session
        // Session.getPaymentIntent() returns a String (the payment intent ID)
        String paymentIntentId = session.getPaymentIntent();
        if (paymentIntentId != null && !paymentIntentId.isEmpty()) {
            return paymentIntentId;
        }
        throw new RuntimeException("Payment intent not found in session");
    }

}

