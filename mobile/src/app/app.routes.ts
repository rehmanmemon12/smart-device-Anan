import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
    canActivate: [guestGuard]
  },
  {
    path: '',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    canActivate: [authGuard],
    children: [
      {
        path: 'devices',
        loadComponent: () => import('./pages/devices/devices.page').then(m => m.DevicesPage)
      },
      {
        path: 'alerts',
        loadComponent: () => import('./pages/alerts/alerts.page').then(m => m.AlertsPage)
      },
      {
        path: '',
        redirectTo: 'devices',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'devices/:id',
    loadComponent: () => import('./pages/device-detail/device-detail.page').then(m => m.DeviceDetailPage),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'devices'
  }
];
