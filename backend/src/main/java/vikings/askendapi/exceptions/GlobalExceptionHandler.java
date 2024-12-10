package vikings.askendapi.exceptions;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import vikings.askendapi.model.ErrorResponse;

@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class GlobalExceptionHandler {

	@ExceptionHandler(RestException.class)
	public ResponseEntity<ErrorResponse> handleRestException(RestException execp) {
		ErrorResponse errorResponse = new ErrorResponse(execp.getCode(), execp.getMessage());
		return ResponseEntity.status(execp.getStatus()).body(errorResponse);
	}
}
