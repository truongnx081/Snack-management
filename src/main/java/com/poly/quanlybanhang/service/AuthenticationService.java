package com.poly.quanlybanhang.service;

import com.nimbusds.jose.JOSEException;
import com.poly.quanlybanhang.dto.request.AuthenticationRequest;
import com.poly.quanlybanhang.dto.request.IntrospectRequest;
import com.poly.quanlybanhang.dto.response.AuthenticationResponse;
import com.poly.quanlybanhang.dto.response.IntrospectResponse;

import java.text.ParseException;

public interface AuthenticationService {
    AuthenticationResponse authenticate(AuthenticationRequest request);
    IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException;
}
