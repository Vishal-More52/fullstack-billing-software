package com.billingsoftware.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.billingsoftware.io.CategoryRequest;
import com.billingsoftware.io.CategoryResponse;

public interface CategoryService {
    CategoryResponse add(CategoryRequest request,MultipartFile file);
    List<CategoryResponse> read();
    void delete(String categoryId);
}
