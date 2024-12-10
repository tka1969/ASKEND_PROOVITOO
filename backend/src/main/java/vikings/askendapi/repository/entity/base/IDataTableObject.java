package vikings.askendapi.repository.entity.base;

import java.time.LocalDateTime;

import org.springframework.data.domain.Persistable;

import vikings.askendapi.enums.RowStatusEnum;

public interface IDataTableObject extends Persistable<Long> {

  @Override
	Long getId();
	void setId(Long id);
	
	RowStatusEnum getRowStatus();
	void setRowStatus(RowStatusEnum rowStatus);

	String getCreatedBy();
	void setCreatedBy(String createdBy);

	String getModifiedBy();
	void setModifiedBy(String modifiedBy);

  LocalDateTime getCreatedAt();
 	void setCreatedAt(LocalDateTime createdAt);

	LocalDateTime getModifiedAt();
	void setModifiedAt(LocalDateTime modifiedAt);

}
