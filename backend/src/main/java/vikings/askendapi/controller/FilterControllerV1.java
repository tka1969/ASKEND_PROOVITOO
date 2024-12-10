package vikings.askendapi.controller;

import static org.springframework.http.ResponseEntity.ok;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vikings.askendapi.dto.FilterDto;
import vikings.askendapi.dto.FilterListDto;
import vikings.askendapi.services.FilterService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/filter")
@RequiredArgsConstructor
public class FilterControllerV1 {

  private final FilterService filterService;

  @GetMapping("/list")
  @Operation(summary = "Gets filter list", description = "Returns the filter list")
  public ResponseEntity<List<FilterListDto>> getList() {
    return ok(filterService.getList());
  }

  @PostMapping("/add")
  @Operation(summary = "Creates new filter", description = "Creates new filter")
  public ResponseEntity<FilterDto> add(@RequestBody @Valid FilterDto filter) {
    return ok(filterService.add(filter));
  }

  @PutMapping
  @Operation(summary = "Saves filter", description = "Saves filter")
  public ResponseEntity<FilterDto> save(@RequestBody @Valid FilterDto filter) {
    return ok(filterService.save(filter));
  }
  
  @DeleteMapping("/{id}")
  @Operation(summary = "Deletes the filter", description = "Deletes the filter")
  public ResponseEntity<Boolean> deleteById(@PathVariable("id") Long id) {
    return ok(filterService.deleteById(id));
  }  
}
