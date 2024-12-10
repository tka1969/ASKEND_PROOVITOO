package vikings.askendapi.repository.entity;

import org.hibernate.annotations.DynamicUpdate;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.experimental.SuperBuilder;
import vikings.askendapi.repository.entity.base.BaseEntity;


@lombok.Data
@lombok.EqualsAndHashCode(callSuper = true)
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor
@lombok.Getter
@lombok.Setter
@SuperBuilder
@lombok.ToString(callSuper=true)
@DynamicUpdate
@Entity(name = FilterCriteriaEntity.TABLE_NAME)
@Table(name = FilterCriteriaEntity.TABLE_NAME, schema = FilterCriteriaEntity.SCHEMA_NAME)
public class FilterCriteriaEntity extends BaseEntity {

	public static final String TABLE_NAME= "FILTER_CRITERIA";
	public static final String SCHEMA_NAME = "askendapi";

	@Column(name = "filter_id")
	private Long filterId;
	
	@Column(name = "criteria_id")
	private Long criteriaId;

	@NotNull
	@Column(name = "condition_type_id")
	private Long conditionTypeId;

	@NotNull
	@Column(name = "condition_value")
	private String conditionValue;	
}
