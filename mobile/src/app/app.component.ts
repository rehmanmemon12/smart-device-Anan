import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { PushNotificationService } from './services/push-notification.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private pushService = inject(PushNotificationService);

  constructor() {
    this.pushService.initPush().catch(err => {
      console.error('Push notification initialization failed', err);
    });
  }

  ionViewWillEnter() {

    this.pushService.initPush().catch(err => {
      console.error('Push notification initialization failed', err);
    });
    this.pushService.notification$.subscribe(notification => {
      console.log('Push notification received', notification);
    });
  }
}
