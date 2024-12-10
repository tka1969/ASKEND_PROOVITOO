import { Pipe, PipeTransform } from '@angular/core';
import { IDataTableColumn, DataTableColumnType } from './data-table-column.interface';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dataPropertyGetter',
  standalone: true
})
export class DataPropertyGetterPipe implements PipeTransform {

  constructor(
    public datepipe: DatePipe
  ) {}

  transform(object: any, column: IDataTableColumn, memberName?: string, ...args: any[]): any {

    if (column.valueGetter) {
      return column.valueGetter(column, object);
    }

    const locale1 = Intl.DateTimeFormat().resolvedOptions().locale;

    if (memberName) {
      switch (column.type) {
        case DataTableColumnType.DATETIME:
          return this.datepipe.transform(object[memberName][column.dataKey], column.cellFormat ?? 'dd.MM.yyyy HH:mm:ss', locale1);
        case DataTableColumnType.DATE:
          return this.datepipe.transform(object[memberName][column.dataKey], column.cellFormat ?? 'dd.MM.yyyy', locale1);
        case DataTableColumnType.TIME:
          return this.datepipe.transform(object[memberName][column.dataKey], column.cellFormat ?? 'HH:mm:ss', locale1);
      }
      return object[memberName][column.dataKey];
    }
    else {
      switch (column.type) {
        case DataTableColumnType.DATETIME:
          return this.datepipe.transform(object[column.dataKey], column.cellFormat ?? 'dd.MM.yyyy HH:mm:ss', locale1);
        case DataTableColumnType.DATE:
          return this.datepipe.transform(object[column.dataKey], column.cellFormat ?? 'dd.MM.yyyy', locale1);
        case DataTableColumnType.TIME:
          return this.datepipe.transform(object[column.dataKey], column.cellFormat ?? 'HH:mm:ss', locale1);
      }
      return object[column.dataKey];
    }
  }
}
