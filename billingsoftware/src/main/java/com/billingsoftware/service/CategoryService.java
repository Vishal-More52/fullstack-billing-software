package com.billingsoftware.service;

import com.billingsoftware.io.CategoryRequest;
import com.billingsoftware.io.CategoryResponse;

public interface CategoryService {
    CategoryResponse add(CategoryRequest request);
}
