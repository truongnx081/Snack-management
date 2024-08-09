package com.poly.quanlybanhang.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SalesTimeFrameRequest {
     Date dateStart;
     Date dateEnd;
     String timeFrame;
     String productName;
}
