package com.poly.quanlybanhang.api;

import com.poly.quanlybanhang.dto.request.AgeOfProductConsumptionRequest;
import com.poly.quanlybanhang.dto.request.GenderOfProductConsumptionRequest;
import com.poly.quanlybanhang.dto.request.SalesTimeFrameRequest;
import com.poly.quanlybanhang.dto.response.ApiResponse;
import com.poly.quanlybanhang.service.OrderService;
import com.poly.quanlybanhang.statistical.AgeOfProductConsumption;
import com.poly.quanlybanhang.statistical.GenderOfProductConsumption;
import com.poly.quanlybanhang.statistical.SalesTimeFrame;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/statistical")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class StatisticalControllerApi {
    OrderService orderService;

    @PostMapping("/age-of-product-consumption")
    public ApiResponse<List<AgeOfProductConsumption>> getAgeOfProductConsumption(
            @RequestBody AgeOfProductConsumptionRequest request
            ){
        return ApiResponse.<List<AgeOfProductConsumption>>builder()
                .code(1000)
                .data(orderService.getAgeOfProductConsumption(request))
                .build();
    }

    @PostMapping("/gender-of-product-consumption")
    public ApiResponse<List<GenderOfProductConsumption>> getGenderOfProductConsumption(
            @RequestBody GenderOfProductConsumptionRequest request
            ){
        return ApiResponse.<List<GenderOfProductConsumption>>builder()
                .code(1000)
                .data(orderService.getGenderOfProductConsumption(request))
                .build();
    }

//    @GetMapping("/sales-time-frame")
//    public ApiResponse<List<SalesTimeFrame>> getSalesTimeFrame(){
//        return ApiResponse.<List<SalesTimeFrame>>builder()
//                .code(1000)
//                .data(orderService.getSalesTimeFrame())
//                .build();
//    }

    @PostMapping("/sales-time-frame")
        public ApiResponse<List<SalesTimeFrame>> getSalesTimeFrame(@RequestBody SalesTimeFrameRequest request){
        return ApiResponse.<List<SalesTimeFrame>>builder()
                .code(1000)
                .data(orderService.getSalesTimeFrame(request))
                .build();
    }
}
