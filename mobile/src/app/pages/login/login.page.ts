import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonSpinner,
    IonIcon,
    IonText,
    IonCard,
    IonCardContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
    hardwareChipOutline,
    mailOutline,
    lockClosedOutline,
    arrowForward,
    alertCircle
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        IonContent,
        IonItem,
        IonInput,
        IonButton,
        IonSpinner,
        IonIcon,
        IonText,
        IonCard,
        IonCardContent
    ],
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss']
})
export class LoginPage {
    email = '';
    password = '';
    isLoading = false;
    error = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
        addIcons({
            hardwareChipOutline,
            mailOutline,
            lockClosedOutline,
            arrowForward,
            alertCircle
        });
    }

    onSubmit(): void {
        this.isLoading = true;
        this.error = '';

        this.authService.login(this.email, this.password).subscribe({
            next: (success) => {
                if (success) {
                    this.router.navigate(['/devices']);
                } else {
                    this.error = 'Invalid email or password';
                }
                this.isLoading = false;
            },
            error: () => {
                this.error = 'Could not connect to the server. Check if API is running.';
                this.isLoading = false;
            }
        });
    }
}
