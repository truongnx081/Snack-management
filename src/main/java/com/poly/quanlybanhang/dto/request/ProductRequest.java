package com.poly.quanlybanhang.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ProductRequest {
    String name;
    String description;
    Double price;
    String categories;
    String thumbnail;
    Double costs;
}
