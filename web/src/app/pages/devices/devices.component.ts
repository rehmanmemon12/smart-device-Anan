import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DeviceService } from '../../services/device.service';
import { AuthService } from '../../services/auth.service';
import { Device } from '../../models/device.model';

@Component({
    selector: 'app-devices',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './devices.component.html',
    styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {
    devices: Device[] = [];
    filteredDevices: Device[] = [];
    searchQuery = '';
    isLoading = true;
    error = '';

    constructor(
        private deviceService: DeviceService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadDevices();
    }

    loadDevices(): void {
        this.isLoading = true;
        this.error = '';

        this.deviceService.getDevices().subscribe({
            next: (devices) => {
                this.devices = devices;
                this.filteredDevices = devices;
                this.isLoading = false;
            },
            error: (err) => {
                this.error = 'Failed to load devices. Please check if the API server is running.';
                this.isLoading = false;
            }
        });
    }

    onSearch(): void {
        if (!this.searchQuery.trim()) {
            this.filteredDevices = this.devices;
            return;
        }

        const query = this.searchQuery.toLowerCase();
        this.filteredDevices = this.devices.filter(device =>
            device.name.toLowerCase().includes(query) ||
            device.location.toLowerCase().includes(query) ||
            device.type.toLowerCase().includes(query)
        );
    }

    clearSearch(): void {
        this.searchQuery = '';
        this.filteredDevices = this.devices;
    }

    getStatusClass(device: Device): string {
        return device.isOnline ? 'online' : 'offline';
    }

    getBatteryClass(device: Device): string {
        if (device.batteryPercentage < 20) return 'critical';
        if (device.batteryPercentage < 50) return 'warning';
        return 'good';
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

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
