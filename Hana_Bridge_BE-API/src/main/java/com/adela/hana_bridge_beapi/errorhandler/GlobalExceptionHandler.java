package com.adela.hana_bridge_beapi.errorhandler;

import com.adela.hana_bridge_beapi.config.jwt.JwtValidationException;
import com.adela.hana_bridge_beapi.dto.error.ErrorResponse;
import com.adela.hana_bridge_beapi.errorhandler.error.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest()
                .body(new ErrorResponse("BAD_REQUEST", ex.getMessage()));
    }

    @ExceptionHandler(AssembleBoardNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleAssembleBoardNotFound(AssembleBoardNotFoundException ex) {
        return ResponseEntity.status(404)
                .body(new ErrorResponse("ASSEMBLEBOARD_NOT_FOUND", ex.getMessage()));
    }

    @ExceptionHandler(BoardNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleBoardNotFound(BoardNotFoundException ex) {
        return ResponseEntity.status(404)
                .body(new ErrorResponse("BOARD_NOT_FOUND", ex.getMessage()));
    }

    @ExceptionHandler(UserEmailNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserEmailNotFound(UserEmailNotFoundException ex) {
        return ResponseEntity.status(404)
                .body(new ErrorResponse("USEREMAIL_NOT_FOUND", ex.getMessage()));
    }

    @ExceptionHandler(CategoryPostNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleCategoryPostNotFound(CategoryPostNotFoundException ex) {
        return ResponseEntity.status(404)
                .body(new ErrorResponse("CATEGORY_POST_NOT_FOUND", ex.getMessage()));
    }

    @ExceptionHandler(UserIdNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserIdNotFound(UserIdNotFoundException ex) {
        return ResponseEntity.status(404)
                .body(new ErrorResponse("USEREMAIL_USERID_NOT_FOUND", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldError().getDefaultMessage();
        return ResponseEntity.badRequest()
                .body(new ErrorResponse("VALIDATION_FAILED", errorMessage));
    }

    //accessToken 처리 시에 발생하는 401오류
    @ExceptionHandler(JwtValidationException.class)
    public ResponseEntity<?> handleJwtValidationException(JwtValidationException ex) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(Map.of(
                        "code", "UNAUTHORIZED",
                        "message", ex.getMessage()
                ));
    }
}
