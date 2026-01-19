import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DeviceService } from '../../services/device.service';
import { AuthService } from '../../services/auth.service';
import { Device } from '../../models/device.model';

@Component({
    selector: 'app-alerts',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './alerts.component.html',
    styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
    offlineDevices: Device[] = [];
    lowBatteryDevices: Device[] = [];
    isLoading = true;
    error = '';

    constructor(
        private deviceService: DeviceService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadAlerts();
    }

    loadAlerts(): void {
        this.isLoading = true;
        this.error = '';

        this.deviceService.getAlertDevices().subscribe({
            next: (alerts) => {
                this.offlineDevices = alerts.offline;
                this.lowBatteryDevices = alerts.lowBattery;
                this.isLoading = false;
            },
            error: () => {
                this.error = 'Failed to load alerts. Please check if the API server is running.';
                this.isLoading = false;
            }
        });
    }

    getDeviceIcon(type: string): string {
        const icons: Record<string, string> = {
            light: '💡',
            thermostat: '🌡️',
            sensor: '📡',
            controller: '🎛️',
            camera: '📷',
            sprinkler: '💦',
            plug: '🔌',
            fan: '🌀',
            doorbell: '🔔'
        };
        return icons[type] || '📱';
    }

    getTimeAgo(dateString: string): string {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }

    get totalAlerts(): number {
        return this.offlineDevices.length + this.lowBatteryDevices.length;
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
