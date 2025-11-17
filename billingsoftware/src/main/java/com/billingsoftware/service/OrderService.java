package com.billingsoftware.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;

import com.billingsoftware.io.OrderRequest;
import com.billingsoftware.io.OrderResponse;
import com.billingsoftware.io.PaymentVerificationRequest;

public interface OrderService {

    OrderResponse createOrder(OrderRequest request);

    void deleteOrder(String orderId);

    List<OrderResponse> getLatestOrders();

    OrderResponse verifyPayment(PaymentVerificationRequest request);

    Double sumSalesByDate(LocalDate date);

    Long countByOrderDate(LocalDate date);

    List <OrderResponse> findRecentOrders();
}
