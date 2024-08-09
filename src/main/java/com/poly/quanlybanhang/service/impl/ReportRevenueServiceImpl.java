package com.poly.quanlybanhang.service.impl;

import com.poly.quanlybanhang.dto.request.ProductRevenueRequest;
import com.poly.quanlybanhang.entity.OrderDetails;
import com.poly.quanlybanhang.report.*;

import com.poly.quanlybanhang.repository.OrderDetailRepository;
import com.poly.quanlybanhang.repository.OrderRepository;
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
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.OutputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ReportRevenueServiceImpl implements ReportRevenuService {

    OrderDetailRepository orderDetailRepository;
    OrderRepository orderRepository;
    @Override
    public List<SellHistory> getAllRevenueReport() {
        return orderDetailRepository.findRevenueReport();
    }

    @Override
    public List<CustomerStatistics> getTopCustomersByOrderValue() {
        return orderDetailRepository.findTopCustomersByOrderValue();
    }

//    @Override
//    public List<CustomerStatistics> getTopCustomersByOrderCount() {
//        return orderDetailRepository.findTopCustomersByOrderCount();
//    }

    @Override
    public List<EmployeePerformance> getEmployeePerformanceSummary() {

        return orderDetailRepository.getEmployeePerformanceSummary();
    }

    @Override
    public List<ProductRevenueStatistics> getProductRevenueByAllDates(ProductRevenueRequest request) {
        var dateStart = request.getDateStart();
        var dateEnd = request.getDateEnd();
        var productName = request.getProductName();

        return orderDetailRepository.findProductRevenueByAllDates(dateStart, dateEnd, productName);
    }

    @Override
    public Map<String, Object> getRevenueDataChart(String range) {
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate;
        switch (range){
            case "1d": startDate = endDate.minusDays(1);
                break;
            case "7d":
                startDate = endDate.minusDays(7);
                break;
            case "1m":
                startDate = endDate.minusDays(100);
                break;
            default:
                throw new IllegalStateException("Unexpected value: " + range);
        }
        List<OrderDetails> orderDetailsList = orderDetailRepository.findByCreateAtBetween(startDate, endDate);
        return generateRevenueData(orderDetailsList, range);
    }

    @Override
    public List<RevenueByGenderAllDay> RevenueByGenderAllDay() {
        return orderRepository.findRevenueByGenderAllDay();
    }

    @Override
    public List<RevenueProfitCosts> getRevenueProfitCosts() {
        return orderDetailRepository.getRevenueProfitCosts();
    }

    @Override
    public List<QuantityByProduct> getQuantityByProduct() {
        return orderDetailRepository.getProductQuantities();
    }

    @Override
    public List<totalQuantityByProduct> getTotalQuantityByProduct() {
        return orderDetailRepository.getTotalProductQuantities();
    }

    @Override
    public LocalDateTime getRevenueStartDate() {
        return orderDetailRepository.findFirstRevenueDate();
    }

    @Override
    public void exportRevenueProductToExcel(ProductRevenueRequest request, HttpServletResponse response) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

        List<ProductRevenueStatistics> reportData = getProductRevenueByAllDates(request);

        // Tạo workbook và sheet Excel
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Doanh Thu Theo Sản Phẩm");

        // Tạo hàng tiêu đề
        Row headerRow = sheet.createRow(0);
        String[] headers = {"STT", "Tên sản phẩm", "Số lượng", "Đơn giá", "Doanh thu", "Ngày bắt đầu", "Ngày kết thúc"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
        }

        // Thêm dữ liệu vào các hàng
        int rowNum = 1;
        double totalRevenue = 0.0;
        int totalQuantity = 0;
        for (int i = 0; i < reportData.size(); i++) {
            ProductRevenueStatistics data = reportData.get(i);
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(i + 1);
            row.createCell(1).setCellValue(data.getProductName());
            row.createCell(2).setCellValue(data.getQuantity());
            row.createCell(3).setCellValue(data.getPrice());
            row.createCell(4).setCellValue(data.getRevenue());

            // Cộng tổng doanh thu và số lượng sản phẩm
            totalRevenue += data.getRevenue();
            totalQuantity += data.getQuantity();

            // Format ngày tháng
            Cell dateStartCell = row.createCell(5);
            Cell dateEndCell = row.createCell(6);
            dateStartCell.setCellValue(dateFormat.format(request.getDateStart()));
            dateEndCell.setCellValue(dateFormat.format(request.getDateEnd()));
        }

        // Thêm hàng tổng doanh thu và tổng số sản phẩm
        Row totalRow = sheet.createRow(rowNum++);
        totalRow.createCell(0).setCellValue("Tổng cộng:");
        totalRow.createCell(1).setCellValue("");
        totalRow.createCell(2).setCellValue(totalQuantity);
        totalRow.createCell(3).setCellValue("");
        totalRow.createCell(4).setCellValue(totalRevenue);
        totalRow.createCell(5).setCellValue("");
        totalRow.createCell(6).setCellValue("");

        // Ghi workbook vào response output stream
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=ProductRevenue.xlsx");
        try (OutputStream outputStream = response.getOutputStream()) {
            workbook.write(outputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    private Map<String, Object> generateRevenueData(List<OrderDetails> orderDetailsList, String range) {
        Map<String, Object> response = new HashMap<>();
        List<String> labels = new ArrayList<>();
        List<Double> data = new ArrayList<>();

        // Chọn định dạng phù hợp dựa trên range
        DateTimeFormatter formatter;
        String formatPattern;

        switch (range) {
            case "1d":
                formatPattern = "HH:mm";
                break;
            case "7d":
            case "1m":
            default:
                formatPattern = "yyyy-MM-dd";
                break;
        }

        formatter = DateTimeFormatter.ofPattern(formatPattern);

        labels = orderDetailsList.stream()
                .collect(Collectors.groupingBy(od -> od.getCreateAt().format(formatter)))
                .keySet().stream().sorted().collect(Collectors.toList());

        for (String label : labels) {
            double totalRevenue = orderDetailsList.stream()
                    .filter(od -> od.getCreateAt().format(formatter).equals(label))
                    .mapToDouble(od -> od.getQuantity() * od.getPrice())
                    .sum();
            data.add(totalRevenue);
        }

        response.put("labels", labels);
        response.put("data", data);
        return response;
    }


}
