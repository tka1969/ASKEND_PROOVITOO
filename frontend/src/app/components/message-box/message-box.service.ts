import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageBoxComponent } from './message-box.component';
import { MessageBoxButtons } from './message-box-buttons.enum';
import { MessageBoxModel } from './message-box-model';
import { MessageBoxResult } from './message-box-result.enum';


@Injectable({
  providedIn: 'root'
})
export class MessageBoxService {

  constructor(private dialog: MatDialog) { }

  show(
    title: string, 
    message: string, 
    buttons: MessageBoxButtons = MessageBoxButtons.ok, 
    resultCallback?: ((result: MessageBoxResult) => void )): void {
      
    this.dialog.open(MessageBoxComponent, { data: new MessageBoxModel(title, message, buttons, resultCallback) });
  }
}
