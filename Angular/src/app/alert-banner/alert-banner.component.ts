import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertType = 'success' | 'warning' | 'error';

export interface AlertMessage {
  type: AlertType;
  message: string;
}

@Component({
  selector: 'app-alert-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="alert-banner" [ngClass]="alert.type" *ngIf="alert">
      <span class="alert-text">{{ alert.message }}</span>
      <button class="close-btn" (click)="close()">×</button>
    </div>
  `,
  styleUrls: ['./alert-banner.component.css']
})
export class AlertBannerComponent {
  @Input() alert?: AlertMessage;

  close(): void {
    this.alert = undefined;
  }
}
