package com.poly.quanlybanhang.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.poly.quanlybanhang.entity.Inventory;
import com.poly.quanlybanhang.entity.Orders;
import com.poly.quanlybanhang.entity.Role;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String id;
    String fullname;
    String email;
//    String password;
    LocalDate dob;
    String address;
    String thumbnail;
    String phone;
    boolean gender;
    LocalDateTime createAt;
    LocalDateTime updateAt;
    Set<RoleResponse> roles;
}
