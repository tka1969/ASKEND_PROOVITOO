import { Component, HostBinding, Input, OnInit, forwardRef } from "@angular/core";
import { ControlValueAccessor, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IDynamicFormControl, IDynamicFormValidator } from "../../models/dynamic-layout.interface";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "dynamic-textarea",
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicTextareaComponent),
      multi: true
    }
  ],
  templateUrl: "./dynamic-textarea.component.html",
  styleUrls: ["./dynamic-textarea.component.scss"],  
  host: {
    '[id]': 'id',
  }  
})
export class DynamicTextareaComponent implements ControlValueAccessor, OnInit {
  static nextId = 0;
  @HostBinding() id = `textarea-${DynamicTextareaComponent.nextId++}`;

  field!: IDynamicFormControl;
  group!: FormGroup;
  
  @Input()
  public disabled: boolean = false;

  @Input()
  public set value(inputValue: any) {
    if (!this.disabled){
      this.inputValue = inputValue
      this.onChange(inputValue)
    }
  }
  
  protected inputValue: any;
  
  public onChange: any = () => {}
  public onTouch: any = () => {}

  constructor() {
    this.disabled = false;
  }
  
  ngOnInit() {
  }

  public hasValidator = (validatorName: string) => {
    const validator: IDynamicFormValidator | undefined = this.field.validators?.find(item => item.validator === validatorName);
    return (validator !== undefined)
  }

  public validatorValue = (validatorName: string) => {
    return this.getControlValidatorValue(this.field, validatorName);
  }

  public validatorHint = (validatorName: string, prefix: string, postifix: string) => {
    const validator: IDynamicFormValidator | undefined = this.field.validators?.find(item => item.validator === validatorName);

    if (validator !== undefined) {
      return prefix + validator.value + postifix;
    }
    return "";
  }

  getControlValidatorValue(formControl: IDynamicFormControl, validatorName: string) {
    const control: IDynamicFormControl = formControl;
    if (control != null) {
      const validator: IDynamicFormValidator | undefined = control.validators?.find(item => item.validator === validatorName);
      return validator?.value;
    }
    return undefined;
  }

  writeValue(value: any): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

}
