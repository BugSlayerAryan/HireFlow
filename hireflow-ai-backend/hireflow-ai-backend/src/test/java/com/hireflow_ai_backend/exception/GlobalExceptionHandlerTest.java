package com.hireflow_ai_backend.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

class GlobalExceptionHandlerTest {
    @Test
    void preservesResponseStatusExceptionStatusAndMessage() {
        GlobalExceptionHandler handler = new GlobalExceptionHandler();
        var response = handler.handleResponseStatus(
                new ResponseStatusException(HttpStatus.FORBIDDEN, "Role mismatch"));

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("Role mismatch", response.getBody().get("message"));
    }
}
