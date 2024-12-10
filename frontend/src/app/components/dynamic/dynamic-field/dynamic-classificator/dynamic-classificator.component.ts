import { AfterViewInit, Component, ElementRef, HostBinding, Inject, Input, OnInit, Renderer2, forwardRef } from "@angular/core";
import { ControlValueAccessor, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IDynamicFormControl } from "../../models/dynamic-layout.interface";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { CommonServiceTask } from "../../../../comoon/common-service.task";
import { ServiceResultCode } from "../../../../services/basedata.service";
import { IParameter } from "../../../../models/parameter";
import { ParameterDataService } from "../../../../services/parameter-data.service";
import { createQueryModel } from "../../../../models/query.model";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";


@Component({
  selector: "dynamic-classificator",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicClassificatorComponent),
      multi: true
    }
  ],
  template: `
  <div [hidden]=hidden>
    <mat-label class="data-form-item-100 example-form-field">{{field.label!}}</mat-label>
    <mat-form-field class="data-form-item-100 example-form-field" color="accent" appearance="outline" [formGroup]="group">
      <mat-select #id [placeholder]="field.placeholder!" [formControlName]="field.controlName" [value]="selectedValue" (selectionChange)="onSelectionChange($event)" required>
        <mat-option *ngFor="let citem of collection; let i=index" [value]="citem.id">{{citem.name}}</mat-option>
      </mat-select>
    </mat-form-field>
  </div>
  `,
  host: {
    '[id]': 'id',
  },
  styles: []
})
export class DynamicClassificatorComponent extends CommonServiceTask implements ControlValueAccessor, OnInit, AfterViewInit {

  static nextId = 0;
  @HostBinding() id = `classificator-${DynamicClassificatorComponent.nextId++}`;
  
  field!: IDynamicFormControl;
  group!: FormGroup;
  collection?: IParameter[];

  @Input()
  public disabled: boolean = false;

  @Input()
  public set value(selectedValue: any) {
    if (!this.disabled) {
      this.selectedValue = selectedValue;
      this.onChange(selectedValue);
    }
  }

  public get value() {
    return this.selectedValue;
  }

  public get hidden() {
    return this.field.hidden;
  }

  protected selectedValue: any = undefined;
  
  public onChange: any = () => {}
  public onTouch: any = () => {}

  constructor(
    @Inject(Renderer2) private renderer: Renderer2,
    @Inject(ElementRef) private el: ElementRef,
    public paramService: ParameterDataService
  ) {
    super();
  }
  
  ngOnInit() {

    if (this.field.collection) {
      this.collection = this.field.collection;
    }
    else if (this.field.classificator) {
      this.doServiceTask("CLASSIF-" + this.field.classificator, this.paramService.list(createQueryModel({parameters: {parameters: this.field.classificator}})));
    }
  }
  
  ngAfterViewInit(): void {
    const button = this.el.nativeElement.querySelector('mat-select');

    for (const evName in this.field.events) {
      if (evName != 'selectionChange') {
        const fevent = this.field.events[evName];
        this.renderer.listen(button, evName, (event) => {
          fevent.eventEmitter.emit({event, fevent});
        })
      }
    }
  }

  override onServiceComplete(serviceName: string, resultCode: ServiceResultCode, result: IParameter[], parameterData?: any): void {
    if (serviceName == "CLASSIF-" + this.field.classificator) {
      this.collection = result;
      if (this.value !== undefined && this.field.initialData && this.collection) {
        const collItem = this.collection.find(item => item.property == this.field.initialData);
        this.value = collItem?.id;
      }
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

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelectionChange(event: any) {
    if (this.field.events) {
      const fev = this.field.events['selectionChange'];

      if (fev) {
        fev.eventEmitter.emit({event: event, selectedValue: event.value});
      }
    }
  }
}
