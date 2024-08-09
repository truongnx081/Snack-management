package com.poly.quanlybanhang.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin/bao-cao")
public class ReportController {
    @GetMapping("/ls-ban-hang")
    public String getSellHistory(){
        return "/admin/reports/sell-history";
    }

    @GetMapping("/hieu-suat-ban-hang")
    public String getPerformance(){
        return "/admin/reports/job-performance";
    }

    @GetMapping("/khach-hang-mua-nhieu")
    public String getCustomers(){
        return "/admin/reports/customers";
    }

    @GetMapping("/doanh-thu")
    public String getRevenue(){
        return "/admin/reports/revenue";
    }

    @GetMapping("/quyen-gop")
    public String getDonations(){
        return "/admin/reports/donations";
    }
}
