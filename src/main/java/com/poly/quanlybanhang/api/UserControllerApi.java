package com.poly.quanlybanhang.api;

import com.poly.quanlybanhang.dto.request.UserCreationRequest;
import com.poly.quanlybanhang.dto.request.UserUpdationRequest;
import com.poly.quanlybanhang.dto.response.ApiResponse;
import com.poly.quanlybanhang.dto.response.UserResponse;
import com.poly.quanlybanhang.entity.Users;
import com.poly.quanlybanhang.service.UserService;
import com.poly.quanlybanhang.utils.Ximages;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserControllerApi {
    UserService userService;

    @PostMapping
    public ApiResponse<UserResponse> create(
            @RequestPart("data") @Valid UserCreationRequest request,
            @RequestPart( value = "img", required = false)
            MultipartFile img) {

        if(img != null && !img.isEmpty()){
            String imagePath = Ximages.saveImage(img);
            request.setThumbnail(imagePath);
        }

        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .data(userService.create(request))
                .build();

    }



    @PutMapping("/{id}")
    public ApiResponse<UserResponse> update(
            @PathVariable String id, @RequestPart("data") UserUpdationRequest request,
            @RequestPart(value = "img", required = false) MultipartFile img) {

        try {

            Users existingUser = userService.getOne(id);
            if (img != null && !img.isEmpty()) {
                String imagePath = Ximages.saveImage(img);
                request.setThumbnail(imagePath);
            } else {
                request.setThumbnail(existingUser.getThumbnail());
            }

            UserResponse updatedUser = userService.update(request, id);

            return ApiResponse.<UserResponse>builder()
                    .code(1000)
                    .data(updatedUser)
                    .build();
        } catch (Exception e) {
            return ApiResponse.<UserResponse>builder()
                    .code(9999)
                    .message("Lỗi khi cập nhật người dùng: " + e.getMessage())
                    .build();
        }
    }


    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable String id){
        userService.delete(id);
        return ApiResponse.<String>builder()
                .code(1000)
                .data("User has been deleted")
                .build();
    }

    @GetMapping
    public ApiResponse<List<UserResponse>> getAll(){
        return ApiResponse.<List<UserResponse>>builder()
                .code(1000)
                .data(userService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getAll(@PathVariable String id){
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .data(userService.getUser(id))
                .build();
    }

    @GetMapping("/check-email/{email}")
    public ApiResponse<?> checkEmail(@PathVariable String email){
        return ApiResponse.<Boolean>builder()
                .code(1000)
                .data(userService.checkEmail(email))
                .build();
    }
}
