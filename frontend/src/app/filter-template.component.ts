import { Component, EventEmitter, HostBinding, inject, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { createFilter, IFilter, SomeSelectionEnum } from './models/filter';
import { CommonServiceTask } from './comoon/common-service.task';
import { createQueryModel } from './models/query.model';
import { FilterCriteriaDataService } from './services/filter-criteria-data.service';
import { ServiceResultCode } from './services/basedata.service';
import { createFilterCriteria, IFilterCriteria } from './models/filter-criteria';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { tableRowActions } from './comoon/common.form-actions';
import { IDataTableAction, DataTableActionType } from './components/data-table/data-table-action.interface';
import { IDataTableColumn, DataTableColumnType } from './components/data-table/data-table-column.interface';
import { ActionEnum } from './enums/action.enum';
import { IParameter } from './models/parameter';
import { ClassificatorService } from './services/classificator.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DataTableComponent } from './components/data-table/data-table.component';
import { IDataTableActionEvent } from './components/data-table/data-table-action-event.interface';
import { MessageBoxButtons } from './components/message-box/message-box-buttons.enum';
import { MessageBoxResult } from './components/message-box/message-box-result.enum';
import { MessageBoxService } from './components/message-box/message-box.service';
import { DynamicFormComponent } from './components/dynamic/dynamic-form/dynamic-form.component';
import { IDynamicForm, DynamicFormControlType } from './components/dynamic/models/dynamic-layout.interface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CriteriaDialog } from './criteria-dialog.component';
import { createDialogParameter, IDialogParameter } from './models/dialog-parameter.model';
import { getVersion } from './utility/utility-helpers';
import { FilterDataService } from './services/filter-data.service';
import { dateCustomFormatting, datefromString } from './utility/date-converter';
import { EventProviderService, IEventProviderNotify } from './services/event-provider.service';
import { Guid, GUID } from './utility/guid';

export const EVENTROVIDER_FILTER_GUID: GUID = Guid.createGUID();
export const EVENTPROVIDER_NOTIFY_DATA: string = Guid.raw();


@Component({
  selector: 'filter-template-component',
  templateUrl: './filter-template.component.html',
  styleUrls: ["./filter-template.component.scss"],
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
    DataTableComponent,
    DynamicFormComponent,
  ],
  host: {
    '[id]': 'id',
  },
})
export class FilterTemplateComponent extends CommonServiceTask implements OnInit, OnDestroy {

  static nextId = 0;
  @HostBinding() id = `filter-template-${FilterTemplateComponent.nextId++}`;

  private readonly dialog = inject(MatDialog);
  private readonly messageBox: MessageBoxService = inject(MessageBoxService);
  private readonly eventProvider: EventProviderService = inject(EventProviderService);
  protected filterService: FilterDataService = inject(FilterDataService);
  protected filterCriteriaService: FilterCriteriaDataService = inject(FilterCriteriaDataService);
  protected classificatorService: ClassificatorService = inject(ClassificatorService);
  private readonly filterGuid: GUID = Guid.createGUID();

  @ViewChild(DynamicFormComponent) protected formView!: DynamicFormComponent;
  protected dynamicForm!: IDynamicForm;

  @ViewChild("dialogRadioForm") protected formRadioView!: DynamicFormComponent;
  protected dynamicRadioForm!: IDynamicForm;

  protected criteriaTableActions: IDataTableAction[] = [];
  protected criteriaTableColumns: IDataTableColumn[] = [];

  private isDataChanged: boolean = false;

  protected someSelection: any = { someSelection: SomeSelectionEnum.SEL_1 };

  @Input() filter: IFilter = createFilter();
  @Input() isModal: boolean = false;
  @Input() contentHeight: string = "350px";

  @Output() close: EventEmitter<any> = new EventEmitter();

  private readonly classifCriteria: IParameter[] = [];
  private readonly classifCriteriaAmount: IParameter[] = [];
  private readonly classifCriteriaTitle: IParameter[] = [];
  private readonly classifCriteriaDate: IParameter[] = [];

  constructor(
  ) {
      super();

      this.classifCriteria = this.classificatorService.get("CRITERIA-TYPE");
      this.classifCriteriaAmount = this.classificatorService.get("CRITERIA-AMOUNT");
      this.classifCriteriaTitle = this.classificatorService.get("CRITERIA-TITLE");
      this.classifCriteriaDate = this.classificatorService.get("CRITERIA-DATE");
      
      if (!this.isModal) {
        this.eventProvider.addEvent(EVENTROVIDER_FILTER_GUID, this.filterGuid, "DATA_ARRAIVED");

        this.eventProvider.subscribeEvent(
          EVENTROVIDER_FILTER_GUID,
          this.filterGuid,
          ((event: IEventProviderNotify) => {
            if ((event.eventName === EVENTPROVIDER_NOTIFY_DATA) && (event.subscriberId === this.filterGuid)) {
              const filter = event.args[0] as IFilter;
              if (filter.id === this.filter.id && filter.version === this.filter.version) {
                this.onDataReceived(event.args[0] as IFilter);
              }
            }
          })
        );
      }
  }

  ngOnInit() {
    this.initializeDialog();
    
    if (this.isModal) {
      this.onDataReceived(this.filter);
    }
  }

  ngOnDestroy() {
    if (this.isModal) {
      this.eventProvider.removeEvent(EVENTROVIDER_FILTER_GUID, this.filterGuid);
    }
  }

  get service() {
    return this.filterCriteriaService;
  }

  public onDataReceived(filter: IFilter): void {
    this.filter = filter;
    if (this.filter.id) {
      this.doServiceTask("FILTER-CRITERIA-QUERY", this.filterCriteriaService.list(createQueryModel({parameters: {filterId: this.filter.id}}), {refresh: true}));
    } else {
      this.filterCriteriaService.cleanResource();
      this.filterCriteriaService.setLoaded();
    }
  }

  override onServiceComplete(serviceName: string, resultCode: ServiceResultCode, result: any, parameterData?: any): void {
    if (serviceName == "FILTER-CRITERIA-QUERY") {
      this.filter.criterias = result as IFilterCriteria[];
      this.filter.version = getVersion();
    } else if (serviceName == "FILTER-PUT" || serviceName == "FILTER-ADD") {
      this.filter = result as IFilter;
      this.filter.version = getVersion();
      this.isDataChanged = false;
      this.formView.markAsPristine();
      this.formRadioView.markAsPristine();
    }
  }

  onSaveAction() {
    if (!this.formView.isDataValid() || !this.formRadioView.isDataValid()) {
      this.messageBox.show("Data valitity", "Data is not correct!", MessageBoxButtons.ok);
    } else {
      this.filter.name = this.formView.getFormFieldValue("filterName");
      this.filter.someSelection = this.formRadioView.getFormFieldValue("someSelection");

      if (this.filter.id) {
        this.doServiceTask("FILTER-PUT", this.filterService.save(this.filter));
      } else {
        this.doServiceTask("FILTER-ADD", this.filterService.add(this.filter));
      }
    }
  }

  doClose() {
    if (this.isDataChanged || !this.formView.isDataPristine() || !this.formRadioView.isDataPristine()) {
      this.messageBox.show("Data changed", "Drop changes?", MessageBoxButtons.yesNo, (result) => {
        if (result == MessageBoxResult.yes) {
          this.close.emit();
        }
      });
    } else {
      this.close.emit();
    }
  }
  
  protected openCriteriaDialog(event: IDataTableActionEvent<IFilterCriteria>, criteria: IFilterCriteria) {

    const dialogRef = this.dialog.open(CriteriaDialog, {width: "45%", disableClose: true, data: createDialogParameter({data: criteria, action: event.action.action})});

    dialogRef.afterClosed().subscribe((result: IDialogParameter)  => {
      if (result) {

        const retFilter = result.data as IFilterCriteria;

        retFilter.version = getVersion();
        retFilter.filterId = this.filter.id as bigint;

        if (retFilter.id && retFilter.id != 0) {
          const criteriaIdx = this.filter.criterias?.findIndex(crit => crit.id == retFilter.id);

          if (criteriaIdx == -1) {
            this.filter.criterias.push(retFilter);
            this.filterCriteriaService.upsertResource(retFilter);
          } else {
            this.filter.criterias[criteriaIdx] = retFilter;
            this.filterCriteriaService.upsertResource(retFilter);
          }
        } else {
          this.filter.criterias.push(retFilter);
          this.filterCriteriaService.upsertResource(retFilter);
        }
        this.isDataChanged = true;
        this.filter.version = getVersion();
      }
    });
  }

  criteriaTableAction(event: IDataTableActionEvent<IFilterCriteria>) {
    this.openCriteriaDialog(event, createFilterCriteria());
  }

  criteriaRowAction(event: IDataTableActionEvent<IFilterCriteria>) {
    switch (event.action.action)
    {
      case ActionEnum.DELETE:
      {
        if (event.payload.id !== undefined) {
          this.messageBox.show("Delete row", "Delete selected criteria?", MessageBoxButtons.yesNo, (result) => {
            if (result == MessageBoxResult.yes) {
              this.doServiceTask("FILTER-CRITERIA-DELETE", this.filterCriteriaService.delete(event.payload.id as bigint));
            }
          });
        }
        break;
      }

      case ActionEnum.VIEW:
      case ActionEnum.EDIT:
        this.openCriteriaDialog(event, event.payload);
        break;
    }
  }

  resolveConditionType(rowItem: IFilterCriteria): any {
    const criteriaType = this.classifCriteria.find(item => item.id == rowItem.criteriaId); 

    if (criteriaType) {
      switch (criteriaType.property) {
        case 'AMOUNT': {
          return this.classifCriteriaAmount.find(item => item.id == rowItem.conditionTypeId)?.name;
        }
        case 'TITLE':
          return this.classifCriteriaTitle.find(item => item.id == rowItem.conditionTypeId)?.name;
        case 'DATE':
          return this.classifCriteriaDate.find(item => item.id == rowItem.conditionTypeId)?.name;
        }
      }
      return "";
  }

  formatConditionValue(rowItem: IFilterCriteria): string | undefined {
    const criteriaType = this.classifCriteria.find(item => item.id == rowItem.criteriaId); 

    if (criteriaType) {
      switch (criteriaType.property) {
        case 'AMOUNT':
          return rowItem.conditionValue;
        case 'TITLE':
          return rowItem.conditionValue;
        case 'DATE':
          return dateCustomFormatting(datefromString(rowItem.conditionValue as string));
        }
      }
      return "";
  }

  initializeDialog(): void {

    this.criteriaTableActions = [
      {
        type: DataTableActionType.BUTTON,
        name: "Add new criteria...",
        action: ActionEnum.NEW,
        icon: faEye,
      },
    ];

    this.criteriaTableColumns = [
      {
        dataKey: "",
        type: DataTableColumnType.ACTION,
        label: "Actions",
        position: 'left',
        width: "10%",
        actions: tableRowActions
      },
      {
        dataKey: "criteriaId",
        type: DataTableColumnType.TEXT,
        label: "Criteria",
        position: 'left',
        width: "25%",
        valueGetter: (column: IDataTableColumn, rowItem: IFilterCriteria): string | undefined => { return this.classifCriteria.find(item => item.id == rowItem.criteriaId)?.name; },
      },

      {
        dataKey: "conditionTypeId",
        type: DataTableColumnType.TEXT,
        label: "Condition Type",
        position: 'left',
        width: "25%",
        valueGetter: (column: IDataTableColumn, rowItem: IFilterCriteria): string | undefined => { const self=this; return this.resolveConditionType(rowItem); },
      },
      {
        dataKey: "conditionValue",
        type: DataTableColumnType.TEXT,
        label: "Condition Value",
        position: 'left',
        width: "25%",
        valueGetter: (column: IDataTableColumn, rowItem: IFilterCriteria): string | undefined => { const self=this; return this.formatConditionValue(rowItem); },
      },
    ];

    this.dynamicForm = {
      formName: "NAME",
      formGroups: [
        {
          controls: [
            {
              controlType: DynamicFormControlType.INPUT,
              controlName: "filterName",
              modelName: "name",
              label: "Filter name",
              placeholder: "Filter name",
              validators: [{validator: "maxLength", value: 50}],
              width: 50,
            }
          ]
        }
      ]
    };

    this.dynamicRadioForm = {
      formName: "SELECTION",
      formGroups: [
        {
          controls: [
            {
              controlType: DynamicFormControlType.RADIOGROUP,
              controlName: "someSelection",
              modelName: "someSelection",
              label: "Selection",
              options: [
                { key: SomeSelectionEnum.SEL_1, value: "Selection 1" },
                { key: SomeSelectionEnum.SEL_2, value: "Selection 2" },
                { key: SomeSelectionEnum.SEL_3, value: "Selection 3" }
              ],
              validators: [{validator:"required"}],
              width: 100,
            }
          ]
        }
      ]
    };

    
    
  }

}
