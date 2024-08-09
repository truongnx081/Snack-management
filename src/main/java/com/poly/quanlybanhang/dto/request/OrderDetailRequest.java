package com.poly.quanlybanhang.dto.request;

import com.poly.quanlybanhang.entity.Orders;
import com.poly.quanlybanhang.entity.Products;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class OrderDetailRequest {
    int quantity;
    Double price;
    String productId;
    String[] product;
    String phone;
}
