package vikings.askendapi.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum ErrorCodes {
	FILTER_NOT_FOUND("filter.not.found"),
	FILTER_CRITERIA_NOT_FOUND("filter.criteria.not.found"),
	PARAMETER_NOT_FOUND("parameter.not.found");
	
	private final String errorCode;
}
