package com.poly.quanlybanhang.repository;

import com.poly.quanlybanhang.dto.response.OrderDetailResponse;
import com.poly.quanlybanhang.entity.OrderDetails;
import com.poly.quanlybanhang.report.*;
import com.poly.quanlybanhang.statistical.AgeOfProductConsumption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetails, String> {

    @Query("SELECT new com.poly.quanlybanhang.report.SellHistory(" +
            "o.id, " +
            "o.fullname, " +
            "o.phone, " +
            "o.totalAmount, " +
            "o.status, " +
            "u.fullname, " +
            "o.createAt) " +
            "FROM Orders o JOIN o.user u " +
            "GROUP BY o.id, o.fullname, o.phone, o.totalAmount, o.status, u.fullname, o.createAt " +
            "ORDER BY o.id DESC")
    List<SellHistory> findRevenueReport();


    @Query("SELECT new com.poly.quanlybanhang.report.CustomerStatistics(" +
            "o.fullname, " +
            "COUNT(DISTINCT(o.id)), " +
            "SUM(od.quantity), " +
            "SUM(CAST(od.price * od.quantity AS double)), " +
            "o.createAt) " +
            "FROM Orders o JOIN o.orderDetails od " +
            "GROUP BY o.fullname, " +
            "o.createAt " +
            "ORDER BY SUM(od.price * od.quantity) DESC")
    List<CustomerStatistics> findTopCustomersByOrderValue();


//    @Query("SELECT new com.poly.quanlybanhang.report.CustomerStatistics(" +
//            "o.fullname, " +
//            "COUNT(o), " +
//            "SUM(od.quantity), " +
//            "SUM(od.price), " +
//            "(SELECT p.name FROM OrderDetails od2 JOIN od2.product p WHERE od2.order.phone = o.phone GROUP BY p.name ORDER BY SUM(od2.quantity) DESC LIMIT 1), " +
//            "MAX(o.createAt)) " +
//            "FROM Orders o JOIN o.orderDetails od " +
//            "GROUP BY o.fullname, o.phone " +
//            "ORDER BY COUNT(o) DESC")
//    List<CustomerStatistics> findTopCustomersByOrderCount();


    @Query("SELECT new com.poly.quanlybanhang.report.EmployeePerformance(" +
            "u.fullname, " +
            "COUNT(DISTINCT o.id), " +
            "SUM(od.price * od.quantity), " +
            "MAX(o.createAt)) " +
            "FROM Orders o " +
            "JOIN o.user u " +
            "JOIN o.orderDetails od " +
            "GROUP BY u.id, u.fullname " +
            "ORDER BY COUNT(DISTINCT o.id) DESC")
    List<EmployeePerformance> getEmployeePerformanceSummary();

    @Query("SELECT new com.poly.quanlybanhang.report.ProductRevenueStatistics(" +
            "p.name, " +
            "SUM(od.quantity), " +
            "p.price, " +
            "SUM(od.quantity * od.price)) " +
            "FROM OrderDetails od JOIN od.product p " +
            "WHERE (:dateStart IS NULL OR DATE(od.createAt) BETWEEN :dateStart AND :dateEnd) " +
            "AND (:productNameFilter IS NULL OR p.name LIKE %:productNameFilter%) " +
            "GROUP BY p.name, p.price ")
    List<ProductRevenueStatistics> findProductRevenueByAllDates(@Param("dateStart") Date dateStart,
                                                                @Param("dateEnd") Date dateEnd,
                                                                @Param("productNameFilter") String productNameFilter);

    @Query("SELECT SUM(od.quantity * od.price) FROM OrderDetails od")
    Double findTotalRevenue();

    @Query("SELECT COUNT(p.name) FROM Products p")
    Long findTotalQuantityProduct();

    @Query("SELECT COUNT(DISTINCT o.fullname) FROM Orders o")
    Long findTotalCustomers();

    @Query("SELECT SUM((p.price - p.costs) * od.quantity) " +
            "FROM OrderDetails od " +
            "JOIN od.product p")
    Long findTotalProfit();

    @Query("SELECT od FROM OrderDetails od WHERE od.order.id = :orderId")
    List<OrderDetails> findOrderDetailsByOrderId(@Param("orderId") Integer orderId);

    @Query("SELECT od FROM OrderDetails od WHERE od.createAt BETWEEN :startDate AND :endDate")
    List<OrderDetails> findByCreateAtBetween(LocalDateTime startDate, LocalDateTime endDate);


    @Query("SELECT SUM(od.quantity) " +
            "FROM OrderDetails od ")
    Long findTotalProductSold();


    @Query("SELECT new com.poly.quanlybanhang.report.RevenueProfitCosts(" +
            "SUM(od.price * od.quantity), " +
            "SUM((od.price - p.costs) * od.quantity), " +
            "SUM(p.costs * od.quantity), " +
            "DATE(od.createAt)) " +
            "FROM OrderDetails od " +
            "JOIN od.product p " +
            "GROUP BY DATE(od.createAt)")
    List<RevenueProfitCosts> getRevenueProfitCosts();

    @Query("SELECT new com.poly.quanlybanhang.report.QuantityByProduct(" +
            "p.name, " +
            "SUM(od.quantity), " +
            "DATE(od.createAt)) " +
            "FROM OrderDetails od JOIN od.product p " +
            "GROUP BY p.name, DATE(od.createAt)")
    List<QuantityByProduct> getProductQuantities();

    @Query("SELECT new com.poly.quanlybanhang.report.totalQuantityByProduct(" +
            "p.name, " +
            "SUM(od.quantity))"+
            "FROM OrderDetails od JOIN od.product p " +
            "GROUP BY p.name")
    List<totalQuantityByProduct> getTotalProductQuantities();

    @Query("SELECT MIN(od.createAt) FROM OrderDetails od")
    LocalDateTime findFirstRevenueDate();

}