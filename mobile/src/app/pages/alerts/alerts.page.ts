import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    IonButtons,
    IonButton,
    IonSkeletonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
    alertCircleOutline,
    batteryDeadOutline,
    wifiOutline,
    checkmarkCircleOutline,
    chevronDownCircleOutline,
    chevronForwardOutline
} from 'ionicons/icons';
import { DeviceService } from '../../services/device.service';
import { Device } from '../../models/device.model';

@Component({
    selector: 'app-alerts',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        IonContent,
        IonHeader,
        IonTitle,
        IonToolbar,
        IonIcon,
        IonRefresher,
        IonRefresherContent,
        IonButtons,
        IonButton,
        IonSkeletonText
    ],
    templateUrl: './alerts.page.html',
    styleUrls: ['./alerts.page.scss']
})
export class AlertsPage implements OnInit {
    offlineDevices: Device[] = [];
    lowBatteryDevices: Device[] = [];
    isLoading = true;
    error = '';

    constructor(private deviceService: DeviceService) {
        addIcons({
            alertCircleOutline,
            batteryDeadOutline,
            wifiOutline,
            checkmarkCircleOutline,
            chevronDownCircleOutline,
            chevronForwardOutline
        });
    }

    ngOnInit(): void {
        this.loadAlerts();
    }

    loadAlerts(): void {
        this.isLoading = true;
        this.error = '';

        this.deviceService.getAlertDevices().subscribe({
            next: (alerts: { offline: Device[]; lowBattery: Device[] }) => {
                this.offlineDevices = alerts.offline;
                this.lowBatteryDevices = alerts.lowBattery;
                this.isLoading = false;
            },
            error: () => {
                this.error = 'Failed to load system notifications.';
                this.isLoading = false;
            }
        });
    }

    doRefresh(event: any): void {
        this.deviceService.getAlertDevices().subscribe({
            next: (alerts: { offline: Device[]; lowBattery: Device[] }) => {
                this.offlineDevices = alerts.offline;
                this.lowBatteryDevices = alerts.lowBattery;
                event.target.complete();
            },
            error: () => {
                event.target.complete();
            }
        });
    }

    getDeviceIcon(type: string): string {
        const icons: Record<string, string> = {
            light: '💡', thermostat: '🌡️', sensor: '📡', controller: '🎛️',
            camera: '📷', sprinkler: '💦', plug: '🔌', fan: '🌀', doorbell: '🔔'
        };
        return icons[type] || '📱';
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
}
