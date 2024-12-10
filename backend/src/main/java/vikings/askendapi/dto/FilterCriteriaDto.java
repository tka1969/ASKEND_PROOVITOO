package vikings.askendapi.dto;

import jakarta.validation.constraints.NotNull;

public record FilterCriteriaDto(
		Long id,
		@NotNull
		Long filterId,
		@NotNull
		Long criteriaId,
		@NotNull
		Long conditionTypeId,
		@NotNull
		String conditionValue
) {}
