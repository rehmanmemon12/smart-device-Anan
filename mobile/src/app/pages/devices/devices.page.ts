import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonRefresher,
    IonRefresherContent,
    IonIcon,
    IonButtons,
    IonButton,
    IonSkeletonText,
    RefresherEventDetail
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
    batteryFullOutline,
    batteryHalfOutline,
    batteryDeadOutline,
    logOutOutline,
    alertCircleOutline,
    searchOutline,
    chevronDownCircleOutline
} from 'ionicons/icons';
import { DeviceService } from '../../services/device.service';
import { AuthService } from '../../services/auth.service';
import { Device } from '../../models/device.model';

@Component({
    selector: 'app-devices',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        IonContent,
        IonHeader,
        IonTitle,
        IonToolbar,
        IonSearchbar,
        IonRefresher,
        IonRefresherContent,
        IonIcon,
        IonButtons,
        IonButton,
        IonSkeletonText
    ],
    templateUrl: './devices.page.html',
    styleUrls: ['./devices.page.scss']
})
export class DevicesPage implements OnInit {
    devices: Device[] = [];
    filteredDevices: Device[] = [];
    searchQuery = '';
    isLoading = true;
    error = '';

    constructor(
        private deviceService: DeviceService,
        private authService: AuthService,
        private router: Router
    ) {
        addIcons({
            batteryFullOutline,
            batteryHalfOutline,
            batteryDeadOutline,
            logOutOutline,
            alertCircleOutline,
            searchOutline,
            chevronDownCircleOutline
        });
    }

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
            error: () => {
                this.error = 'Unable to connect to your home hub. Please verify the API is active.';
                this.isLoading = false;
            }
        });
    }

    onSearch(event: any): void {
        const query = event.detail.value?.toLowerCase() || '';
        this.searchQuery = query;

        if (!query) {
            this.filteredDevices = this.devices;
            return;
        }

        this.filteredDevices = this.devices.filter(device =>
            device.name.toLowerCase().includes(query) ||
            device.location.toLowerCase().includes(query)
        );
    }

    doRefresh(event: CustomEvent<RefresherEventDetail>): void {
        this.deviceService.getDevices().subscribe({
            next: (devices) => {
                this.devices = devices;
                this.filteredDevices = devices;
                (event.target as HTMLIonRefresherElement).complete();
            },
            error: () => {
                (event.target as HTMLIonRefresherElement).complete();
            }
        });
    }

    openDevice(device: Device): void {
        this.router.navigate(['/devices', device.id]);
    }

    getDeviceIcon(type: string): string {
        const icons: Record<string, string> = {
            light: '💡', thermostat: '🌡️', sensor: '📡', controller: '🎛️',
            camera: '📷', sprinkler: '💦', plug: '🔌', fan: '🌀', doorbell: '🔔'
        };
        return icons[type] || '📱';
    }

    getBatteryIcon(percentage: number): string {
        if (percentage < 20) return 'battery-dead-outline';
        if (percentage < 50) return 'battery-half-outline';
        return 'battery-full-outline';
    }

    getBatteryColor(percentage: number): string {
        if (percentage < 20) return 'danger';
        if (percentage < 50) return 'warning';
        return 'success';
    }

    getTimeAgo(dateString: string): string {
        const date = new Date(dateString);
        const now = new Date();
        const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${Math.floor(diffHours / 24)}d ago`;
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
