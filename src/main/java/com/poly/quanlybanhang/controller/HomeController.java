package com.poly.quanlybanhang.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
    @GetMapping("/admin/trang-quan-tri")
    public String getHome() {
        return "/admin/index";
    }
}
