package com.poly.quanlybanhang.api;

import com.nimbusds.jose.JOSEException;
import com.poly.quanlybanhang.dto.request.AuthenticationRequest;
import com.poly.quanlybanhang.dto.request.IntrospectRequest;
import com.poly.quanlybanhang.dto.response.ApiResponse;
import com.poly.quanlybanhang.dto.response.AuthenticationResponse;
import com.poly.quanlybanhang.dto.response.IntrospectResponse;
import com.poly.quanlybanhang.service.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthenticationControllerApi {
    AuthenticationService authenticationService;

    @PostMapping("/dang-nhap")
    public ApiResponse<AuthenticationResponse> authentication(@RequestBody AuthenticationRequest request){
        var result = authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .code(1000)
                .data(result)
                .build();
    }

    @PostMapping("/introspect")
    public ApiResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        var result = authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder()
                .code(1000)
                .data(result)
                .build();
    }
}
