package com.poly.quanlybanhang.mapper;

import com.poly.quanlybanhang.dto.request.ProductRequest;
import com.poly.quanlybanhang.dto.response.ProductResponse;
import com.poly.quanlybanhang.dto.response.UserResponse;
import com.poly.quanlybanhang.entity.Products;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(target = "categories", ignore = true)
    Products toProduct(ProductRequest request);
    ProductResponse toProductResponse(Products products);

    @Mapping(target = "categories", ignore = true)
    void updateProduct(@MappingTarget Products products, ProductRequest request);
}
