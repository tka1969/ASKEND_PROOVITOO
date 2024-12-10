package vikings.askendapi.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vikings.askendapi.dto.FilterCriteriaDto;
import vikings.askendapi.dto.FilterDto;
import vikings.askendapi.enums.RowStatusEnum;
import vikings.askendapi.repository.entity.FilterEntity;

@RequiredArgsConstructor
@Component
public class FilterMapper {

	private final FilterCriteriaMapper filterCriteriaMapper;
	
	public FilterDto toDto(FilterEntity filterEntity) {
		return new FilterDto(
			filterEntity.getId(),
			filterEntity.getName(),
			filterEntity.getSomeSelection(),
			filterEntity.getCriterias().stream().map(filterCriteriaMapper::toDto).toList()
			);
	}

	public FilterDto toDto(FilterEntity filterEntity, List<FilterCriteriaDto> filterCriterias) {
		return new FilterDto(
			filterEntity.getId(),
			filterEntity.getName(),
			filterEntity.getSomeSelection(),
			filterCriterias
			);
	}
	
	public FilterEntity toEntity(FilterDto filter) {
		FilterEntity filterEntity = FilterEntity.builder()
			.name(filter.name())
			.someSelection(filter.someSelection())
			.rowStatus(RowStatusEnum.A)
			.build();
		
		if (filter.id() != null && filter.id() != 0) {
			filterEntity.setId(filter.id());
		}
		return filterEntity;
	}
	
	public FilterEntity mapDtoToEntity(FilterDto filter, FilterEntity filterEntity) {
		filterEntity.setId(filter.id());
		filterEntity.setName(filter.name());
		filterEntity.setSomeSelection(filter.someSelection());
		filterEntity.setRowStatus(RowStatusEnum.A);
		return filterEntity;
	}
	
}
