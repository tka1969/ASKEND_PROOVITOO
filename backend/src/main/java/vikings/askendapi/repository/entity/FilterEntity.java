package vikings.askendapi.repository.entity;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.DynamicUpdate;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import vikings.askendapi.enums.SomeSelectionEnum;
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
@Entity(name = FilterEntity.TABLE_NAME)
@Table(name = FilterEntity.TABLE_NAME, schema = FilterEntity.SCHEMA_NAME)
public class FilterEntity extends BaseEntity {

	public static final String TABLE_NAME= "FILTER";
	public static final String SCHEMA_NAME = "askendapi";
	
	@NotNull
	@Column(name = "name")
	private String name;

	@NotNull
	@Enumerated(EnumType.STRING)
	@Column(name = "some_selection")
	private SomeSelectionEnum someSelection;
	
	@Builder.Default
	@ToString.Exclude
	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinColumn(name="filter_id")
	private List<FilterCriteriaEntity> criterias = new ArrayList<>();
}
