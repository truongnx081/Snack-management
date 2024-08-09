package com.poly.quanlybanhang.service.impl;

import com.poly.quanlybanhang.dto.request.OrderDetailRequest;
import com.poly.quanlybanhang.dto.request.OrderRequest;
import com.poly.quanlybanhang.dto.response.OrderDetailResponse;
import com.poly.quanlybanhang.dto.response.OrderResponse;
import com.poly.quanlybanhang.entity.OrderDetails;
import com.poly.quanlybanhang.entity.Orders;
import com.poly.quanlybanhang.entity.Products;
import com.poly.quanlybanhang.entity.Users;
import com.poly.quanlybanhang.exception.AppException;
import com.poly.quanlybanhang.exception.ErrorCode;
import com.poly.quanlybanhang.mapper.OrderDetailMapper;
import com.poly.quanlybanhang.mapper.OrderMapper;
import com.poly.quanlybanhang.repository.OrderDetailRepository;
import com.poly.quanlybanhang.repository.OrderRepository;
import com.poly.quanlybanhang.service.OrderDetailService;
import com.poly.quanlybanhang.service.OrderService;
import com.poly.quanlybanhang.service.ProductService;
import com.poly.quanlybanhang.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class OrderDetailServiceImpl implements OrderDetailService {
    OrderDetailMapper orderDetailMapper;
    OrderDetailRepository orderDetailRepository;
    ProductService productService;
    OrderService orderService;

    @Override
    public OrderDetailResponse create(OrderDetailRequest request) {
        Orders order = orderService.getOrderByPhone(request.getPhone());

        for(String productId : request.getProduct()){
            Products product = productService.getOne(productId);

            OrderDetails orderDetail = orderDetailMapper.toOrderDetail(request);
            orderDetail.setProduct(product);
            orderDetail.setOrder(order);
            orderDetail.setCreateAt(LocalDateTime.now());
            orderDetailRepository.save(orderDetail);
        }

        return null;
    }

    @Override
    public OrderDetailResponse update(OrderDetailRequest request, String id) {
        return null;
    }

    @Override
    public void delete(String id) {
        orderDetailRepository.deleteById(id);
    }

    @Override
    public List<OrderDetailResponse> getAll() {
        return orderDetailRepository.findAll()
                .stream()
                .map(orderDetailMapper::toOrderDetailResponse)
                .toList();
    }

    @Override
    public OrderDetails getOne(String id) {
        return null;
    }

    @Override
    public OrderDetailResponse getOrderDetail(String id) {
        return orderDetailMapper.toOrderDetailResponse(orderDetailRepository.findById(id).orElseThrow(() ->
                new AppException(ErrorCode.ORDER_DETAIL_NOT_FOUND)));
    }

    @Override
    public Double getTotalRevenue() {
        return orderDetailRepository.findTotalRevenue();
    }

    @Override
    public Long getTotalQuantityProduct() {
        return orderDetailRepository.findTotalQuantityProduct();
    }

    @Override
    public Long getTotalCustomers() {
        return orderDetailRepository.findTotalCustomers();
    }

    @Override
    public Long getTotalProfit() {
        return orderDetailRepository.findTotalProfit();
    }

    @Override
    public Long getTotalProductSold() {
        return orderDetailRepository.findTotalProductSold();
    }

    @Override
    public List<OrderDetails> getOrderDetailsByOrderId(Integer orderId) {
        return orderDetailRepository.findOrderDetailsByOrderId(orderId);
    }
}
