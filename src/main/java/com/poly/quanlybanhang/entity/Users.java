package com.poly.quanlybanhang.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String fullname;
    String email;
    String password;
    LocalDate dob;
    String address;
    String thumbnail;
    String phone;
    boolean gender;
    LocalDateTime createAt;
    LocalDateTime updateAt;

    @ManyToMany
    Set<Role> roles;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    List<Inventory> inventories;

    @OneToMany(mappedBy = "user")
    List<Orders> orders;
}
