import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/device.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'auth_user';

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
    isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    constructor() { }

    private hasToken(): boolean {
        if (typeof localStorage === 'undefined') return false;
        return !!localStorage.getItem(this.TOKEN_KEY);
    }

    login(email: string, password: string): Observable<boolean> {
        return new Observable(observer => {
            setTimeout(() => {
                const mockToken = 'mock-jwt-token-' + Date.now();
                const mockUser: User = {
                    id: '1',
                    email: email,
                    name: email.split('@')[0]
                };

                localStorage.setItem(this.TOKEN_KEY, mockToken);
                localStorage.setItem(this.USER_KEY, JSON.stringify(mockUser));
                this.isAuthenticatedSubject.next(true);

                observer.next(true);
                observer.complete();
            }, 500);
        });
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.isAuthenticatedSubject.next(false);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem(this.USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    }

    isAuthenticated(): boolean {
        return this.hasToken();
    }
}
