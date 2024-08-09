package com.poly.quanlybanhang.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin/san-pham")
public class ProductController {
    @GetMapping
    public String getProducts(){
        return "/admin/products/index";
    }
}
