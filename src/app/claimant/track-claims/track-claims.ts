import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { Claim, ClaimStatus } from '../../core/models/claim.model';
import { ClaimService } from '../../core/services/claim';

@Component({
  selector: 'app-track-claims',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './track-claims.html',
  styleUrl: './track-claims.scss',
})
export class TrackClaims implements OnInit {
  private readonly claimService = inject(ClaimService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  claims: Claim[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadClaims();
  }

  loadClaims(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.claimService.getClaims().subscribe({
      next: (claims) => {
        this.claims = claims.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
        );
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        console.error('Claims request failed:', error);
        this.errorMessage =
          'We could not load your claims. Please try again.';
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
    });
  }

  formatStatus(status: ClaimStatus): string {
    return status
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  statusClass(status: ClaimStatus): string {
    return `status-${status.toLowerCase().replace('_', '-')}`;
  }
}