package com.poly.quanlybanhang.mapper;

import com.poly.quanlybanhang.dto.request.OrderRequest;
import com.poly.quanlybanhang.dto.request.ProductRequest;
import com.poly.quanlybanhang.dto.response.OrderResponse;
import com.poly.quanlybanhang.dto.response.ProductResponse;
import com.poly.quanlybanhang.entity.Orders;
import com.poly.quanlybanhang.entity.Products;
import lombok.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")

public interface OrderMapper {

    @Mapping(target = "orderDetails", ignore = true)
    Orders toOrder(OrderRequest request);
    OrderResponse toOrderResponse(Orders orders);
}
