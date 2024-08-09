package com.poly.quanlybanhang.utils;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;


public class Ximages {
    public static String saveImage(MultipartFile image) {
        if (image.isEmpty()) {
            return null;
        }
        try {
            // Tạo đường dẫn file
            String originalFilename = image.getOriginalFilename();
//            String filePath = uploadPath + File.separator + originalFilename;
            String filePath = Paths.get("src/main/resources/static/images", originalFilename).toString();
            Path path = Paths.get(filePath);

            // Lưu file vào thư mục va ghi đè file nếu đã tồn tại
            Files.copy(image.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            // Trả về đường dẫn file
            return originalFilename; // Đường dẫn tương đối từ thư mục tĩnh
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + image.getOriginalFilename(), e);
        }
    }
}
