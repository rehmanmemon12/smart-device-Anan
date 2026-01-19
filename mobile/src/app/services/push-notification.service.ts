import { Injectable } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PushNotificationService {
    private notificationSubject = new BehaviorSubject<any>(null);
    notification$ = this.notificationSubject.asObservable();

    constructor() { }

    async initPush() {
        // Request permission to use push notifications
        // iOS will prompt a user and return if they granted permission or not
        // Android will return granted unless the user has blocked notifications
        console.log('Checking push permissions...');
        let permStatus = await PushNotifications.checkPermissions();
        console.log('Current permission status:', JSON.stringify(permStatus));

        if (permStatus.receive === 'prompt') {
            console.log('Requesting push permissions...');
            permStatus = await PushNotifications.requestPermissions();
            console.log('New permission status:', JSON.stringify(permStatus));
        }

        if (permStatus.receive !== 'granted') {
            console.error('User denied permissions or API error');
            throw new Error('User denied permissions!');
        }

        console.log('Registering for push notifications...');
        await PushNotifications.register();

        this.addListeners();
    }

    private addListeners() {
        PushNotifications.addListener('registration', token => {
            console.log('Push registration success, token: ' + token.value);
            // TODO: Send token to your backend
        });

        PushNotifications.addListener('registrationError', err => {
            console.error('Registration error: ', err.error);
        });

        PushNotifications.addListener('pushNotificationReceived', notification => {
            console.log('Push received: ', notification);
            this.notificationSubject.next(notification);
        });

        PushNotifications.addListener('pushNotificationActionPerformed', notification => {
            console.log('Push action performed: ', notification);
        });
    }
}
