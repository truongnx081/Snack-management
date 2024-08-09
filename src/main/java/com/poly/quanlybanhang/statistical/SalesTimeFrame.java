package com.poly.quanlybanhang.statistical;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SalesTimeFrame {
//     Date date;
     String timeFrame;
//     String productName;
//     String categoryName;
     Long numberOfSales;
     Double totalRevenue;
     Double percentageOfTotalSalesPerDay;
}
