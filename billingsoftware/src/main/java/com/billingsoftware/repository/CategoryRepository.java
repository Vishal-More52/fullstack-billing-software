package com.billingsoftware.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.billingsoftware.entity.CategoryEntity;

public interface CategoryRepository extends JpaRepository<CategoryEntity , Long>{

}
