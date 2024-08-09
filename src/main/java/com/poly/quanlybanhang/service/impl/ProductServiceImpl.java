package com.poly.quanlybanhang.service.impl;

import com.poly.quanlybanhang.dto.request.ProductRequest;
import com.poly.quanlybanhang.dto.response.ProductResponse;
import com.poly.quanlybanhang.entity.Categories;
import com.poly.quanlybanhang.entity.Products;
import com.poly.quanlybanhang.exception.AppException;
import com.poly.quanlybanhang.exception.ErrorCode;
import com.poly.quanlybanhang.mapper.ProductMapper;
import com.poly.quanlybanhang.repository.CategoryRepository;
import com.poly.quanlybanhang.repository.ProductRepository;
import com.poly.quanlybanhang.service.ProductService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    ProductRepository productRepository;
    CategoryRepository categoryRepository;
    ProductMapper productMapper;

    @Override
    public ProductResponse create(ProductRequest request) {
        Products products = productMapper.toProduct(request);
        Categories categories = new Categories();

        categories.setId(request.getCategories());

        products.setCategories(categories);
        products.setCreateAt(LocalDateTime.now());

        return productMapper.toProductResponse(productRepository.save(products));
    }

    @Override
    public ProductResponse update(ProductRequest request, String id) {
        Products products = this.getOne(id);
        Categories categories = categoryRepository.findById(request.getCategories())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        productMapper.updateProduct(products, request);

        products.setCategories(categories);
        products.setUpdateAt(LocalDateTime.now());

        return productMapper.toProductResponse(productRepository.save(products));
    }

    @Override
    public void delete(String id) {
        productRepository.deleteById(id);
    }

    @Override
    public List<ProductResponse> getAll() {
        return productRepository.findAll()
                .stream()
                .map(productMapper::toProductResponse)
                .toList();
    }

    @Override
    public Products getOne(String id) {
        return productRepository.findById(id).orElseThrow(() ->
                new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    }

    @Override
    public ProductResponse getProduct(String id) {
        return productMapper.toProductResponse(this.getOne(id));
    }
}
