import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DeviceService } from '../../services/device.service';
import { AuthService } from '../../services/auth.service';
import { Device } from '../../models/device.model';

@Component({
    selector: 'app-device-detail',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './device-detail.component.html',
    styleUrls: ['./device-detail.component.scss']
})
export class DeviceDetailComponent implements OnInit {
    device: Device | null = null;
    isLoading = true;
    error = '';
    isSaving = false;
    feedbackMessage = '';
    feedbackType: 'success' | 'error' = 'success';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private deviceService: DeviceService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadDevice(id);
        } else {
            this.error = 'Device ID not found';
            this.isLoading = false;
        }
    }

    loadDevice(id: string): void {
        this.isLoading = true;
        this.deviceService.getDevice(id).subscribe({
            next: (device) => {
                if (device) {
                    this.device = device;
                } else {
                    this.error = 'Device not found';
                }
                this.isLoading = false;
            },
            error: () => {
                this.error = 'Failed to load device';
                this.isLoading = false;
            }
        });
    }

    togglePower(): void {
        if (!this.device) return;

        this.isSaving = true;
        const newState = !this.device.isOn;

        this.deviceService.updateDevice(this.device.id, { isOn: newState }).subscribe({
            next: (updated) => {
                this.device = updated;
                this.showFeedback(`Device turned ${newState ? 'ON' : 'OFF'}`, 'success');
                this.isSaving = false;
            },
            error: () => {
                this.showFeedback('Failed to update device', 'error');
                this.isSaving = false;
            }
        });
    }

    updateBrightness(event: Event): void {
        if (!this.device) return;

        const value = (event.target as HTMLInputElement).valueAsNumber;
        this.device.brightness = value;
    }

    saveBrightness(): void {
        if (!this.device) return;

        this.isSaving = true;

        this.deviceService.updateDevice(this.device.id, { brightness: this.device.brightness }).subscribe({
            next: (updated) => {
                this.device = updated;
                this.showFeedback(`Brightness set to ${this.device?.brightness}%`, 'success');
                this.isSaving = false;
            },
            error: () => {
                this.showFeedback('Failed to update brightness', 'error');
                this.isSaving = false;
            }
        });
    }

    showFeedback(message: string, type: 'success' | 'error'): void {
        this.feedbackMessage = message;
        this.feedbackType = type;
        setTimeout(() => {
            this.feedbackMessage = '';
        }, 3000);
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

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
