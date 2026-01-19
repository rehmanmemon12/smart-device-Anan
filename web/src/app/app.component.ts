import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToastComponent } from './components/toast/toast.component';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  isSidebarCollapsed = true;
  isSidebarMobileOpen = false;
  fcmToken: string | null = null;

  // Toast states
  showToast = false;
  toastTitle = '';
  toastMessage = '';
  toastIcon = 'fa-bell';

  constructor(
    public authService: AuthService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.initializeNotifications();
  }

  initializeNotifications() {
    this.notificationService.requestPermission().subscribe({
      next: (token) => {
        this.fcmToken = token;
        console.log('FCM Token generated:', token);
        this.notificationService.listenForMessages();
      },
      error: (err) => {
        console.error('Could not get FCM token', err);
      }
    });

    this.notificationService.currentMessage$.subscribe(msg => {
      if (msg) {
        console.log('Incoming notification:', msg);
        this.displayToast(
          msg.notification?.title || 'System Alert',
          msg.notification?.body || 'New message received',
          'fa-bell'
        );
      }
    });
  }

  displayToast(title: string, message: string, icon: string) {
    this.toastTitle = title;
    this.toastMessage = message;
    this.toastIcon = icon;
    this.showToast = true;

    // Auto close after 5 seconds
    setTimeout(() => {
      this.showToast = false;
    }, 5000);
  }

  onToastClosed() {
    this.showToast = false;
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
