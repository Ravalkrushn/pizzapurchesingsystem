import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface AlertData {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  isConfirm?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new Subject<AlertData | null>();
  alertState$ = this.alertSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', title?: string, onConfirm?: () => void) {
    this.alertSubject.next({ message, type, title, onConfirm, isConfirm: false });
  }

  confirm(message: string, onConfirm: () => void, onCancel?: () => void, title: string = 'Are you sure?') {
    this.alertSubject.next({ 
      message, 
      type: 'warning', 
      title, 
      onConfirm, 
      onCancel, 
      isConfirm: true 
    });
  }

  clear() {
    this.alertSubject.next(null);
  }
}
