package vikings.askendapi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import vikings.askendapi.dto.FilterCriteriaDto;
import vikings.askendapi.enums.RowStatusEnum;
import vikings.askendapi.repository.entity.FilterCriteriaEntity;

public interface FilterCriteriaEntityRepository extends JpaRepository<FilterCriteriaEntity, Long> {
	
  List<FilterCriteriaDto> findAllByFilterIdAndRowStatus(Long filterId, RowStatusEnum rowStatus);
	
  @Modifying(clearAutomatically = true)
  @Query(value="UPDATE filter_criteria SET row_status='D', modified_by=:modifiedBy WHERE id=:id", nativeQuery=true)
  int updateToDeletedById(@Param("id") Long id, @Param("modifiedBy") String modifiedBy);
 
  @Modifying(clearAutomatically = true)
  @Query(value="UPDATE filter_criteria SET row_status='D', modified_by=:modifiedBy WHERE filter_id=:filterId", nativeQuery=true)
  int updateToDeletedByFilterId(@Param("filterId") Long filterId, @Param("modifiedBy") String modifiedBy);

}
