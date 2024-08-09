package com.poly.quanlybanhang.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class Products{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String name;
    String description;
    Double price;
    String thumbnail;
    LocalDateTime createAt;
    LocalDateTime updateAt;

    @ManyToOne
    @JoinColumn(name = "category_id")
    Categories categories;

    @OneToMany(mappedBy = "product")
    @JsonIgnore
    List<OrderDetails> orderDetails;

    @OneToMany(mappedBy = "products")
    @JsonIgnore
    List<Inventory> inventories;

    Double costs;
}
