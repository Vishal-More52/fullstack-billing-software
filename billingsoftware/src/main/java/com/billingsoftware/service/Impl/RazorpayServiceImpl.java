// package com.billingsoftware.service.Impl;

// import org.cloudinary.json.JSONObject;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Service;

// import com.billingsoftware.io.RazorpayOrderResponse;
// import com.billingsoftware.service.RazorpayService;
// import com.razorpay.RazorpayClient;
// import com.razorpay.RazorpayException;

// import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor
// public class RazorpayServiceImpl implements RazorpayService {
    
//     @Value("${razorpay.key.id}")
//     private String razorpayKeyId;
//     @Value("${razorpay.key.secret}")
//     private String razorpayKeySecret;
    
//     @Override
//     public RazorpayOrderResponse createOrder(Double amount, String currency) throws RazorpayException {
//         RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
//         JSONObject order
//     }

// }
