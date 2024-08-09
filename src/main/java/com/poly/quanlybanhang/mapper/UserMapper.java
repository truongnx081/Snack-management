package com.poly.quanlybanhang.mapper;

import com.poly.quanlybanhang.dto.request.UserCreationRequest;
import com.poly.quanlybanhang.dto.request.UserUpdationRequest;
import com.poly.quanlybanhang.dto.response.UserResponse;
import com.poly.quanlybanhang.entity.Users;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    Users toUser(UserCreationRequest request);
    UserResponse toUserResponse(Users user);

    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "password", ignore = true)
    void updateUser(@MappingTarget Users user, UserUpdationRequest request);
}
