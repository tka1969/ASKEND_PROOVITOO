import { Component, Inject, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { createFilter, IFilter } from './models/filter';
import { CommonServiceTask } from './comoon/common-service.task';
import { ActionEnum } from './enums/action.enum';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IDialogParameter } from './models/dialog-parameter.model';
import { FilterTemplateComponent } from './filter-template.component';

@Component({
    selector: 'filter-dialog',
    templateUrl: './filter-dialog.component.html',
    styleUrls: ["./filter-dialog.component.scss"],
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
      FilterTemplateComponent
    ],
  })
  export class FilterDialog extends CommonServiceTask {
    private readonly dialog = inject(MatDialog);
    private readonly action: ActionEnum;
    protected filter: IFilter = createFilter();

    constructor(
      private readonly dialogRef: MatDialogRef<FilterDialog>,
      @Inject(MAT_DIALOG_DATA) private readonly dialogData: IDialogParameter,
    ) {
        super();
        this.action = dialogData.action as ActionEnum;
        this.filter = dialogData.data as IFilter;
    }

    onCloseDialog() {
      this.dialogRef.close();
    }
  }
