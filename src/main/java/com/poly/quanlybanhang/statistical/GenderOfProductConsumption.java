package com.poly.quanlybanhang.statistical;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GenderOfProductConsumption {
     String gender;
//     String productName;
//     String categoryName;
     Long numberOfSales;
     Double totalRevenue;
     Double percentageOfTotalSales;
}
