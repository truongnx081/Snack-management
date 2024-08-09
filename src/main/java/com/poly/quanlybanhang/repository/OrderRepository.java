package com.poly.quanlybanhang.repository;

import com.poly.quanlybanhang.entity.Orders;
import com.poly.quanlybanhang.report.RevenueByGenderAllDay;
import com.poly.quanlybanhang.statistical.AgeOfProductConsumption;
import com.poly.quanlybanhang.statistical.GenderOfProductConsumption;
import com.poly.quanlybanhang.statistical.SalesTimeFrame;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Orders, String> {
    Optional<Orders> findTopByPhoneOrderByCreateAtDesc(String phone);

    @Query("SELECT " +
            "new com.poly.quanlybanhang.statistical.AgeOfProductConsumption(" +
            "CASE " +
            "WHEN o.age BETWEEN 18 AND 24 THEN '18-24' " +
            "WHEN o.age BETWEEN 25 AND 34 THEN '25-34' " +
            "ELSE '35+' END, " +
            "SUM(od.quantity), " +
            "SUM(od.price * od.quantity), " +
            "(SUM(od.price * od.quantity) / ((SELECT SUM(odt.price * odt.quantity) FROM OrderDetails odt)) * 100.0))" +  // Assuming you want percentage of total sales
            "FROM Orders o JOIN o.orderDetails od JOIN od.product p JOIN p.categories c " +
            "WHERE (:ageStart IS NULL OR o.age BETWEEN :ageStart AND :ageEnd)" +
            "AND (:productNameFilter IS NULL OR p.name LIKE %:productNameFilter%) " +
            "GROUP BY " +
            "CASE " +
            "WHEN o.age BETWEEN 18 AND 24 THEN '18-24' " +
            "WHEN o.age BETWEEN 25 AND 34 THEN '25-34' " +
            "ELSE '35+' END"
            )
    List<AgeOfProductConsumption> getAgeOfProductConsumption(@Param("ageStart") Integer ageStart,
                                                             @Param("ageEnd") Integer ageEnd,
                                                             @Param("productNameFilter") String productNameFilter);

    @Query("SELECT " +
            "new com.poly.quanlybanhang.statistical.GenderOfProductConsumption(" +
            "CASE " +
            "WHEN o.gender = true THEN 'Nam' " +
            "WHEN o.gender = false THEN 'Nữ' " +
            "ELSE 'Khác' END, " +
            "SUM(od.quantity), " +
            "SUM(od.price * od.quantity), " +
            "(SUM(od.price * od.quantity) / ((SELECT SUM(odt.price * odt.quantity) FROM OrderDetails odt)) * 100.0))" +  // Assuming you want percentage of total sales
            "FROM Orders o JOIN o.orderDetails od JOIN od.product p JOIN p.categories c " +
            "WHERE (:genderFilter IS NULL OR o.gender = :genderFilter) " +
            "AND (:productNameFilter IS NULL OR p.name LIKE %:productNameFilter%) " +
            "GROUP BY " +
            "CASE " +
            "WHEN o.gender = true THEN 'Nam' " +
            "WHEN o.gender = false THEN 'Nữ' " +
            "ELSE 'Khác' END "
            )
    List<GenderOfProductConsumption> getGenderOfProductConsumption(@Param("genderFilter") Boolean genderFilter,
                                                                   @Param("productNameFilter") String productNameFilter);

    @Query("SELECT NEW com.poly.quanlybanhang.statistical.SalesTimeFrame(" +
            "    CASE " +
            "        WHEN HOUR(o.createAt) BETWEEN 6 AND 10 THEN 'Buổi sáng' " +
            "        WHEN HOUR(o.createAt) BETWEEN 11 AND 13 THEN 'Buổi trưa' " +
            "        WHEN HOUR(o.createAt) BETWEEN 14 AND 18 THEN 'Buổi chiều' " +
            "        ELSE 'Buổi tối' " +
            "    END, " +
            "    SUM(od.quantity), " +
            "    SUM(od.price * od.quantity), " +
            "(SUM(od.price * od.quantity) / ((SELECT SUM(odt.price * odt.quantity) FROM OrderDetails odt)) * 100.0))" +
            "FROM Orders o " +
            "JOIN o.orderDetails od " +
            "JOIN od.product p " +
            "JOIN p.categories c " +
            "WHERE (:dateStart IS NULL OR DATE(o.createAt) BETWEEN :dateStart AND :dateEnd) " +
            "AND (:productNameFilter IS NULL OR p.name LIKE %:productNameFilter%) " +
            "AND (:hourStart IS NULL OR HOUR(o.createAt) BETWEEN :hourStart AND :hourEnd) " +
            "GROUP BY CASE " +
            "             WHEN HOUR(o.createAt) BETWEEN 6 AND 10 THEN 'Buổi sáng' " +
            "             WHEN HOUR(o.createAt) BETWEEN 11 AND 13 THEN 'Buổi trưa' " +
            "             WHEN HOUR(o.createAt) BETWEEN 14 AND 18 THEN 'Buổi chiều' " +
            "             ELSE 'Buổi tối' " +
            "         END")
    List<SalesTimeFrame> getSalesTimeFrame(@Param("dateStart") Date dateStart,
                                           @Param("dateEnd") Date dateEnd,
                                           @Param("hourStart") Integer hourStart,
                                           @Param("hourEnd") Integer hourEnd,
                                           @Param("productNameFilter") String productNameFilter);

    @Query("SELECT new com.poly.quanlybanhang.report.RevenueByGenderAllDay(" +
            "o.gender, " +
            "SUM(o.totalAmount)) " +
            "FROM Orders o " +
            "GROUP BY o.gender")
    List<RevenueByGenderAllDay> findRevenueByGenderAllDay();
}
