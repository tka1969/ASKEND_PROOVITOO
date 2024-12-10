package vikings.askendapi.dto;

import java.util.List;
import jakarta.validation.constraints.NotNull;
import vikings.askendapi.enums.SomeSelectionEnum;

public record FilterDto(
    Long id,
    @NotNull
    String name,
  	@NotNull
  	SomeSelectionEnum someSelection,
    List<FilterCriteriaDto> criterias
) {}
