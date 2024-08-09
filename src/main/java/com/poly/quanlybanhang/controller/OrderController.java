package com.poly.quanlybanhang.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin/don-hang")
public class OrderController {
    @GetMapping
    public String getOrders(){
        return "/admin/orders/index";
    }
}
