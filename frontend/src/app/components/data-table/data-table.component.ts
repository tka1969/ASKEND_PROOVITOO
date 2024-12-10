import {AfterViewInit, Component, EventEmitter, HostBinding, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {IDataTableColumn, DataTableColumnType} from './data-table-column.interface';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DataTableActionType, IDataTableAction } from './data-table-action.interface';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DataPropertyGetterPipe } from './data-property-getter.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faSquareMinus, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { ResourceType } from '../../types/resource.type';
import { ISignalResource } from '../../types/signal-resource.type';
import { ActionEnum } from '../../enums/action.enum';
import { MatIconModule } from '@angular/material/icon';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'widget-data-table',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatFormFieldModule, 
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule, 
    MatPaginatorModule,
    MatFormFieldModule, 
    ReactiveFormsModule,
    FontAwesomeModule,
    DataPropertyGetterPipe
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  host: {
    '[id]': 'id',
  },
})
export class DataTableComponent implements OnInit, AfterViewInit {

  static nextId = 0;
  @HostBinding() id = `data-table-${DataTableComponent.nextId++}`;

  protected tableDataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  protected columnsToDisplay: string[] = [];
   protected dataColumns: IDataTableColumn[] = [];

  protected dateFormat: string = 'dd.MM.yyyy&nbsp;HH:mm:ss';
  protected rowClickAction: IDataTableAction = {
    type: DataTableActionType.LINK,
    name: "View",
    action: ActionEnum.VIEW,
    icon: faEye,
  };

  protected rowExpandAction: IDataTableAction = {
    type: DataTableActionType.LINK,
    name: "Expand",
    action: ActionEnum.EXPAND,
    icon: faSquarePlus,
  };

  protected rowCollapseAction: IDataTableAction = {
    type: DataTableActionType.LINK,
    name: "Collapse",
    action: ActionEnum.COLLAPSE,
    icon: faSquareMinus,
  };

  protected expandMore: IconProp = faSquarePlus;
  protected expandLess: IconProp = faSquareMinus;

  @ViewChild(MatTable, {static: false}) table!: MatTable<any>;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  @Input() set tableColumns(columns: IDataTableColumn[]){
    this.dataColumns = columns;
    this.columnsToDisplay = columns.map((tableColumn: IDataTableColumn) => tableColumn.label);
  }

  @Input() tableActions: IDataTableAction[] = [];
  @Input() isPageable = true;
  @Input() paginationSizes: number[] = [5, 10, 15];
  @Input() defaultPageSize = this.paginationSizes[1];

  @Output() tableActionEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowActionEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowExpandEvent: EventEmitter<any> = new EventEmitter<any>();

  @Input() set tableData(data: any) {
    if (this.instanceOfISignalResource(data)) {
      this.setTableDataSource(data.payload);
    }
    else {
      this.setTableDataSource(data);
    }
  }

  @Input() set expandedRowTemplate(rowTemplate: TemplateRef<any> | undefined) {
    if (!rowTemplate) {
      this.expandedElement = null;
    }
    this.expandRowTemplate = rowTemplate;
  }

  @Input() set expandedRowMode(expandedRowMode: boolean) {
    this.isExpandedRowMode = expandedRowMode;
  }

  protected isExpandedRowMode: boolean = false;
  protected expandRowTemplate?: TemplateRef<any>;
  protected expandedElement: any | null = null;

  filterValues: any = {};
  lowValue: number = 0;
  highValue: number = 20;
    
  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.isPageable && this.paginator) {
      this.tableDataSource.paginator = this.paginator;
    }
  }

  rowTrackingFn = (index: number, row: ResourceType<any>): any => {
    return row.version;
  };

  private instanceOfISignalResource<T>(data: any): data is ISignalResource<T> {
    if (data) {
      return this.implementsObject<ISignalResource<string>>(data, ['version', 'payload']);
    }
    return false;
  }

  private implementsObject<T>(obj: any, keys: (keyof T)[]): boolean {
    for (const key of keys) {
      if (!Reflect.has(obj, key)) {
        return false;
      }
    }
    return true;
  }

  public getPaginatorData(event: PageEvent): PageEvent {
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    return event;
  }

  setTableDataSource(data: any) {
    this.tableDataSource = new MatTableDataSource<any>(data);

    if (this.paginator) {
      this.tableDataSource.paginator = this.paginator;
    }
  }

  get tableColumnType() { return DataTableColumnType; }
  get tableActionType() { return DataTableActionType; }

  public isDisabled = (action: IDataTableAction): boolean => {
    return (ActionEnum.DELETE === action.action);
  }
}
