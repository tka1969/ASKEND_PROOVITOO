package vikings.askendapi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import vikings.askendapi.dto.ParameterDto;
import vikings.askendapi.repository.entity.ParameterEntity;

public interface ParameterEntityRepository extends JpaRepository<ParameterEntity, Long> {

  List<ParameterDto> findByParameterClassIn(List<String> parameterClasses);
	
  Optional<ParameterDto> findParameterDtoById(Long parameterId);

}
