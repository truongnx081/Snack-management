package com.poly.quanlybanhang.api;

import com.poly.quanlybanhang.dto.request.OrderRequest;
import com.poly.quanlybanhang.dto.response.ApiResponse;
import com.poly.quanlybanhang.dto.response.OrderResponse;
import com.poly.quanlybanhang.entity.Orders;
import com.poly.quanlybanhang.service.OrderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderControllerApi {
    OrderService orderService;

    @PostMapping
    public ApiResponse<OrderResponse> create(@RequestBody OrderRequest request){
        return ApiResponse.<OrderResponse>builder()
                .code(1000)
                .data(orderService.create(request))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<OrderResponse> update(@RequestBody OrderRequest request, @PathVariable String id){
        return ApiResponse.<OrderResponse>builder()
                .code(1000)
                .data(orderService.update(request, id))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable Integer id){
        orderService.delete(id);

        return ApiResponse.<String>builder()
                .code(1000)
                .data("Order has been deleted")
                .build();
    }

    @GetMapping
    public ApiResponse<List<OrderResponse>> getAll(){
        return ApiResponse.<List<OrderResponse>>builder()
                .code(1000)
                .data(orderService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<OrderResponse> getOne(@PathVariable String id){
        return ApiResponse.<OrderResponse>builder()
                .code(1000)
                .data(orderService.getOrder(id))
                .build();
    }

    @GetMapping("/phone/{phone}")
    public ApiResponse<Orders> getOneByPhone(@PathVariable String phone){
        return ApiResponse.<Orders>builder()
                .code(1000)
                .data(orderService.getOrderByPhone(phone))
                .build();
    }

    @GetMapping("/page")
    public ApiResponse<Page<Orders>> getUsers(@RequestParam(defaultValue = "0") int page,
                                 @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<Page<Orders>>builder()
                .code(1000)
                .data(orderService.getOrders(page, size))
                .build();
    }
}
