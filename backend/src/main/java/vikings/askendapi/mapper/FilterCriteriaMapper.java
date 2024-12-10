package vikings.askendapi.mapper;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vikings.askendapi.dto.FilterCriteriaDto;
import vikings.askendapi.enums.RowStatusEnum;
import vikings.askendapi.repository.entity.FilterCriteriaEntity;

@RequiredArgsConstructor
@Component
public class FilterCriteriaMapper {
	
	public FilterCriteriaDto toDto(FilterCriteriaEntity filterCriteriaEntity) {
		return new FilterCriteriaDto(
				filterCriteriaEntity.getId(),
				filterCriteriaEntity.getFilterId(),
				filterCriteriaEntity.getCriteriaId(),
				filterCriteriaEntity.getConditionTypeId(),
				filterCriteriaEntity.getConditionValue());
	}

	public FilterCriteriaEntity toEntity(FilterCriteriaDto filterCriteria) {
		FilterCriteriaEntity filterCriteriaEntity = FilterCriteriaEntity.builder()
			.filterId(filterCriteria.filterId())
			.criteriaId(filterCriteria.criteriaId())
			.conditionTypeId(filterCriteria.conditionTypeId())
			.conditionValue(filterCriteria.conditionValue())
			.rowStatus(RowStatusEnum.A)
			.build();
		
		if (filterCriteria.id() != null && filterCriteria.id() != 0) {
			filterCriteriaEntity.setId(filterCriteria.id());
		}
		return filterCriteriaEntity;
	}
	
	public FilterCriteriaEntity mapDtoToEntity(FilterCriteriaDto filter, FilterCriteriaEntity filterCriteriaEntity) {
		filterCriteriaEntity.setId(filter.id());
		filterCriteriaEntity.setFilterId(filter.filterId());
		filterCriteriaEntity.setCriteriaId(filter.criteriaId());
		filterCriteriaEntity.setConditionTypeId(filter.conditionTypeId());
		filterCriteriaEntity.setConditionValue(filter.conditionValue());
		filterCriteriaEntity.setRowStatus(RowStatusEnum.A);
		return filterCriteriaEntity;
	}
	
}
