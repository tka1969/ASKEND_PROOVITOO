package vikings.askendapi.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ParameterDto(
	Long id,
	String parameterClass,
	String property,
	String name,
	String description,
	String stringValue1,
	int intValue1,
	int intValue2,
	LocalDateTime validFrom,
	LocalDateTime validUntil
) {}
