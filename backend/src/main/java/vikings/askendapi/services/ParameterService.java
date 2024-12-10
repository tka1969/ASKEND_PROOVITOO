package vikings.askendapi.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vikings.askendapi.dto.ParameterDto;
import vikings.askendapi.enums.ErrorCodes;
import vikings.askendapi.exceptions.RestException;
import vikings.askendapi.repository.ParameterEntityRepository;


@Service
@RequiredArgsConstructor
public class ParameterService {
	
	private final ParameterEntityRepository parameterRepository;

	public List<ParameterDto> getList(List<String> parameterClasses) {
		return parameterRepository.findByParameterClassIn(parameterClasses);
  }
	
	public ParameterDto getParameter(Long id) {
		if (id != null && id > 0) {
			return parameterRepository.findParameterDtoById(id).orElseThrow(() -> getParameterRestException(id));
		}
		throw getParameterRestException(id);
	}
	
	public RestException getParameterRestException(Long id) {
		return new RestException(HttpStatus.NOT_FOUND, ErrorCodes.PARAMETER_NOT_FOUND.getErrorCode(), "Invalid parameter id (" + id + ")");
	}

}
