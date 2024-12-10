import { EventEmitter } from "@angular/core";
import { IndexKeyMap, IVersionedObject } from "../../../types/common-types";
import { IOptionValue } from "../../../models/option-value";


export interface IDynamicFormValidator {
    validator: string;
    value?: string | number | RegExp;
    message?: string;
};

export enum IDynamicFormControlStatus {
  NONE = 0X0,
  EXTERNAL = 0X1, // 2^0
}

export function isFlagSet(actual: IDynamicFormControlStatus, expected: IDynamicFormControlStatus): boolean {
  const flag = actual & expected;
  return flag === expected;
}

export enum DynamicFormControlType {
  INPUT = 'input', // DynamicFormType.TEXT
  NUMBER = 'number',
  BUTTON = 'button',
  SELECT = 'select',
  CLASSIFICATOR = 'classificator',
  COUNTRY = 'country',
  DATE = 'date',
  DATEPICKER = 'datepicker',
  RADIOBUTTON = 'radiobutton',
  RADIOGROUP = 'radiogroup',
  CHECKBOX = 'checkbox',
  TOGGLE = 'toggle',
  RICHEDIT = 'richedit',
  DIVIDER = 'divider',
  LABEL = 'label',
  FILLER = 'filler',
  TEXT = 'text',
  STATIC = 'static',
  TEXTAREA = 'textarea',
  LOOKUPEDIT = 'lookupedit'
};

export interface IDynamicFormEventEmitter<T> {
  eventName: string;
  eventEmitter: EventEmitter<T>;
}
    
export interface IDynamicFormValueGetter {
  (model: any): any | undefined;
}

export interface IDynamicFormValueSetter {
  (model: any, value: any): void;
}

export interface IDynamicFormControl extends IVersionedObject {
    controlName: string;
    controlType: DynamicFormControlType;

    label?: string;
    placeholder?: string;

    hidden?: boolean;
    disabled?: boolean;
    readonly?: boolean;

    value?: any;
    options?: IOptionValue[];
  
    modelName: string;
    valueGetter?: IDynamicFormValueGetter;
    valueSetter?: IDynamicFormValueSetter;
    validators?: IDynamicFormValidator[];

    width?: number;
    events?: IndexKeyMap<string, IDynamicFormEventEmitter<any>>;

// controlType defined arbitrary data
    initialData?: any;

// User defined arbitrary data
    userData?: any;

// controlType defined arbitrary data
    richEditoConfig?: any;
    collection?: any;
    classificator?: string;

    DisplayMember?: string;
    ValueMember?: string;
};

export interface IDynamicFormGroup extends IVersionedObject {
    groupName?: string;
    controls: IDynamicFormControl[];
};

export interface IDynamicForm {
    formName?: string;
    maxColumns?: number;
    formGroups: IDynamicFormGroup[];
};
