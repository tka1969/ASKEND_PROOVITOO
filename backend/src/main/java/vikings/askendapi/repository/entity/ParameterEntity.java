package vikings.askendapi.repository.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.DynamicUpdate;

import jakarta.annotation.Nullable;
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
@Entity(name = ParameterEntity.TABLE_NAME)
@Table(name = ParameterEntity.TABLE_NAME, schema = ParameterEntity.SCHEMA_NAME)
public class ParameterEntity extends BaseEntity {

	public static final String TABLE_NAME= "PARAMETER";
	public static final String SCHEMA_NAME = "askendapi";
  
	@NotNull
	@Column(name = "parameter_class")
	private String parameterClass;

	@NotNull
	@Column(name = "property")
	private String property;
	
	@NotNull
	@Column(name = "name")
	private String name;

	@Column(name = "description")
	private String description;

	@Column(name = "string_value_1")
	private String stringValue1;

	@Column(name = "int_value_1")
	private int intValue1;
	
	@Column(name = "int_value_2")
	private int intValue2;

	@Column(name = "valid_from")
	private LocalDateTime validFrom;
	
	@Nullable
	@Column(name = "valid_until")
	private LocalDateTime validUntil;
}
