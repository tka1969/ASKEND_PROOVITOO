package vikings.askendapi.services;

import vikings.askendapi.constants.GlobalConstants;
import vikings.askendapi.dto.FilterCriteriaDto;
import vikings.askendapi.dto.FilterDto;
import vikings.askendapi.dto.FilterListDto;
import vikings.askendapi.enums.ErrorCodes;
import vikings.askendapi.enums.RowStatusEnum;
import vikings.askendapi.exceptions.RestException;
import vikings.askendapi.mapper.FilterMapper;
import vikings.askendapi.repository.FilterEntityRepository;
import vikings.askendapi.repository.entity.FilterEntity;

import java.util.List;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class FilterService {
	private final FilterEntityRepository filterRepository;
	private final FilterCriteriaService filterCriteriaService;
	private final FilterMapper filterMapper;

	public List<FilterListDto> getList() {
		return filterRepository.findByRowStatus(RowStatusEnum.A);
	}
	
	public FilterDto get(Long id) {
		if (id != null && id > 0) {
			return filterMapper.toDto(filterRepository.findById(id).orElseThrow(() -> getFilterRestException(id)));
		}
		throw getFilterRestException(id);
	}
	
	@Transactional
	public FilterDto add(FilterDto filter) {
		FilterEntity savedFilterEntity = filterRepository.save(filterMapper.toEntity(filter));
		List<FilterCriteriaDto> filterCriterias = filterCriteriaService.bulkSave(savedFilterEntity.getId(), filter.criterias());
		return filterMapper.toDto(savedFilterEntity, filterCriterias);
	}
	
	@Transactional
	public FilterDto save(FilterDto filter) {
		FilterEntity filterEntity = filterRepository.findById(filter.id()).orElseThrow(() -> getFilterRestException(filter.id()));
		filterMapper.mapDtoToEntity(filter, filterEntity);
		FilterEntity savedFilterEntity = filterRepository.save(filterEntity);
		List<FilterCriteriaDto> filterCriterias = filterCriteriaService.bulkSave(savedFilterEntity.getId(), filter.criterias());
		return filterMapper.toDto(savedFilterEntity, filterCriterias);
	}

	@Transactional
	public boolean deleteById(Long id) {
		filterCriteriaService.deleteByFilterId(id);
		if (filterRepository.updateToDeletedById(id, GlobalConstants.MODIFIED_BY) < 1) {
			getFilterRestException(id);
		}
		return true;
	}
	
	private RestException getFilterRestException(Long id) {
		return new RestException(HttpStatus.NOT_FOUND, ErrorCodes.FILTER_NOT_FOUND.getErrorCode(), "Invalid filter id (" + id + ")");
	}

}
