import { Component, inject } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs';

type UserRole = 'CLAIMANT' | 'OFFICER';

@Component({
  selector: 'app-root',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly router = inject(Router);

  selectedRole: UserRole =
    this.router.url.startsWith('/officer')
      ? 'OFFICER'
      : 'CLAIMANT';

  constructor() {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd =>
            event instanceof NavigationEnd,
        ),
      )
      .subscribe((event) => {
        this.selectedRole =
          event.urlAfterRedirects.startsWith('/officer')
            ? 'OFFICER'
            : 'CLAIMANT';
      });
  }

  switchRole(role: UserRole): void {
    this.selectedRole = role;

    if (role === 'CLAIMANT') {
      this.router.navigate(['/claimant/submit']);
      return;
    }

    this.router.navigate(['/officer/dashboard']);
  }
}