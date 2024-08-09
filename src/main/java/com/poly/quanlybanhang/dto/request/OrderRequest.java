package com.poly.quanlybanhang.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class OrderRequest {
    String fullname;
    String phone;
    boolean gender;
    int age;
    Double totalAmount;
    String status = "Đã thanh toán";
    private List<OrderDetailRequest> orderDetails;
}
