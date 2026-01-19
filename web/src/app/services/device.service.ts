import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, delay, map } from 'rxjs';
import { Device, DeviceControlPayload } from '../models/device.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DeviceService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getDevices(): Observable<Device[]> {
        return this.http.get<Device[]>(`${this.apiUrl}/devices`);
    }

    getDevice(id: string): Observable<Device | null> {
        return this.http.get<Device>(`${this.apiUrl}/devices/${id}`).pipe(
            catchError(() => of(null))
        );
    }

    updateDevice(id: string, payload: DeviceControlPayload): Observable<Device> {
        return this.http.patch<Device>(`${this.apiUrl}/devices/${id}`, payload);
    }

    searchDevices(query: string): Observable<Device[]> {
        return this.http.get<Device[]>(`${this.apiUrl}/devices`).pipe(
            map(devices =>
                devices.filter(d =>
                    d.name.toLowerCase().includes(query.toLowerCase()) ||
                    d.location.toLowerCase().includes(query.toLowerCase())
                )
            )
        );
    }

    getAlertDevices(): Observable<{ offline: Device[]; lowBattery: Device[] }> {
        return this.getDevices().pipe(
            map(devices => {
                const now = new Date();
                const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

                const offline = devices.filter(d => {
                    const lastUpdate = new Date(d.lastUpdated);
                    return !d.isOnline || lastUpdate < fifteenMinutesAgo;
                });

                const lowBattery = devices.filter(d => d.batteryPercentage < 20);

                return { offline, lowBattery };
            })
        );
    }
}
