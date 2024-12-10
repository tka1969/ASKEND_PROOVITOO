import { Component, HostBinding, Input, OnInit, forwardRef } from "@angular/core";
import { IDynamicFormControl } from "../../models/dynamic-layout.interface";
import { CommonModule } from "@angular/common";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FormsModule, ReactiveFormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from "@angular/material/core";
import { MomentDateAdapter, MomentDateModule } from '@angular/material-moment-adapter'

export const MY_FORMATS = {
  parse: {
      dateInput: 'LL'
  },
  display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: "dynamic-date",
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MomentDateModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicDateComponent),
      multi: true
    },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    provideNativeDateAdapter()
  ],
  template: `
<div [hidden]=hidden>
<mat-label class="data-form-item-100 example-form-field custom-field">{{field.label!}}</mat-label>
<mat-form-field class="data-form-item-100 example-form-field custom-field" [formGroup]="group" color="accent" floatLabel="auto" appearance="outline" >
  <input matInput #id [matDatepicker]="datepicker" placeholder="Select {{field.placeholder!}}" [formControlName]="field.controlName">
  <mat-hint>DD/MM/YYYY</mat-hint>
  <mat-datepicker-toggle matIconSuffix [for]="datepicker"></mat-datepicker-toggle>
  <mat-datepicker #datepicker></mat-datepicker>
</mat-form-field>
</div>
`,
  host: {
    '[id]': 'id',
  },
  styles: []
})
export class DynamicDateComponent implements ControlValueAccessor, OnInit {

  static nextId = 0;
  @HostBinding() id = `dynamic-date-${DynamicDateComponent.nextId++}`;

  field!: IDynamicFormControl;
  group!: FormGroup;

  faCalendar: IconProp = faCalendar;

  @Input()
  public disabled: boolean = false;

  @Input()
  public set value(inputValue: Date | null) {
    if (!this.disabled){
      this.inputValue = inputValue
      this.onChange(inputValue)
    }
  }
  
  public get hidden() {
    return this.field.hidden;
  }

  protected inputValue: Date | null = null;
  
  public onChange: any = () => {}
  public onTouch: any = () => {}

  constructor(private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    this.disabled = false;
  }

  ngOnInit() {
    if (this.field.initialData) {
      this.value = this.field.initialData as Date;
    }
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
