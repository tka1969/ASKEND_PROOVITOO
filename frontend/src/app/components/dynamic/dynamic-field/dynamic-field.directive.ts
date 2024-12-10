import {
    ComponentRef,
    Directive,
    EventEmitter,
    Host,
    Inject,
    Input,
    OnInit,
    Optional,
    Output,
    Self,
    SkipSelf,
    ViewContainerRef,
    forwardRef
  } from "@angular/core";
  import {
    AbstractControl,
    AsyncValidatorFn,
    ControlContainer,
    FormControl,
    FormGroup,
    FormsModule,
    NG_VALIDATORS,
    NgControl,
    ReactiveFormsModule,
    Validator,
    ValidatorFn,
    Validators
} from "@angular/forms";

import { DynamicInputComponent } from "./dynamic-input/dynamic-input.component";
import { DynamicRadioGroupComponent } from "./dynamic-radiogroup/dynamic-radiogroup.component";
import { DynamicDateComponent } from "./dynamic-date/./dynamic-date.component";
import { IDynamicFormControl } from "../models/dynamic-layout.interface";
import { DynamicClassificatorComponent } from "./dynamic-classificator/dynamic-classificator.component";
import { CommonModule } from "@angular/common";
import { DynamicTextareaComponent } from "./dynamic-textarea/dynamic-textarea.component";

interface IDynamicFieldMapper {
    name: string;
    component: any;
};

export function normalizeValidator(validator: ValidatorFn | Validator): ValidatorFn {
    if ((<Validator>validator).validate) {
        return (c: AbstractControl) => (<Validator>validator).validate(c);
    } else {
        return <ValidatorFn>validator;
    }
}

export const controlNameBinding: any = {
    provide: NgControl,
    useExisting: forwardRef(() => DynamicFieldDirective)
};

@Directive({
    selector: "[dynamicField]",
    standalone: true,
    providers: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class DynamicFieldDirective extends NgControl implements OnInit {
    dynamicComponents: IDynamicFieldMapper[] = [
        {
            name: 'text',
            component: DynamicInputComponent
        },
        {
            name: 'input',
            component: DynamicInputComponent
        },
        {
            name: 'number',
            component: DynamicInputComponent
        },
        {
            name: 'radiogroup',
            component: DynamicRadioGroupComponent
        },
        {
            name: 'date',
            component: DynamicDateComponent
        },
        {
            name: 'datepicker',
            component: DynamicDateComponent
        },
        {
            name: 'classificator',
            component: DynamicClassificatorComponent
        },
        {
            name: 'textarea',
            component: DynamicTextareaComponent
        }
    ]

    @Input() field!: IDynamicFormControl;
    @Input() group!: FormGroup;

    override name: string = '';

    component!: ComponentRef<any>;

    @Output('ngModelChange') update = new EventEmitter();

    _control!: FormControl;
        
    constructor(
      @Optional() @Host() @SkipSelf() private parent: ControlContainer,
      @Optional() @Self() @Inject(NG_VALIDATORS) private validators: Array<Validator|ValidatorFn>,
      @Inject(ViewContainerRef) private container: ViewContainerRef
    ) {
        super();
    }

    ngOnInit() {
        this.name = this.field.controlName;
        const componentInstance = this.getComponentByType(this.field.controlType);
        this.component = this.container.createComponent(componentInstance);
        this.component.instance.field = this.field;
        this.component.instance.group = this.group;

        this.valueAccessor = this.component.instance;

        const ngValidators = this.component.injector.get(NG_VALIDATORS, null);
        if (ngValidators && ngValidators.some(x => x === this.component.instance)) {
            this.validators = [...(this.validators || []), ...(ngValidators as Array<Validator | ValidatorFn>)];
        }

        if (this.field.width !== undefined) {
            this.component.location.nativeElement.classList.add('form-group1', 'data-form-item-' + this.field.width, 'custom-field');
        }
        else {
            this.component.location.nativeElement.classList.add('form-group1', 'data-form-item-20', 'custom-field');
        }
    }

    getComponentByType(type: string): any {
        return (this.dynamicComponents.find(t => t.name === type) || { component : DynamicInputComponent }).component;
      }
  
      override get path(): string[] {
        return [...this.parent.path !, this.name];
    }

    get formDirective(): any { return this.parent ? this.parent.formDirective : null; }
    get control(): FormControl { return this._control; }
    override get validator(): ValidatorFn|null { return this.validators != null ? Validators.compose(this.validators.map(normalizeValidator)) : null; }
    override get asyncValidator(): AsyncValidatorFn | null { return null; }

    override viewToModelUpdate(newValue: any): void {
        this.update.emit(newValue);
    }

    ngOnDestroy(): void {
        if (this.formDirective) {
            this.formDirective.removeControl(this);
        }
        if(this.component) {
            this.component.destroy();
        }
    }
  }
  