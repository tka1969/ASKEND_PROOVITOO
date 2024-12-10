package vikings.askendapi.services;

import vikings.askendapi.constants.GlobalConstants;
import vikings.askendapi.dto.FilterCriteriaDto;
import vikings.askendapi.enums.ErrorCodes;
import vikings.askendapi.enums.RowStatusEnum;
import vikings.askendapi.exceptions.RestException;
import vikings.askendapi.mapper.FilterCriteriaMapper;
import vikings.askendapi.repository.FilterCriteriaEntityRepository;
import vikings.askendapi.repository.entity.FilterCriteriaEntity;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class FilterCriteriaService {
	private final FilterCriteriaEntityRepository filterCriteriaRepository;
	private final FilterCriteriaMapper filterCriteriaMapper;

	public List<FilterCriteriaDto> getList(Long filterId) {
		return filterCriteriaRepository.findAllByFilterIdAndRowStatus(filterId, RowStatusEnum.A);
	}

	@Transactional
	public FilterCriteriaDto add(FilterCriteriaDto filterCriteria) {
		return filterCriteriaMapper.toDto(filterCriteriaRepository.save(filterCriteriaMapper.toEntity(filterCriteria)));
	}
	
	/*@Transactional
	public FilterCriteriaDto save(FilterCriteriaDto filterCriteria) {
		FilterCriteriaEntity filterCrieriaEntity = filterCriteriaRepository.findById(filterCriteria.id()).orElseThrow(() -> getFilterCriteriaRestException(filterCriteria.id()));
		filterCriteriaMapper.mapDtoToEntity(filterCriteria, filterCrieriaEntity);
		return filterCriteriaMapper.toDto(filterCriteriaRepository.save(filterCrieriaEntity));
	}*/

	public FilterCriteriaDto addWithFilterId(Long filterId, FilterCriteriaDto filterCriteria) {
		FilterCriteriaEntity filterCrieriaEntity = filterCriteriaMapper.toEntity(filterCriteria);
		filterCrieriaEntity.setFilterId(filterId);
		return filterCriteriaMapper.toDto(filterCriteriaRepository.save(filterCrieriaEntity));
	}
	
	public FilterCriteriaDto saveWithFilterId(Long filterId, FilterCriteriaDto filterCriteria) {
		FilterCriteriaEntity filterCrieriaEntity = filterCriteriaRepository.findById(filterCriteria.id()).orElseThrow(() -> getFilterCriteriaRestException(filterCriteria.id()));
		filterCriteriaMapper.mapDtoToEntity(filterCriteria, filterCrieriaEntity);
		filterCrieriaEntity.setFilterId(filterId);
		return filterCriteriaMapper.toDto(filterCriteriaRepository.save(filterCrieriaEntity));
	}
	
	public List<FilterCriteriaDto> bulkSave(Long filterId, List<FilterCriteriaDto> filterCriterias) {
		List<FilterCriteriaDto> critList = new ArrayList<>();
		filterCriterias.forEach(criteria -> {
			if (criteria.id() != null && criteria.id() != 0) {
				critList.add(saveWithFilterId(filterId, criteria));
			}
			else {
				critList.add(addWithFilterId(filterId, criteria));
			}
		});
		return critList;
	}
	
	@Transactional
	public boolean deleteById(Long id) {
		if (filterCriteriaRepository.updateToDeletedById(id, GlobalConstants.MODIFIED_BY) < 1) {
			throw getFilterCriteriaRestException(id);
		}
		return true;
	}
	
	@Transactional
	public boolean deleteByFilterId(Long filterId) {
		if (filterCriteriaRepository.updateToDeletedByFilterId(filterId, GlobalConstants.MODIFIED_BY) < 1) {
			throw getFilterCriteriaRestException(filterId);
		}
		return true;
	}
	
	private RestException getFilterCriteriaRestException(Long id) {
		return new RestException(HttpStatus.NOT_FOUND, ErrorCodes.FILTER_CRITERIA_NOT_FOUND.getErrorCode(), "Invalid filter criteria id (" + id + ")");
	}

}
