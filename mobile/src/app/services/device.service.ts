import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map, delay, timeout } from 'rxjs';
import { Device, DeviceControlPayload } from '../models/device.model';
import { environment } from '../../environments/environment';

const MOCK_DEVICES: Device[] = [
    {
        id: '1',
        name: 'Living Room Light',
        type: 'light',
        isOnline: true,
        isOn: true,
        batteryPercentage: 85,
        brightness: 75,
        location: 'Living Room',
        lastUpdated: new Date().toISOString()
    },
    {
        id: '2',
        name: 'Master Thermostat',
        type: 'thermostat',
        isOnline: true,
        isOn: true,
        batteryPercentage: 100,
        brightness: 22,
        location: 'Bedroom',
        lastUpdated: new Date().toISOString()
    },
    {
        id: '3',
        name: 'Kitchen Camera',
        type: 'camera',
        isOnline: false,
        isOn: false,
        batteryPercentage: 15,
        brightness: 0,
        location: 'Kitchen',
        lastUpdated: new Date(Date.now() - 30 * 60000).toISOString()
    },
    {
        id: '4',
        name: 'Front Doorbell',
        type: 'doorbell',
        isOnline: true,
        isOn: true,
        batteryPercentage: 45,
        brightness: 100,
        location: 'Entrance',
        lastUpdated: new Date().toISOString()
    },
    {
        id: '5',
        name: 'Patio Sprinkler',
        type: 'sprinkler',
        isOnline: true,
        isOn: false,
        batteryPercentage: 90,
        brightness: 0,
        location: 'Outdoor',
        lastUpdated: new Date().toISOString()
    },
    {
        id: '6',
        name: 'Office Fan',
        type: 'fan',
        isOnline: true,
        isOn: true,
        batteryPercentage: 60,
        brightness: 50,
        location: 'Office',
        lastUpdated: new Date().toISOString()
    },
    {
        id: '7',
        name: 'Garage Plug',
        type: 'plug',
        isOnline: true,
        isOn: false,
        batteryPercentage: 100,
        brightness: 0,
        location: 'Garage',
        lastUpdated: new Date().toISOString()
    },
    {
        id: '8',
        name: 'Hallway Sensor',
        type: 'sensor',
        isOnline: false,
        isOn: false,
        batteryPercentage: 5,
        brightness: 0,
        location: 'Hallway',
        lastUpdated: new Date(Date.now() - 2 * 60 * 60000).toISOString()
    }
];

@Injectable({
    providedIn: 'root'
})
export class DeviceService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getDevices(): Observable<Device[]> {
        return this.http.get<Device[]>(`${this.apiUrl}/devices`).pipe(
            timeout(3000),
            catchError(() => {
                console.warn('API Unreachable, falling back to mock data');
                return of(MOCK_DEVICES).pipe(delay(200));
            })
        );
    }

    getDevice(id: string): Observable<Device | null> {
        return this.http.get<Device>(`${this.apiUrl}/devices/${id}`).pipe(
            timeout(3000),
            catchError(() => {
                const device = MOCK_DEVICES.find(d => d.id === id) || null;
                return of(device).pipe(delay(200));
            })
        );
    }

    updateDevice(id: string, payload: DeviceControlPayload): Observable<Device> {
        return this.http.patch<Device>(`${this.apiUrl}/devices/${id}`, payload).pipe(
            timeout(3000),
            catchError(() => {
                // Mock update for offline mode
                const device = MOCK_DEVICES.find(d => d.id === id);
                if (device) {
                    const updated = { ...device, ...payload };
                    // Update the local mock array to persist changes during session
                    const index = MOCK_DEVICES.findIndex(d => d.id === id);
                    MOCK_DEVICES[index] = updated;
                    return of(updated).pipe(delay(200));
                }
                throw new Error('Device not found');
            })
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

                const lowBattery = devices.filter(d => d.batteryPercentage <= 20);

                return { offline, lowBattery };
            })
        );
    }
}
