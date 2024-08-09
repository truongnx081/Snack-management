package com.poly.quanlybanhang.report;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DashboardStatistics {
    Double totalRevenue;
     Long totalQuantityProduct;
     Long totalCustomers;
    Long totalProfits;
    Long totalProductSold;
}
