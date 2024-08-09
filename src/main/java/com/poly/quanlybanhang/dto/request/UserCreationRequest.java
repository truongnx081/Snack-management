package com.poly.quanlybanhang.dto.request;

import com.poly.quanlybanhang.dto.response.RoleResponse;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CurrentTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
    String fullname;

    @Column(unique = true)
    @NotEmpty(message = "EMAIL_INVALID")
    String email;

    @Size(min = 5, message = "PASSWORD_INVALID")
    String password;
    LocalDate dob;
    String address;
    String thumbnail;
    String phone;
    boolean gender;
}
