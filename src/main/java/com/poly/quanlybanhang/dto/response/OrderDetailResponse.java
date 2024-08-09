package com.poly.quanlybanhang.dto.response;

import com.poly.quanlybanhang.entity.Orders;
import com.poly.quanlybanhang.entity.Products;
import com.poly.quanlybanhang.entity.Users;
import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class OrderDetailResponse {
    String id;
    int quantity;
    Double price;
    Orders order;
    Products product;
}
