package com.poly.quanlybanhang.repository;

import com.poly.quanlybanhang.entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Products, String> {
    boolean existsByName(String name);
}
