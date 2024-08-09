package com.poly.quanlybanhang.dto.request;

import com.poly.quanlybanhang.entity.Role;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdationRequest {
    String fullname;

    @Size(min = 5, message = "Password must be at least 5 characters")
    String password;
    LocalDate dob;
    String address;
    String thumbnail;
    String phone;
    boolean gender;
    Set<String> roles;
}
