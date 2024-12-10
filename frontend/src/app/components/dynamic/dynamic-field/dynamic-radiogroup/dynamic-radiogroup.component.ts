import { Component, HostBinding, Input, OnInit, forwardRef } from "@angular/core";
import { ControlValueAccessor, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IDynamicFormControl } from "../../models/dynamic-layout.interface";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { IOptionValue } from "../../../../models/option-value";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "dynamic-radiogroup",
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatRadioModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicRadioGroupComponent),
      multi: true
    }
  ],
  templateUrl: "./dynamic-radiogroup.component.html",
  styleUrls: ["./dynamic-radiogroup.component.scss"],  
  host: {
    '[id]': 'id',
  },
  styles: []
})
export class DynamicRadioGroupComponent implements ControlValueAccessor, OnInit {
  field!: IDynamicFormControl;
  group!: FormGroup;

  static nextId = 0;
  @HostBinding() id = `radiogroup-${DynamicRadioGroupComponent.nextId++}`;
  
  @Input()
  public disabled: boolean = false;

  @Input()
  public readonly: boolean = false;

  @Input()
  public set value(inputValue: any) {
    if (!this.disabled){
      this.selectedValue = inputValue
      this.onChange(inputValue)
    }
  }

  public get value() {
    return this.selectedValue;
  }

  public get hidden() {
    return this.field.hidden;
  }
  
  protected selectedValue: any;

  protected optionValues: IOptionValue[] = [];
  

  public onChange: any = () => {}
  public onTouch: any = () => {}

  constructor() {}
  
  ngOnInit() {
    if (this.field.disabled) {
      this.disabled = this.field.disabled;
    }
    if (this.field.readonly) {
      this.readonly = this.field.readonly;
    }
    if (this.field.initialData) {
      this.value = this.field.initialData;
    }

    if (this.field.options) {
      this.optionValues = this.field.options;
    }

  }

  onValueChange(event: MatRadioChange) {
    this.selectedValue = event.value;
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
