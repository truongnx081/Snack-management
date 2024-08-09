package com.poly.quanlybanhang.service;

import com.poly.quanlybanhang.dto.request.OrderDetailRequest;
import com.poly.quanlybanhang.dto.response.OrderDetailResponse;
import com.poly.quanlybanhang.entity.OrderDetails;
import com.poly.quanlybanhang.report.RevenueProfitCosts;

import java.util.List;

public interface OrderDetailService {
    OrderDetailResponse create(OrderDetailRequest request);
    OrderDetailResponse update(OrderDetailRequest request, String id);
    void delete(String id);
    List<OrderDetailResponse> getAll();
    OrderDetails getOne(String id);
    OrderDetailResponse getOrderDetail(String id);

    public Double getTotalRevenue();
    public Long getTotalQuantityProduct();
    public Long getTotalCustomers();

    public Long getTotalProfit();
    public Long getTotalProductSold();

    public List<OrderDetails> getOrderDetailsByOrderId(Integer orderId);

}
