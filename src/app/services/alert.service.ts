import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private messageSubject = new Subject<string>();

    message$: Observable<string> = this.messageSubject.asObservable();

  constructor() { }

  sendMessage(message: string) {
    this.messageSubject.next(message)
  }
}
