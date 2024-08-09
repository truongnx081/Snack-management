package com.poly.quanlybanhang.service;

import com.poly.quanlybanhang.dto.request.ProductRequest;
import com.poly.quanlybanhang.dto.response.ProductResponse;
import com.poly.quanlybanhang.entity.Products;

import java.util.List;

public interface ProductService {
    ProductResponse create(ProductRequest request);
    ProductResponse update(ProductRequest request, String id);
    void delete(String id);
    List<ProductResponse> getAll();
    Products getOne(String id);
    ProductResponse getProduct(String id);
}
