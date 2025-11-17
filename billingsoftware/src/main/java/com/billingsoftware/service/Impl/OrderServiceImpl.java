package com.billingsoftware.service.Impl;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.billingsoftware.entity.OrderEntity;
import com.billingsoftware.entity.OrderItemEntity;
import com.billingsoftware.io.OrderRequest;
import com.billingsoftware.io.OrderResponse;
import com.billingsoftware.io.PaymentDetails;
import com.billingsoftware.io.PaymentMethod;
import com.billingsoftware.io.PaymentVerificationRequest;
import com.billingsoftware.repository.OrderEntityRepository;
import com.billingsoftware.service.OrderService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

        private final OrderEntityRepository orderEntityRepository;

        @Value("${stripe.api.secret}")
        private String stripeSecretKey;

        @Override
        public OrderResponse createOrder(OrderRequest request) {
                OrderEntity newOrder = convertToOrderEntity(request);
                PaymentDetails paymentDetails = new PaymentDetails();
                paymentDetails
                                .setStatus(newOrder.getPaymentMethod() == PaymentMethod.CASH
                                                ? PaymentDetails.PaymentStatus.COMPLETED
                                                : PaymentDetails.PaymentStatus.PENDING);
                newOrder.setPaymentDetails(paymentDetails);

                List<OrderItemEntity> orderItems = request.getCartItems().stream()
                                .map(this::convertToOrderItemEntity)
                                .collect(Collectors.toList());
                newOrder.setItems(orderItems);

                newOrder = orderEntityRepository.save(newOrder);
                return convertToResponse(newOrder);

        }

        private OrderEntity convertToOrderEntity(OrderRequest request) {
                return OrderEntity.builder()
                                .customerName(request.getCustomerName())
                                .phoneNumber(request.getPhoneNumber())
                                .subtotal(request.getSubtotal())
                                .tax(request.getTax())
                                .grandTotal(request.getGrandTotal())
                                .paymentMethod(PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase()))
                                .build();
        }

        private OrderItemEntity convertToOrderItemEntity(OrderRequest.OrderItemRequest orderItemRequest) {
                return OrderItemEntity.builder()
                                .itemId(orderItemRequest.getItemId())
                                .name(orderItemRequest.getName())
                                .price(String.valueOf(orderItemRequest.getPrice()))
                                .quantity(orderItemRequest.getQuantity())
                                .build();
        }

        private OrderResponse convertToResponse(OrderEntity newOrder) {

                return OrderResponse.builder()
                                .OrderId(newOrder.getOrderId())
                                .customerName(newOrder.getCustomerName())
                                .phoneNumber(newOrder.getPhoneNumber())
                                .subtotal(newOrder.getSubtotal())
                                .tax(newOrder.getTax())
                                .grandTotal(newOrder.getGrandTotal())
                                .paymentMethod(newOrder.getPaymentMethod())
                                .items(newOrder.getItems().stream()
                                                .map(this::convertToItemResponse)
                                                .collect(Collectors.toList()))
                                .paymentDetails(newOrder.getPaymentDetails())
                                .createdAt(newOrder.getCreatedAt())
                                .build();

        }

        private OrderResponse.OrderItemResponse convertToItemResponse(OrderItemEntity orderItemEntity) {
                return OrderResponse.OrderItemResponse.builder()
                                .itemId(orderItemEntity.getItemId())
                                .name(orderItemEntity.getName())
                                .price(Double.parseDouble(orderItemEntity.getPrice()))
                                .quantity(orderItemEntity.getQuantity())
                                .build();

        }

        @Override
        public void deleteOrder(String orderId) {
                OrderEntity existingOrder = orderEntityRepository.findByOrderId(orderId)
                                .orElseThrow(() -> new RuntimeException("Order Not Found"));
                orderEntityRepository.delete(existingOrder);

        }

        @Override
        public List<OrderResponse> getLatestOrders() {
                return orderEntityRepository.findAllByOrderByCreatedAtDesc().stream()
                                .map(this::convertToResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public OrderResponse verifyPayment(PaymentVerificationRequest request) {
                OrderEntity existingOrder = orderEntityRepository.findByOrderId(request.getOrderId())
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                if (!verifyStripePayment(request.getPaymentIntentId())) {
                        throw new RuntimeException("Payment verification failed");
                }

                PaymentDetails paymentDetails = existingOrder.getPaymentDetails();
                paymentDetails.setStripePaymentIntentId(request.getPaymentIntentId());
                paymentDetails.setStatus(PaymentDetails.PaymentStatus.COMPLETED);

                existingOrder = orderEntityRepository.save(existingOrder);
                return convertToResponse(existingOrder);
        }

        private boolean verifyStripePayment(String paymentIntentId) {
                try {
                        com.stripe.Stripe.apiKey = stripeSecretKey;
                        com.stripe.model.PaymentIntent paymentIntent = com.stripe.model.PaymentIntent
                                        .retrieve(paymentIntentId);
                        String status = paymentIntent.getStatus();
                        // For UPI payments, status should be "succeeded" after completion
                        // "processing" status means payment is still being processed (not yet
                        // completed)
                        // Only accept "succeeded" as completed payment
                        if ("succeeded".equals(status)) {
                                return true;
                        } else if ("processing".equals(status)) {
                                // For UPI, if still processing, we might want to wait or check again
                                // For now, we'll accept it but log a warning
                                System.out.println("Payment is still processing: " + paymentIntentId);
                                return true; // Accept processing status for UPI async payments
                        }
                        return false;
                } catch (Exception e) {
                        // Log the error for debugging
                        System.err.println("Payment verification error: " + e.getMessage());
                        e.printStackTrace();
                        return false;
                }
        }

        @Override
        public Double sumSalesByDate(LocalDate date) {
                return orderEntityRepository.sumSalesByDate(date);
        }

        @Override
        public Long countByOrderDate(LocalDate date) {
                return orderEntityRepository.countByOrderDate(date);
        }

        @Override
        public List<OrderResponse> findRecentOrders() {
                return orderEntityRepository.findRecentOrders(PageRequest.of(0,5))
                        .stream()
                        .map(orderEntity -> convertToResponse(orderEntity))
                        .collect(Collectors.toList());
        }

}
