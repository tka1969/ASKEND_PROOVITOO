package vikings.askendapi.controller;

import static org.springframework.http.ResponseEntity.ok;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vikings.askendapi.dto.ParameterDto;
import vikings.askendapi.services.ParameterService;

@RestController
@RequestMapping("/api/v1/parameter")
@RequiredArgsConstructor
public class ParameterControllerV1 {

  private final ParameterService parameterService;

  @GetMapping("/list")
  @Operation(summary = "Gets parameter list", description = "Returns the parameter list")
  public ResponseEntity<List<ParameterDto>> getList(@RequestParam(name = "parameters") List<String> parameterClasses) {
    return ok(parameterService.getList(parameterClasses));
  }
  
}
