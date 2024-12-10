package vikings.askendapi.dto;

import vikings.askendapi.enums.SomeSelectionEnum;

public record FilterListDto(
    Long id,
    String name,
    SomeSelectionEnum someSelection
) {}
