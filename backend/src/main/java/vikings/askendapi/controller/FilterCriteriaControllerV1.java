package vikings.askendapi.controller;

import static org.springframework.http.ResponseEntity.ok;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vikings.askendapi.dto.FilterCriteriaDto;
import vikings.askendapi.services.FilterCriteriaService;

@RestController
@RequestMapping("/api/v1/filter-criteria")
@RequiredArgsConstructor
public class FilterCriteriaControllerV1 {
  private final FilterCriteriaService filterCriteriaService;

  @GetMapping("/list")
  @Operation(summary = "Gets the filter criteria list", description = "Returns the filter criteria list")
  public ResponseEntity<List<FilterCriteriaDto>> getList(@RequestParam(name = "filterId") Long filterId) {
    return ok(filterCriteriaService.getList(filterId));
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Deletes the filter criteria", description = "Deletes the filter criteria")
  public ResponseEntity<Boolean> deleteById(@PathVariable("id") Long id) {
    return ok(filterCriteriaService.deleteById(id));
  }
  
}
