import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from "@angular/core";
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicFormControlType, IDynamicForm, IDynamicFormControl, IDynamicFormGroup, IDynamicFormValidator } from "../models/dynamic-layout.interface";
import { DynamicFieldDirective } from "../dynamic-field/dynamic-field.directive";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { datefromString } from "../../../utility/date-converter";


@Component({
  selector: "widget-dynamic-form",
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicFieldDirective
  ],
  templateUrl: "./dynamic-form.component.html",
  styleUrls: ["./dynamic-form.component.scss"],
})
export class DynamicFormComponent implements OnInit {
  @Input() dynamicForm!: IDynamicForm;
  @Input() set formData(data: any) {
    this.formContent = data;
    this.patchFormData(data);
  }

  patched: boolean = false;
  formContent: any = {};

  @Output() submit: EventEmitter<any> = new EventEmitter<any>();
  
  mainForm!: FormGroup;

  constructor(private fb: NonNullableFormBuilder) {
  }

  ngOnInit() {
    this.mainForm = this.createFormGroup();
    if (!this.patched) {
      this.patchFormData(this.formContent);
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.mainForm.valid) {
      this.submit.emit(this.mainForm.value);
    } else {
      this.validateAllFormFields(this.mainForm);
    }
  }

  createFormGroup(): FormGroup {
    const formGroup = this.fb.group({});
    this.dynamicForm.formGroups.forEach(group => {
      group.controls.forEach(field => {
        if (field.controlType === "button") return;
        if (field.controlType === "divider") return;
        if (field.controlType === "filler") return;

        let itemValue = field.value;

        if (this.formContent) {
          if (this.formContent[field.modelName]) {
            if (field.controlType === DynamicFormControlType.DATEPICKER && typeof this.formContent[field.modelName] === 'string') {
              itemValue = datefromString(this.formContent[field.modelName]);
            }
            else {
              itemValue = (field.valueGetter)
                              ? field.valueGetter(this.formContent)
                              : this.formContent[field.modelName];
            }
          }
        }

        const validators: any = this.bindValidations(field.validators);
        const control = new FormControl(itemValue, validators);

        if (field && field.disabled) {
          control.disable();
        }
        formGroup.addControl(field.controlName, control);
      });
    });
    return formGroup;
  }

  bindValidations(rules?: IDynamicFormValidator[]) {
    if (!rules) {
      return [];
    }

    const validList: any[] = [];
    const validators = rules.forEach((rule: IDynamicFormValidator) => {

      switch (rule.validator) {
        case "required":
          validList.push(Validators.required);
          return Validators.required;
        case "min":
          validList.push(Validators.min(rule.value as number));
          return Validators.min(rule.value as number);
        case "max":
          validList.push(Validators.max(rule.value as number));
          return Validators.max(rule.value as number);
        case "minLength":
          validList.push(Validators.minLength(rule.value as number));
          return Validators.minLength(rule.value as number);
        case "maxLength":
          validList.push(Validators.maxLength(rule.value as number));
          return Validators.maxLength(rule.value as number);

          //add more case for future.
          default:
            return null;
      }
    });
    return Validators.compose(validList);
  }

  isDataValid(): boolean {
    if (!this.mainForm.valid) {
      this.validateAllFormFields(this.mainForm);
    }
    return (this.mainForm.valid);
  }

  isDataPristine(): boolean {
    return (this.mainForm.pristine);
  }
  
  markAsPristine(): void {
    this.mainForm.markAsPristine();
  }

  private validateAllFormFields(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);

      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.validateAllFormFields(control);
        control?.markAsTouched({ onlySelf: true });
      }      
    });
  }

  public patchFormData(modelIn: any, skipPristine: boolean = false) {
    this.patched = false;

    if (this.mainForm && modelIn) {
      const modelForm: any = {};

      this.dynamicForm.formGroups.forEach((dynGroup: IDynamicFormGroup) => {
        dynGroup.controls.forEach((field: IDynamicFormControl) => {

          if (field.controlType == "button") return;
          if (field.controlType == "divider") return;
          if (field.controlType == "filler") return;
  
          if (this.mainForm.controls[field.controlName]) {

            if (field.valueGetter) {
              modelForm[field.controlName] = field.valueGetter(modelIn);
            }
            else {
              if (field.controlType == DynamicFormControlType.DATEPICKER && modelIn[field.modelName] && typeof modelIn[field.modelName] === 'string') {
                modelForm[field.controlName] = datefromString(modelIn[field.modelName]);
              }
              else {
                modelForm[field.controlName] = modelIn[field.modelName];
              }
            }
          }
        });
      });
      this.mainForm.patchValue(modelForm);
      this.patched = true;

      if (!skipPristine) {
        this.mainForm.markAsPristine();
      }
    }
  }

  public getFormChanges(creatingNew: boolean, modelIn: any, modelOut: any): boolean {
    if (this.mainForm.pristine) {
      return false;
    }

    let hasChanges = false;
    const form = this.mainForm.value;

    this.dynamicForm.formGroups.forEach((dynGroup: IDynamicFormGroup) => {
      dynGroup.controls.forEach((field: IDynamicFormControl) => {

        if (field.controlType === "button") return;
        if (field.controlType === "divider") return;
        if (field.controlType === "filler") return;

        if (form[field.controlName] != undefined) {
          const valueNew = form[field.controlName];
          const value = (field.valueGetter)
                          ? field.valueGetter(modelIn)
                          : modelIn[field.modelName];

          if (field.controlType === DynamicFormControlType.DATEPICKER || field.controlType === DynamicFormControlType.DATE) { // && typeof modelIn[field.modelName] === 'string') {
            const date1: Date = datefromString(valueNew as string);
            const date2: Date = datefromString(value as string);

            date1.setMilliseconds(0);
            date2.setMilliseconds(0);

            if (creatingNew || (date1.getTime() != date2.getTime())) {
              if (field.valueSetter) {
                field.valueSetter(modelOut, valueNew);
              }
              else {
                modelOut[field.modelName] = valueNew;
              }              
              hasChanges = true;
            }
          }
          else {  
            if (creatingNew || valueNew != value) {
              if (field.valueSetter) {
                field.valueSetter(modelOut, valueNew);
              }
              else {
                modelOut[field.modelName] = valueNew;
              }
              hasChanges = true;
            }
          }
        }
      });
    });
    return hasChanges;
  }

  public getCheckedFormChanges(creatingNew: boolean, validFields: string[], modelIn: any, modelOut: any): boolean {
    if (this.mainForm.pristine) {
      return false;
    }

    let hasChanges = false;
    const form = this.mainForm.value;

    this.dynamicForm.formGroups.forEach((dynGroup: IDynamicFormGroup) => {
      dynGroup.controls.forEach((field: IDynamicFormControl) => {

        const modelIndex = validFields.findIndex((modelField: string) => modelField === field.modelName);

        if (modelIndex < 0) {
          return;
        }

        if (field.controlType === "button") return;
        if (field.controlType === "divider") return;
        if (field.controlType === "filler") return;

        if (form[field.controlName] != undefined) {
          const valueNew = form[field.controlName];
          const value = (field.valueGetter)
                          ? field.valueGetter(modelIn)
                          : modelIn[field.modelName];

          if (field.controlType === DynamicFormControlType.DATEPICKER || field.controlType === DynamicFormControlType.DATE) {
            const date1: Date = datefromString(valueNew as string);
            const date2: Date = datefromString(value as string);

            date1.setMilliseconds(0);
            date2.setMilliseconds(0);

            if (creatingNew || (date1.getTime() != date2.getTime())) {
              if (field.valueSetter) {
                field.valueSetter(modelOut, valueNew);
              }
              else {
                modelOut[field.modelName] = valueNew;
              }              
              hasChanges = true;
            }
          }
          else {  
            if (creatingNew || valueNew != value) {
              if (field.valueSetter) {
                field.valueSetter(modelOut, valueNew);
              }
              else {
                modelOut[field.modelName] = valueNew;
              }
              hasChanges = true;
            }
          }
        }
      });
    });
    return hasChanges;
  }

  getFormFieldValue(fieldName: string): any {
    if (this.mainForm.value) {
      return this.mainForm.value[fieldName];
    }
    return undefined;
  }

  public patchFormField(fieldName: string, value: any, skipPristine: boolean = false) {
    if (this.mainForm) {
      this.dynamicForm.formGroups.forEach((dynGroup: IDynamicFormGroup) => {
        dynGroup.controls.forEach((field: IDynamicFormControl) => {

          if (field.controlName == fieldName) {
            const control = this.mainForm.controls[fieldName];

            if (control) {
              if (field.controlType === DynamicFormControlType.DATEPICKER && typeof value === 'string') {
                control.patchValue(datefromString(value));
                control.markAsDirty();
              }
              else {
                control.patchValue(value);
                control.markAsDirty();
              }
            }
          }
        });
      });
      this.mainForm.markAsDirty();
    }
  }
}
