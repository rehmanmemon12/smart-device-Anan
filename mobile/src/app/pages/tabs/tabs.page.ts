import { Component } from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { listOutline, alertCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <div class="tabs-container">
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="devices">
            <ion-icon name="list-outline"></ion-icon>
            <ion-label>Dashboard</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="alerts">
            <ion-icon name="alert-circle-outline"></ion-icon>
            <ion-label>Alerts</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </div>
    </ion-tabs>
  `,
  styles: [`
    .tabs-container {
      position: absolute;
      bottom: 16px;
      left: 16px;
      right: 16px;
      z-index: 1000;
    }
    ion-tab-bar {
      --background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      height: 64px;
      border-radius: 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
      margin: 0;
      padding: 0 8px;
      contain: none;
    }
    ion-tab-button {
      --color: #94a3b8;
      --color-selected: var(--ion-color-primary);
      --ripple-color: transparent;
      background: transparent;
      transition: all 0.3s ease;
      
      ion-icon {
        font-size: 24px;
        transition: transform 0.3s ease;
      }
      
      &.tab-selected {
        ion-icon {
          transform: translateY(-2px);
          filter: drop-shadow(0 4px 8px rgba(var(--ion-color-primary-rgb), 0.3));
        }
      }
      
      ion-label {
        font-size: 10px;
        font-weight: 700;
        margin-top: 4px;
        letter-spacing: 0.3px;
        text-transform: uppercase;
      }
    }
  `]
})
export class TabsPage {
  constructor() {
    addIcons({ listOutline, alertCircleOutline });
  }
}
