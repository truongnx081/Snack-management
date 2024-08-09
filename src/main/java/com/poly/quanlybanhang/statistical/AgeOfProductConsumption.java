package com.poly.quanlybanhang.statistical;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AgeOfProductConsumption {
     String ageRange;
//     String productName;
//     String categoryName;
     Long numberOfSales;
     Double totalRevenue;
     Double percentageOfTotalSales;
}
