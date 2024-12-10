import { Component, EventEmitter, Inject, inject, ViewChild} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonServiceTask } from './comoon/common-service.task';
import { createFilterCriteria, IFilterCriteria } from './models/filter-criteria';
import { ActionEnum } from './enums/action.enum';
import { IParameter } from './models/parameter';
import { ClassificatorService } from './services/classificator.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MessageBoxButtons } from './components/message-box/message-box-buttons.enum';
import { MessageBoxResult } from './components/message-box/message-box-result.enum';
import { MessageBoxService } from './components/message-box/message-box.service';
import { DynamicFormComponent } from './components/dynamic/dynamic-form/dynamic-form.component';
import { IDynamicForm, DynamicFormControlType, IDynamicFormEventEmitter } from './components/dynamic/models/dynamic-layout.interface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IndexKeyMap } from './types/common-types';
import { getVersion } from './utility/utility-helpers';
import { createDialogParameter, IDialogParameter } from './models/dialog-parameter.model';
import { dateCustomFormatting, datefromString } from './utility/date-converter';


@Component({
    selector: 'filter-criteria-dialog',
    templateUrl: './criteria-dialog.component.html',
    standalone: true,
    imports: [
      CommonModule,
      FontAwesomeModule,
      FormsModule,
      ReactiveFormsModule,
      MatInputModule,
      MatFormFieldModule,
      MatDialogModule,
      MatButtonModule,
      MatProgressSpinnerModule,
      DynamicFormComponent
    ],
  })
  export class CriteriaDialog extends CommonServiceTask {
    private readonly messageBox: MessageBoxService = inject(MessageBoxService);
        
    @ViewChild("idDynamicForm") protected formView!: DynamicFormComponent;
    @ViewChild("idDynamicFormAmount") protected formViewAmount!: DynamicFormComponent;
    @ViewChild("idDynamicFormTitle") protected formViewTitle!: DynamicFormComponent;
    @ViewChild("idDynamicFormDate") protected formViewDate!: DynamicFormComponent;

    protected dynamicForm!: IDynamicForm;
    protected dynamicFormAmount!: IDynamicForm;
    protected dynamicFormTitle!: IDynamicForm;
    protected dynamicFormDate!: IDynamicForm;

    private readonly action: ActionEnum;
    protected criteria: IFilterCriteria;
    protected criteriaAmount: IFilterCriteria = createFilterCriteria();
    protected criteriaTitle: IFilterCriteria = createFilterCriteria();
    protected criteriaDate: IFilterCriteria = createFilterCriteria();

    protected visibleCriteria: string = "AMOUNT";

    private readonly classifCriteria: IParameter[] = [];
    private readonly classifCriteriaAmount: IParameter[] = [];
    private readonly classifCriteriaTitle: IParameter[] = [];
    private readonly classifCriteriaDate: IParameter[] = [];

    constructor(
      private readonly fb: FormBuilder,
        private readonly dialogRef: MatDialogRef<CriteriaDialog>,
        @Inject(MAT_DIALOG_DATA) private readonly dialogData: IDialogParameter,
        private readonly classificatorService: ClassificatorService) {
          super();

          this.action = dialogData.action as ActionEnum;
          this.criteria = dialogData.data as IFilterCriteria;

          this.classifCriteria = this.classificatorService.get("CRITERIA-TYPE");
          this.classifCriteriaAmount = this.classificatorService.get("CRITERIA-AMOUNT");
          this.classifCriteriaTitle = this.classificatorService.get("CRITERIA-TITLE");
          this.classifCriteriaDate = this.classificatorService.get("CRITERIA-DATE");

      // new defaults to amount
      if (this.criteria.criteriaId == undefined) {
        const criteriaType = this.classifCriteria.find(item => item.property == 'AMOUNT'); 
        this.criteria.criteriaId = criteriaType?.id as bigint;

        const conditionType = this.classifCriteriaAmount.find(item => item.property == 'LESS');
        this.criteriaAmount.conditionTypeId = conditionType?.id as bigint;
      } else {
        const criteriaType = this.classifCriteria.find(item => item.id == this.criteria.criteriaId); 

        switch (criteriaType?.property) {
          case 'AMOUNT':
            this.criteriaAmount.conditionTypeId = this.criteria.conditionTypeId;
            this.criteriaAmount.conditionValue = this.criteria.conditionValue;
            break;

          case 'TITLE':
            this.criteriaTitle.conditionTypeId = this.criteria.conditionTypeId;
            this.criteriaTitle.conditionValue = this.criteria.conditionValue;
            break;

          case 'DATE':
            this.criteriaDate.conditionTypeId = this.criteria.conditionTypeId;
            this.criteriaDate.conditionValue = this.criteria.conditionValue;
            break;
        }
      }

      if (this.criteriaAmount.conditionTypeId == undefined) {
        const conditionType = this.classifCriteriaAmount.find(item => item.property == 'LESS');
        this.criteriaAmount.conditionTypeId = conditionType?.id as bigint;
      }
      if (this.criteriaTitle.conditionTypeId == undefined) {
        const conditionType = this.classifCriteriaTitle.find(item => item.property == 'EQUALS');
        this.criteriaTitle.conditionTypeId = conditionType?.id as bigint;
      }
      if (this.criteriaDate.conditionTypeId == undefined) {
        const conditionType = this.classifCriteriaDate.find(item => item.property == 'FROM');
        this.criteriaDate.conditionTypeId = conditionType?.id as bigint;
        this.criteriaDate.conditionValue = dateCustomFormatting(new Date());
      }       
    }

    ngOnInit() {
      this.initializeDialog();
      this.onSelectCriteriaType(undefined, this.criteria.criteriaId, false);
    }

    doDialogOkAction() {
      if (!this.formView.isDataValid()) {
        this.messageBox.show("Data valitity", "Data is not correct!", MessageBoxButtons.ok);
      } else {
        switch (this.visibleCriteria) {
          case 'AMOUNT':
            this.criteria.conditionTypeId = this.formViewAmount.getFormFieldValue("conditionTypeId");
            this.criteria.conditionValue = this.formViewAmount.getFormFieldValue("conditionValue");
            break;

          case 'TITLE':
            this.criteria.conditionTypeId = this.formViewTitle.getFormFieldValue("conditionTypeId");
            this.criteria.conditionValue = this.formViewTitle.getFormFieldValue("conditionValue");
            break;

          case 'DATE':
            this.criteria.conditionTypeId = this.formViewDate.getFormFieldValue("conditionTypeId");
            this.criteria.conditionValue = dateCustomFormatting(datefromString(this.formViewDate.getFormFieldValue("conditionValue")));
            break;
        }
        this.criteria.criteriaId = this.formView.getFormFieldValue("criteriaId");
        this.dialogRef.close(createDialogParameter({data: this.criteria, action: this.action}));
      }
    }

    closeThisDialog() {
      if (!this.formView.isDataPristine()) {
        this.messageBox.show("Data changed", "Drop changes?", MessageBoxButtons.yesNo, (result) => {
          if (result == MessageBoxResult.yes) {
            this.dialogRef.close();
          }
        });
      } else {
        this.dialogRef.close();
      }
    }

    onSelectCriteriaType(event: any, selectedValue: any, reset: boolean) {
      const criteriaType = this.classifCriteria.find(item => item.id == selectedValue); 

      if (criteriaType) {
        this.visibleCriteria = criteriaType.property;
        if (reset) {
          this.formView.patchFormField("conditionValue", undefined);
        }
      }
    }

    initializeDialog(): void {
      const criteriaTypeEvents: IndexKeyMap<string, IDynamicFormEventEmitter<any>> = { };

      criteriaTypeEvents['selectionChange'] = { eventName: 'selectionChange', eventEmitter: new EventEmitter<any>() };
      criteriaTypeEvents['selectionChange'].eventEmitter.subscribe((event: any) => { this.onSelectCriteriaType(event, event.selectedValue, true); });

      this.dynamicForm = {
        formName: "GENERAL",
        formGroups: [
          {
            version: getVersion(),
            groupName: "GENERAL",
            controls: [
              {
                controlType: DynamicFormControlType.CLASSIFICATOR,
                controlName: "criteriaId",
                modelName: "criteriaId",
                label: "Criteria",
                placeholder: "Select criteria",
                width: 30,
                classificator: "CRITERIA-TYPE",
                events: criteriaTypeEvents,
              }
            ]
          },
        ]
      };
      
      this.dynamicFormAmount = {
        formName: "AMOUNT",
        formGroups: [
        {
          version: getVersion(),
          groupName: "AMOUNT",
          controls: [
            {
              version: getVersion(),
              controlType: DynamicFormControlType.CLASSIFICATOR,
              controlName: "conditionTypeId",
              modelName: "conditionTypeId",
              label: "Condition Type",
              placeholder: "Condition Type",
              width: 25,
              classificator: "CRITERIA-AMOUNT",
            },
            {
              version: getVersion(),
              controlType: DynamicFormControlType.NUMBER,
              controlName: "conditionValue",
              modelName: "conditionValue",
              label: "Condition Value",
              placeholder: "Condition Value",
              validators: [{validator:"required"}],
              width: 50,
            }
          ]
        }
      ]
      };
      
      this.dynamicFormTitle = {
        formName: "TITLE",
        formGroups: [
        {
        version: getVersion(),
        groupName: "TITLE",
        controls: [
          {
            version: getVersion(),
            controlType: DynamicFormControlType.CLASSIFICATOR,
            controlName: "conditionTypeId",
            modelName: "conditionTypeId",
            label: "Condition Type",
            placeholder: "Condition Type",
            width: 25,
            classificator: "CRITERIA-TITLE",
            initialData: "EQUALS",
          },
          {
            version: getVersion(),
            controlType: DynamicFormControlType.INPUT,
            controlName: "conditionValue",
            modelName: "conditionValue",
            label: "Condition Value",
            placeholder: "Condition Value",
            validators: [{validator:"required"}, {validator: "maxLength", value: 50}],
            width: 50,
            initialData: "",
          }
        ]
      }]
      };

      this.dynamicFormDate = {
        formName: "DATE",
        formGroups: [
        {
        version: getVersion(),
        groupName: "DATE",
        controls: [
          {
            version: getVersion(),
            controlType: DynamicFormControlType.CLASSIFICATOR,
            controlName: "conditionTypeId",
            modelName: "conditionTypeId",
            label: "Condition Type",
            placeholder: "Condition Type",
            width: 25,
            classificator: "CRITERIA-DATE",
            initialData: "FROM",
          },
          {
            version: getVersion(),
            controlType: DynamicFormControlType.DATEPICKER,
            controlName: "conditionValue",
            modelName: "conditionValue",
            label: "Condition Value",
            placeholder: "Condition Value",
            validators: [{validator:"required"}],
            width: 50,
            initialData: new Date(),
          }
        ]
      }]
      };
    };
  }
