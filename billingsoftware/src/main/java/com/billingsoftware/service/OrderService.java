package com.billingsoftware.service;

import java.util.List;

import com.billingsoftware.io.OrderRequest;
import com.billingsoftware.io.OrderResponse;

public interface OrderService {

    OrderResponse createOrder(OrderRequest request);

    void deleteOrder(String orderId);

    List<OrderResponse> getLatestOrders();
}
