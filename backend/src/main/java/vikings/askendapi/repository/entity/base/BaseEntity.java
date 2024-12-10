package vikings.askendapi.repository.entity.base;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.validation.constraints.NotNull;
import lombok.experimental.SuperBuilder;
import vikings.askendapi.constants.GlobalConstants;
import vikings.askendapi.enums.RowStatusEnum;

@SuperBuilder
@lombok.Data
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor
@lombok.Getter
@lombok.Setter
@lombok.ToString(callSuper=true)
@MappedSuperclass
public class BaseEntity implements IDataTableObject {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", unique=true, nullable=false)
	protected Long id;
	
	
	@Enumerated(EnumType.STRING)
	@Column(name = "row_status")
	protected RowStatusEnum rowStatus;
	
	//@CreatedBy
	@Column(name = "created_by")
	private String createdBy;
	
	//@LastModifiedBy
	@Column(name = "modified_by")
	private String modifiedBy;
		
	//@CreatedDate
	@NotNull
	@Column(name = "created_at")
	private LocalDateTime createdAt;
	
	//@LastModifiedDate
	@NotNull
	@Column(name = "modified_at")
	private LocalDateTime modifiedAt;

	
  @Override
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
  @PrePersist
  public void prePersist() {
    setModifiedBy("get-user"); // LoggedUser.get();
    setModifiedAt(LocalDateTime.now());
    
    if (getCreatedBy() == null) {
    	setCreatedBy("get-user");  // LoggedUser.get();
    	setCreatedAt(getModifiedAt());
    }
  }

  @PreUpdate
  public void preUpdate() {
    setModifiedBy("get-user"); // LoggedUser.get();
    setModifiedAt(LocalDateTime.now());
    
    if (getCreatedBy() == null) {
    	setCreatedBy("get-user");  // LoggedUser.get();
    	setCreatedAt(getModifiedAt());
    }
  }

	@Override
	public boolean isNew() {
		return (id == null || id == 0L);
	}
	
}
