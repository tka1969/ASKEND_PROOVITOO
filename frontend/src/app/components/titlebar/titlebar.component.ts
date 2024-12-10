import { Component, HostBinding, Input } from '@angular/core';
import { AlertPanelComponent } from '../alert-panel/alert-panel.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'widget-titlebar',
  standalone: true,
  imports: [
    CommonModule,
    AlertPanelComponent
  ],
  templateUrl: './titlebar.component.html',
  styleUrl: './titlebar.component.scss',
  host: {
    '[id]': 'id',
  },
})
export class TitlebarComponent {

  static nextId = 0;
  @HostBinding() id = `widget-titlebar-${TitlebarComponent.nextId++}`;

  @Input() alertPanelId: string = "default-alert";
  @Input() titleText: string = "";

  private _fontWeight: string = "normal";

  @Input()
    get boldText(): boolean { return this._fontWeight === "bold"; }
    set boldText(boldText: boolean) { this._fontWeight = boldText ? "bold" : "normal"; }

    @Input()
    get fontWeight(): string { return this._fontWeight; }
    set fontWeight(fontWeight: string) { this._fontWeight = fontWeight; }
}
