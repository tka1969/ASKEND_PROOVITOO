import { Component, OnInit, Inject } from '@angular/core';
import { MessageBoxButtons } from './message-box-buttons.enum';
import { MessageBoxResult } from './message-box-result.enum';
import { MessageBoxModel } from './message-box-model';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule } from '@angular/cdk/drag-drop';


@Component({
  selector: 'message-box',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, DragDropModule],
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss']
})
export class MessageBoxComponent implements OnInit {
  messageBoxResult = MessageBoxResult;

  title: string;
  message: string;
  buttons: MessageBoxButtons;
  resultCallback?: (result: MessageBoxResult) => void;

  isOkVisible(): boolean {
    return this.buttons == MessageBoxButtons.ok || this.buttons == MessageBoxButtons.okCancel;
  }

  isCancelVisible(): boolean {
    return this.buttons == MessageBoxButtons.okCancel || this.buttons == MessageBoxButtons.yesNoCancel || this.buttons == MessageBoxButtons.retryCancel;
  }

  isAbortVisible(): boolean {
    return this.buttons == MessageBoxButtons.abortRetryIgnore;
  }

  isRetryVisible(): boolean {
    return this.buttons == MessageBoxButtons.abortRetryIgnore || this.buttons == MessageBoxButtons.retryCancel;
  }

  isIgnoreVisible(): boolean {
    return this.buttons == MessageBoxButtons.abortRetryIgnore;
  }

  isYesVisible(): boolean {
    return this.buttons == MessageBoxButtons.yesNoCancel || this.buttons == MessageBoxButtons.yesNo;
  }

  isNoVisible(): boolean {
    return this.buttons == MessageBoxButtons.yesNoCancel || this.buttons == MessageBoxButtons.yesNo;
  }

  constructor(
    public dialogRef: MatDialogRef<MessageBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MessageBoxModel
  ) { 
    this.title = data.title;
    this.message = data.message;
    this.buttons = data.buttons;
    this.resultCallback = data.resultCallback;
  }

  ngOnInit() {
    this.dialogRef.disableClose = true;
  }

  onAcknowledge(result: MessageBoxResult) {
    if (this.resultCallback) {
      this.resultCallback(result);
    }
    this.dialogRef.close();
  }
}
