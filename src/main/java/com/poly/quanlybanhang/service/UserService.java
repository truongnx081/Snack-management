package com.poly.quanlybanhang.service;

import com.poly.quanlybanhang.dto.request.UserCreationRequest;
import com.poly.quanlybanhang.dto.request.UserUpdationRequest;
import com.poly.quanlybanhang.dto.response.UserResponse;
import com.poly.quanlybanhang.entity.Users;

import java.util.List;

public interface UserService {
    UserResponse create(UserCreationRequest request);
    UserResponse update(UserUpdationRequest request, String id);
    void delete(String id);
    List<UserResponse> getAll();
    Users getOne(String id);
    UserResponse getUser(String id);
    boolean checkEmail(String email);
}
