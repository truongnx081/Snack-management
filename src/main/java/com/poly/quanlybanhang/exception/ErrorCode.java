package com.poly.quanlybanhang.exception;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized exception"),
    EMAIL_EXISTS(1001, "Email existed"),
    USER_NOT_FOUND(1002, "User not found"),
    EMAIL_INVALID(1003, "Email not empty"),
    PASSWORD_INVALID(1004, "Password must be at least 5 characters"),
    INVALID_KEY(1005, "Invalid message key"),
    USER_NOT_EXISTS(1006, "User not exists"),
    UNAUTHENTICATED(1007, "Unauthenticated"),
    PRODUCT_NOT_FOUND(1008, "Product not found"),
    CATEGORY_NOT_FOUND(1008, "Category not found"),
    ORDER_NOT_FOUND(1008, "Order not found"),
    ORDER_DETAIL_NOT_FOUND(1008, "Order detail not found"),
    ;

    int code;
    String message;
}
