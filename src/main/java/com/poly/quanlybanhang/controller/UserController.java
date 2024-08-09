package com.poly.quanlybanhang.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin/nguoi-dung")
public class UserController {
    @GetMapping
    public String getUsers(){
        return "/admin/users/index";
    }
}
