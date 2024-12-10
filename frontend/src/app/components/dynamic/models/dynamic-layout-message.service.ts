import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class DynamicFormMessageService {
    public messageSubject = new Subject<any>();
    public message$ = this.messageSubject.asObservable()
}
