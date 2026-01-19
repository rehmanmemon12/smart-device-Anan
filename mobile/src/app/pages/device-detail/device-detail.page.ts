import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonToggle,
    IonRange,
    IonSpinner,
    IonBadge,
    IonIcon,
    IonButton,
    ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
    powerOutline,
    sunnyOutline,
    batteryFullOutline,
    batteryHalfOutline,
    batteryDeadOutline,
    alertCircleOutline,
    wifiOutline
} from 'ionicons/icons';
import { DeviceService } from '../../services/device.service';
import { Device } from '../../models/device.model';

@Component({
    selector: 'app-device-detail',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        IonContent,
        IonHeader,
        IonTitle,
        IonToolbar,
        IonButtons,
        IonBackButton,
        IonToggle,
        IonRange,
        IonSpinner,
        IonBadge,
        IonIcon,
        IonButton
    ],
    templateUrl: './device-detail.page.html',
    styleUrls: ['./device-detail.page.scss']
})
export class DeviceDetailPage implements OnInit {
    device: Device | null = null;
    isLoading = true;
    error = '';
    isSaving = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private deviceService: DeviceService,
        private toastController: ToastController
    ) {
        addIcons({
            powerOutline,
            sunnyOutline,
            batteryFullOutline,
            batteryHalfOutline,
            batteryDeadOutline,
            alertCircleOutline,
            wifiOutline
        });
    }

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
        this.error = '';
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
                this.error = 'Failed to load device details. Check API connection.';
                this.isLoading = false;
            }
        });
    }

    retryLoad(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) this.loadDevice(id);
    }

    async togglePower(): Promise<void> {
        if (!this.device || this.isSaving) return;

        this.isSaving = true;
        const newState = !this.device.isOn;

        this.deviceService.updateDevice(this.device.id, { isOn: newState }).subscribe({
            next: (updated) => {
                this.device = updated;
                this.showToast(`Device turned ${newState ? 'ON' : 'OFF'}`, 'success');
                this.isSaving = false;
            },
            error: () => {
                this.showToast('Failed to update device', 'danger');
                this.isSaving = false;
            }
        });
    }

    onBrightnessChange(event: any): void {
        if (!this.device) return;
        this.device.brightness = event.detail.value;
    }

    saveBrightness(): void {
        if (!this.device || this.isSaving) return;

        this.isSaving = true;

        this.deviceService.updateDevice(this.device.id, { brightness: this.device.brightness }).subscribe({
            next: (updated) => {
                this.device = updated;
                this.showToast(`${this.device.type === 'thermostat' ? 'Temperature' : 'Brightness'} updated`, 'success');
                this.isSaving = false;
            },
            error: () => {
                this.showToast('Failed to update setting', 'danger');
                this.isSaving = false;
            }
        });
    }

    async showToast(message: string, color: string): Promise<void> {
        const toast = await this.toastController.create({
            message,
            duration: 2000,
            color,
            position: 'top',
            mode: 'ios'
        });
        await toast.present();
    }

    getDeviceIcon(type: string): string {
        const icons: Record<string, string> = {
            light: '💡', thermostat: '🌡️', sensor: '📡', controller: '🎛️',
            camera: '📷', sprinkler: '💦', plug: '🔌', fan: '🌀', doorbell: '🔔'
        };
        return icons[type] || '📱';
    }

    getBatteryColor(percentage: number): string {
        if (percentage < 20) return 'danger';
        if (percentage < 50) return 'warning';
        return 'success';
    }

    getTimeAgo(dateString: string | undefined): string {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        const now = new Date();
        const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        return `${Math.floor(diffHours / 24)} day${Math.floor(diffHours / 24) > 1 ? 's' : ''} ago`;
    }
}
