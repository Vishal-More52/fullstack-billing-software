package com.billingsoftware.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.billingsoftware.entity.OrderItemEntity;

public interface OrderItemEntityRepository extends JpaRepository<OrderItemEntity,Long> {

    
}
