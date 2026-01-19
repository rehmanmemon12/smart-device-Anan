import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    email = '';
    password = '';
    isLoading = false;
    error = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    onSubmit(): void {
        if (!this.email || !this.password) {
            this.error = 'Please enter email and password';
            return;
        }

        this.isLoading = true;
        this.error = '';

        this.authService.login(this.email, this.password).subscribe({
            next: (success) => {
                if (success) {
                    this.router.navigate(['/devices']);
                }
            },
            error: (err) => {
                this.error = 'Login failed. Please try again.';
                this.isLoading = false;
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }
}
