package com.poly.quanlybanhang.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GenderOfProductConsumptionRequest {
     Boolean gender;
     String productName;
}
