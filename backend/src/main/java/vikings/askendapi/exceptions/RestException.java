package vikings.askendapi.exceptions;

import org.springframework.http.HttpStatusCode;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class RestException extends RuntimeException {
	private final HttpStatusCode status;
	private final String code;
	private final String message;
}
