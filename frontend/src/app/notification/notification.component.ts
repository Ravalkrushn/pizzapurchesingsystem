import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, AlertData } from '../services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="alert" class="alert-overlay" (click)="onCancelAction()">
      <div class="alert-card" [ngClass]="alert.type" (click)="$event.stopPropagation()">
        <div class="icon-container">
          <i *ngIf="alert.type === 'success'" class="bi bi-check-circle-fill"></i>
          <i *ngIf="alert.type === 'error'" class="bi bi-exclamation-triangle-fill"></i>
          <i *ngIf="alert.type === 'info'" class="bi bi-info-circle-fill"></i>
          <i *ngIf="alert.type === 'warning'" class="bi bi-patch-exclamation-fill"></i>
        </div>
        
        <h2 class="alert-title">{{ alert.title || defaultTitle }}</h2>
        <p class="alert-message">{{ alert.message }}</p>
        
        <div class="button-group">
          <button *ngIf="alert.isConfirm" class="alert-button cancel-btn" (click)="onCancelAction()">Cancel</button>
          <button class="alert-button confirm-btn" (click)="onConfirmAction()">
            {{ alert.isConfirm ? 'Confirm' : 'Okay' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .alert-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(5px);
      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
      animation: fadeIn 0.3s ease-out;
    }

    .alert-card {
      background: #ffffff;
      padding: 35px 30px;
      border-radius: 20px;
      width: 90%;
      max-width: 400px;
      text-align: center;
      box-shadow: 0 20px 50px rgba(0,0,0,0.2);
      transform: scale(0.7);
      opacity: 0;
      animation: slideIn 0.3s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .icon-container {
      font-size: 3.5rem;
      line-height: 1;
      margin-bottom: 20px;
    }

    .success .icon-container { color: #2ecc71; text-shadow: 0 5px 15px rgba(46, 204, 113, 0.3); }
    .error .icon-container { color: #e74c3c; text-shadow: 0 5px 15px rgba(231, 76, 60, 0.3); }
    .info .icon-container { color: #3498db; text-shadow: 0 5px 15px rgba(52, 152, 219, 0.3); }
    .warning .icon-container { color: #f39c12; text-shadow: 0 5px 15px rgba(243, 156, 18, 0.3); }

    .alert-title {
      font-size: 24px;
      font-weight: 700;
      color: #333;
      margin-top: 0;
      margin-bottom: 12px;
      letter-spacing: -0.5px;
    }

    .alert-message {
      color: #666;
      font-size: 16px;
      line-height: 1.5;
      margin-bottom: 30px;
    }

    .button-group {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .alert-button {
      padding: 12px 30px;
      min-width: 120px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .alert-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(0,0,0,0.2);
    }

    .alert-button:active {
      transform: translateY(0);
    }

    .confirm-btn {
      background: linear-gradient(135deg, #333, #555);
      color: white;
    }

    .cancel-btn {
      background: #f1f2f6;
      color: #57606f;
    }

    /* Success Theme Override Button */
    .success .confirm-btn { background: linear-gradient(135deg, #2ecc71, #27ae60); }
    .error .confirm-btn { background: linear-gradient(135deg, #e74c3c, #c0392b); }
    .info .confirm-btn { background: linear-gradient(135deg, #3498db, #2980b9); }
    .warning .confirm-btn { background: linear-gradient(135deg, #f39c12, #e67e22); }


    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
  `]
})
export class NotificationComponent implements OnInit, OnDestroy {
  alert: AlertData | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.subscription = this.alertService.alertState$.subscribe(
      (data) => (this.alert = data)
    );
  }

  get defaultTitle(): string {
    if (!this.alert) return 'Notification';
    return this.alert.type.charAt(0).toUpperCase() + this.alert.type.slice(1);
  }

  onConfirmAction() {
    if (this.alert?.onConfirm) {
      this.alert.onConfirm();
    }
    this.alertService.clear();
  }

  onCancelAction() {
    if (this.alert?.onCancel) {
      this.alert.onCancel();
    }
    this.alertService.clear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
