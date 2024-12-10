import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { IDataTableActionEvent } from './components/data-table/data-table-action-event.interface';
import { IDataTableAction, DataTableActionType } from './components/data-table/data-table-action.interface';
import { IDataTableColumn, DataTableColumnType } from './components/data-table/data-table-column.interface';
import { DataTableComponent } from './components/data-table/data-table.component';
import { ActionEnum } from './enums/action.enum';
import { FilterDataService } from './services/filter-data.service';
import { createFilter, IFilter } from './models/filter';
import { TitlebarComponent } from './components/titlebar/titlebar.component';
import { CommonServiceTask } from './comoon/common-service.task';
import { createQueryModel } from './models/query.model';
import { faEdit, faEye, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialog } from './filter-dialog.component';
import { MessageBoxButtons } from './components/message-box/message-box-buttons.enum';
import { MessageBoxService } from './components/message-box/message-box.service';
import { MessageBoxResult } from './components/message-box/message-box-result.enum';
import { createDialogParameter } from './models/dialog-parameter.model';
import { EVENTPROVIDER_NOTIFY_DATA, EVENTROVIDER_FILTER_GUID, FilterTemplateComponent } from './filter-template.component';
import { EventProviderService } from './services/event-provider.service';
import { MatButtonModule } from '@angular/material/button';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatToolbarModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    DataTableComponent,
    TitlebarComponent,
    FilterTemplateComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent extends CommonServiceTask implements OnInit {

  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly messageBox: MessageBoxService = inject(MessageBoxService);
  private readonly eventProvider: EventProviderService = inject(EventProviderService);
  private readonly filterService: FilterDataService = inject(FilterDataService);

  protected titlebarText: string = "FILTERS";
  protected filterTableActions: IDataTableAction[] = [];
  protected filterTableColumns: IDataTableColumn[] = [];
  protected isModal: boolean = false;
  protected isExpandedRowMode: boolean = true;
  protected toggleButtonText: string = "Toggle Modal";

  constructor(
    ) { 
      super();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadFormData(false);
  }

  get service() {
    return this.filterService;
  }

  loadFormData(refresh: boolean): void {
    this.doServiceTask("FILTER-QUERY", this.filterService.list(createQueryModel(), {refresh: refresh}));
  }

  toggleModal() {
    this.isExpandedRowMode = !this.isExpandedRowMode;
    this.toggleButtonText = this.isExpandedRowMode ? "Toggle Modal" : "Toggle Nonmodal";

    if (this.filterTableColumns && this.filterTableColumns[0].actions) {
      this.filterTableColumns[0].actions[0].hidden = this.isExpandedRowMode;
    }

    this.filterService.refresh();
  }

  protected openFilterDialog(event: IDataTableActionEvent<IFilter>, filter: IFilter) {

    const dialogRef = this.dialog.open(FilterDialog,
      {
        width: "auto",
        minWidth: "60%",
        height: "auto",
        maxHeight: "50%",
        disableClose: true,
        data: createDialogParameter({data: filter, action: event.action.action})});

    dialogRef.afterClosed().subscribe((result: IFilter)  => {
    });
  }

  filterTableAction(event: IDataTableActionEvent<IFilter>) {
    this.openFilterDialog(event, createFilter());
  }

  filterRowAction(event: IDataTableActionEvent<IFilter>) {
    switch (event.action.action)
    {
      case ActionEnum.DELETE:
      {
        if (event.payload.id !== undefined) {
          this.messageBox.show("Delete row", "Delete '" + event.payload.name + "' ?", MessageBoxButtons.yesNo, (result) => {
            if (result == MessageBoxResult.yes) {
              this.doServiceTask("FILTER-DELETE", this.filterService.delete(event.payload.id as bigint));
            }
          });
        }
        break;
      }

      case ActionEnum.VIEW:
      case ActionEnum.EDIT:
        this.openFilterDialog(event, event.payload);
        break;
    }
  }

  filterRowExpand(event: IDataTableActionEvent<IFilter>) {
    if (event.action.action === ActionEnum.EXPAND) {
      this.eventProvider.fireEvent(EVENTPROVIDER_NOTIFY_DATA, EVENTROVIDER_FILTER_GUID, event.payload);
    }
  }

  initializeForm(): void {

    this.filterTableActions = [
      {
        type: DataTableActionType.BUTTON,
        name: "Add new filter...",
        action: ActionEnum.NEW,
        icon: faEye,
      },
    ];

    const tableRowActions: IDataTableAction[] = [
      {
        type: DataTableActionType.ICON,
        name: "Edit",
        action: ActionEnum.EDIT,
        icon: faEdit,
        hidden: true,
      },
      {
        type: DataTableActionType.ICON,
        name: "Delete",
        action: ActionEnum.DELETE,
        icon: faTrashCan,
      },
    ];

    this.filterTableColumns = [
      {
        dataKey: "",
        type: DataTableColumnType.ACTION,
        label: "Actions",
        position: 'left',
        width: "10%",
        actions: tableRowActions
      },
      {
        dataKey: "name",
        type: DataTableColumnType.TEXT,
        label: "Name",
        position: 'left',
        width: "75%"
      },
    ];
  }
}
