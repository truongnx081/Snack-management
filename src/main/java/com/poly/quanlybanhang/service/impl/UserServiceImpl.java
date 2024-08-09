package com.poly.quanlybanhang.service.impl;

import com.poly.quanlybanhang.dto.request.UserCreationRequest;
import com.poly.quanlybanhang.dto.request.UserUpdationRequest;
import com.poly.quanlybanhang.dto.response.AuthenticationResponse;
import com.poly.quanlybanhang.dto.response.UserResponse;
import com.poly.quanlybanhang.entity.Role;
import com.poly.quanlybanhang.entity.Users;
import com.poly.quanlybanhang.enums.Roles;
import com.poly.quanlybanhang.exception.AppException;
import com.poly.quanlybanhang.exception.ErrorCode;
import com.poly.quanlybanhang.mapper.UserMapper;
import com.poly.quanlybanhang.repository.RoleRepository;
import com.poly.quanlybanhang.repository.UserRepository;
import com.poly.quanlybanhang.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    UserMapper userMapper;
    UserRepository userRepository;
    RoleRepository roleRepository;

    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    @Override
    public UserResponse create(UserCreationRequest request) {
        if(userRepository.existsByEmail(request.getEmail()))
            throw new AppException(ErrorCode.EMAIL_EXISTS);
        System.out.println("Call Service successfully");
        Set<Role> roles = new HashSet<>();
        Role role = new Role();

        Users user = userMapper.toUser(request);

        role.setName(Roles.STAFF.name());
        roles.add(role);

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(roles);
        user.setCreateAt(LocalDateTime.now());

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    public UserResponse update(UserUpdationRequest request, String id) {
        Users user = this.getOne(id);
        var password = user.getPassword();

        Set<Role> roles;
        if (request.getRoles() == null || request.getRoles().isEmpty()) {
            roles = user.getRoles();
        } else {
            roles = new HashSet<>(roleRepository.findAllById(request.getRoles()));
            if (roles.isEmpty()) {
                throw new IllegalArgumentException("No roles found for the provided role IDs");
            }
        }

        userMapper.updateUser(user, request);

        user.setRoles(roles);
        user.setUpdateAt(LocalDateTime.now());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        if (request.getPassword().equals("password")) {
            user.setPassword(password);
        }

        // Lưu người dùng và trả về response
        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    public void delete(String id) {
        userRepository.deleteById(id);
    }

    @Override
    public List<UserResponse> getAll() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toUserResponse)
                .toList();
    }

    @Override
    public Users getOne(String id) {
        return userRepository.findById(id).orElseThrow(() ->
                new AppException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    public UserResponse getUser(String id) {
        return userMapper.toUserResponse(this.getOne(id));
    }

    @Override
    public boolean checkEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
