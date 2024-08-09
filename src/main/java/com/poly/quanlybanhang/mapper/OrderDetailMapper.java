package com.poly.quanlybanhang.mapper;

import com.poly.quanlybanhang.dto.request.OrderDetailRequest;
import com.poly.quanlybanhang.dto.request.OrderRequest;
import com.poly.quanlybanhang.dto.response.OrderDetailResponse;
import com.poly.quanlybanhang.dto.response.OrderResponse;
import com.poly.quanlybanhang.entity.OrderDetails;
import com.poly.quanlybanhang.entity.Orders;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderDetailMapper {
    @Mapping(target = "product", ignore = true)
    OrderDetails toOrderDetail(OrderDetailRequest request);
    OrderDetailResponse toOrderDetailResponse(OrderDetails orderDetails);

}
