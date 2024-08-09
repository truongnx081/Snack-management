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
public class SellHistory {
     int id;
     String userFullName;
     String phone;
     Double revenue;
     String status;
     String nameEmployee;
     LocalDateTime day;

}
