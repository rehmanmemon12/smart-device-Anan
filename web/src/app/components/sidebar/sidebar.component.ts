import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    isCollapsed = true;
    isMobileOpen = false;
    @Output() collapsedChange = new EventEmitter<boolean>();
    @Output() mobileOpenChange = new EventEmitter<boolean>();

    constructor(private authService: AuthService, private router: Router) { }

    toggleSidebar(): void {
        this.isCollapsed = !this.isCollapsed;
        this.collapsedChange.emit(this.isCollapsed);
    }

    toggleMobile(): void {
        this.isMobileOpen = !this.isMobileOpen;
        this.mobileOpenChange.emit(this.isMobileOpen);
    }

    closeMobile(): void {
        this.isMobileOpen = false;
        this.mobileOpenChange.emit(false);
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    getCurrentUser() {
        return this.authService.getCurrentUser();
    }
}
