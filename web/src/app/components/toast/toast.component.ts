import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="toast-card" [class.show]="show" (click)="close()">
      <div class="toast-icon">
        <i class="fas" [ngClass]="icon"></i>
      </div>
      <div class="toast-content">
        <div class="toast-header">
          <span class="toast-title">{{ title }}</span>
          <button class="close-btn">&times;</button>
        </div>
        <div class="toast-body">
          {{ message }}
        </div>
      </div>
    </div>
  `,
    styles: [`
    .toast-card {
      position: fixed;
      top: 24px;
      right: 24px;
      width: 350px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      display: flex;
      padding: 16px;
      z-index: 9999;
      cursor: pointer;
      transform: translateX(400px);
      transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .toast-card.show {
      transform: translateX(0);
    }
    .toast-icon {
      width: 40px;
      height: 40px;
      background: #4a90e2;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      margin-right: 12px;
      flex-shrink: 0;
    }
    .toast-content {
      flex-grow: 1;
    }
    .toast-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
    .toast-title {
      font-weight: 600;
      color: #333;
      font-size: 0.95rem;
    }
    .close-btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      color: #999;
      cursor: pointer;
      padding: 0 4px;
    }
    .toast-body {
      color: #666;
      font-size: 0.85rem;
      line-height: 1.4;
    }
  `]
})
export class ToastComponent {
    @Input() title: string = '';
    @Input() message: string = '';
    @Input() icon: string = 'fa-bell';
    @Input() show: boolean = false;
    @Output() closed = new EventEmitter<void>();

    close() {
        this.show = false;
        setTimeout(() => this.closed.emit(), 300);
    }
}
