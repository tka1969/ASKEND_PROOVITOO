package vikings.askendapi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vikings.askendapi.dto.FilterListDto;
import vikings.askendapi.enums.RowStatusEnum;
import vikings.askendapi.repository.entity.FilterEntity;

@Repository
public interface FilterEntityRepository extends JpaRepository<FilterEntity, Long> {

	List<FilterListDto> findByRowStatus(RowStatusEnum rowStatus);
	
	@Modifying(clearAutomatically = true)
	@Query(value="UPDATE filter SET row_status='D', modified_by=:modifiedBy WHERE id=:id", nativeQuery=true)
	int updateToDeletedById(@Param("id") Long id, @Param("modifiedBy") String modifiedBy);

}
