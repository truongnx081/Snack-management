package com.poly.quanlybanhang.service.impl;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.poly.quanlybanhang.dto.request.AuthenticationRequest;
import com.poly.quanlybanhang.dto.request.IntrospectRequest;
import com.poly.quanlybanhang.dto.response.AuthenticationResponse;
import com.poly.quanlybanhang.dto.response.IntrospectResponse;
import com.poly.quanlybanhang.exception.AppException;
import com.poly.quanlybanhang.exception.ErrorCode;
import com.poly.quanlybanhang.mapper.UserMapper;
import com.poly.quanlybanhang.repository.UserRepository;
import com.poly.quanlybanhang.service.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private static final Logger log = LoggerFactory.getLogger(AuthenticationServiceImpl.class);
    UserMapper userMapper;
    UserRepository userRepository;

    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    @NonFinal
    protected static final String SIGNAL_KEY =
            "O55uT11pp3NPqUysI1LP0uDYDBKPXYhre+SjbRuQBkJ1a8aoCynEZYs1FRwDYwY8";

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var user = userRepository.findByEmail(request.getEmail()).orElseThrow(() ->
                new AppException(ErrorCode.USER_NOT_EXISTS));

    boolean authenticate = passwordEncoder.matches(request.getPassword(), user.getPassword());

    if(!authenticate)
        throw new AppException(ErrorCode.UNAUTHENTICATED);

    var token = generateToken(request.getEmail());

    return AuthenticationResponse.builder()
            .authentication(true)
            .token(token)
            .build();
    }

    @Override
    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        var token = request.getToken();
        JWSVerifier jwsVerifier = new MACVerifier(SIGNAL_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        var expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        var verify = signedJWT.verify(jwsVerifier);

        return IntrospectResponse.builder()
                .valid(verify && expiryTime.after(new Date()))
                .build();
    }

    public String generateToken(String email){
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(email)
                .issuer("huunghia.com")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(jwsHeader, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNAL_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }
    }
}
