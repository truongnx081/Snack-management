package com.poly.quanlybanhang.api;

import com.poly.quanlybanhang.dto.request.OrderDetailRequest;
import com.poly.quanlybanhang.dto.request.OrderRequest;
import com.poly.quanlybanhang.dto.response.ApiResponse;
import com.poly.quanlybanhang.dto.response.OrderDetailResponse;
import com.poly.quanlybanhang.dto.response.OrderResponse;
import com.poly.quanlybanhang.entity.OrderDetails;
import com.poly.quanlybanhang.entity.Orders;
import com.poly.quanlybanhang.service.OrderDetailService;
import com.poly.quanlybanhang.service.OrderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RequestMapping("/api/orders-detail")
public class OrderDetailControllerApi {
    OrderDetailService orderDetailService;

    @PostMapping
    public ApiResponse<OrderDetailResponse> create(@RequestBody OrderDetailRequest request){
        return ApiResponse.<OrderDetailResponse>builder()
                .code(1000)
                .data(orderDetailService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<OrderDetailResponse>> getAll(){
        return ApiResponse.<List<OrderDetailResponse>>builder()
                .code(1000)
                .data(orderDetailService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<OrderDetailResponse> getOne(@PathVariable String id){
        return ApiResponse.<OrderDetailResponse>builder()
                .code(1000)
                .data(orderDetailService.getOrderDetail(id))
                .build();
    }

    @GetMapping("/{orderId}/details")
    public List<OrderDetails> getOrderDetailsByOrderId(@PathVariable Integer orderId) {
        return orderDetailService.getOrderDetailsByOrderId(orderId);
    }


    @DeleteMapping("/{id}")
    public  ApiResponse<?> delOrderDetailById(@PathVariable String id){
        orderDetailService.delete(id);
        return ApiResponse.builder()
                .code(1000)
                .data("OrderDetail has been deleted")
                .build();
    }
}
