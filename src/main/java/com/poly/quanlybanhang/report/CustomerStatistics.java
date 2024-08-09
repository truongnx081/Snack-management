package com.poly.quanlybanhang.report;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomerStatistics {
     String customerName;
      Long orderCount;
      Long totalQuantity;
      Double totalOrderValue;
//      String mostPurchasedProduct;
      LocalDateTime lastOrderDate;
}
