import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'devices',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
        canActivate: [guestGuard]
    },
    {
        path: 'devices',
        loadComponent: () => import('./pages/devices/devices.component').then(m => m.DevicesComponent),
        canActivate: [authGuard]
    },
    {
        path: 'devices/:id',
        loadComponent: () => import('./pages/device-detail/device-detail.component').then(m => m.DeviceDetailComponent),
        canActivate: [authGuard]
    },
    {
        path: 'alerts',
        loadComponent: () => import('./pages/alerts/alerts.component').then(m => m.AlertsComponent),
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: 'devices'
    }
];
