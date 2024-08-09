package com.poly.quanlybanhang.api;

import com.poly.quanlybanhang.dto.request.ProductRevenueRequest;
import com.poly.quanlybanhang.dto.response.ApiResponse;
import com.poly.quanlybanhang.report.*;

import com.poly.quanlybanhang.service.ReportRevenuService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RequestMapping("/api/report")
public class ReportControllerApi {
    ReportRevenuService reportService;

    @GetMapping
    public List<SellHistory> getRevenueByProduct() {

        return reportService.getAllRevenueReport();

    }

    @GetMapping("/top-by-value")
    public List<CustomerStatistics> getTopCustomersByOrderValue() {
        return reportService.getTopCustomersByOrderValue();
    }

//    @GetMapping("/top-by-count")
//    public List<CustomerStatistics> getTopCustomersByOrderCount() {
//        return reportService.getTopCustomersByOrderCount();
//    }

    @GetMapping("/employee-performance")
    public List<EmployeePerformance> getEmployeePerformanceSummary() {
        return reportService.getEmployeePerformanceSummary();
    }

    @GetMapping("/revenue-profit-costs")
    public List<RevenueProfitCosts> getRevenueProfitCosts() {
        return reportService.getRevenueProfitCosts();
    }

    @GetMapping("/quantity-by-product")
    public List<QuantityByProduct> QuantityByProduct() {
        return reportService.getQuantityByProduct();
    }

    @GetMapping("/total-quantity-by-product")
    public List<totalQuantityByProduct> totalQuantityByProduct() {
        return reportService.getTotalQuantityByProduct();
    }

    @PostMapping("/product-revenue")
    public ApiResponse<List<ProductRevenueStatistics>> getRevenueByAllDates(@RequestBody ProductRevenueRequest request) {

        return ApiResponse.<List<ProductRevenueStatistics>>builder()
                .code(1000)
                .data(reportService.getProductRevenueByAllDates(request))
                .build();
    }

    @GetMapping("/export")
    public void exportToExcel(
            @RequestParam(required = false) String dateStart,
            @RequestParam(required = false) String dateEnd,
            @RequestParam(required = false) String productNameFilter,
            HttpServletResponse response) throws IOException, ParseException {

        // Chuyển đổi chuỗi ngày thành đối tượng Date
        Date startDate = dateStart != null ? new SimpleDateFormat("yyyy-MM-dd").parse(dateStart) : null;
        Date endDate = dateEnd != null ? new SimpleDateFormat("yyyy-MM-dd").parse(dateEnd) : null;

        // Tạo đối tượng request để truyền vào service
        ProductRevenueRequest request = new ProductRevenueRequest(productNameFilter,startDate,endDate);

        // Gọi phương thức trong service để xuất dữ liệu
        reportService.exportRevenueProductToExcel(request, response);

    }

    @GetMapping("/revenue/start-date")
    public ApiResponse<LocalDateTime> getRevenueStartDate() {
        LocalDateTime startDate = reportService.getRevenueStartDate();
        return ApiResponse.<LocalDateTime>builder()
                .code(1000)
                .data(startDate)
                .build();
    }
}
