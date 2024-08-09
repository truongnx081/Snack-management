package com.poly.quanlybanhang.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class RoleResponse {
    String name;
    String description;
    Set<PermissionResponse> permissions;
}
