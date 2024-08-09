package com.poly.quanlybanhang.dto.response;

import com.poly.quanlybanhang.entity.Categories;
import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ProductResponse {
    String id;
    String name;
    String description;
    Double price;
    Categories categories;
    String thumbnail;
    Double costs;
}
