import { Injectable } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { BehaviorSubject, from } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private currentMessage = new BehaviorSubject<any>(null);
    currentMessage$ = this.currentMessage.asObservable();

    constructor(private messaging: Messaging) { }

    requestPermission() {
        return from(
            navigator.serviceWorker.register('firebase-messaging-sw.js')
                .then((registration) => {
                    console.log('Service Worker registered with scope:', registration.scope);
                    // Wait until the service worker is active
                    return navigator.serviceWorker.ready.then(() => registration);
                })
                .then((registration) => {
                    return Notification.requestPermission().then(permission => ({ permission, registration }));
                })
                .then(({ permission, registration }) => {
                    if (permission === 'granted') {
                        return getToken(this.messaging, {
                            vapidKey: 'BHIPYI7vyW3TelbQ8fud_YIMamzh2w90HyNdtdE6ym-19xkqFD6hOqU3Qc1jf9xHUBkHI4GlGUzlDAXoh9EeH_s',
                            serviceWorkerRegistration: registration
                        });
                    } else {
                        throw new Error('Notification permission denied');
                    }
                })
        );
    }

    listenForMessages() {
        onMessage(this.messaging, (payload) => {
            console.log('Message received. ', payload);
            this.currentMessage.next(payload);
        });
    }
}
