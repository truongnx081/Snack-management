package com.poly.quanlybanhang.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@Table(name = "orderdetails")
public class OrderDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    int quantity;
    Double price; // khi có khuyến mãi thì giá sẽ khác so với product
    LocalDateTime createAt;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnore
    Orders order;

    @ManyToOne
    @JoinColumn(name = "product_id")
    Products product;
}
