package com.poly.quanlybanhang.repository;

import com.poly.quanlybanhang.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, String> {
    boolean existsByEmail(String email);
    Optional<Users> findByEmail(String email);
}
