import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import {
  Claim,
  ClaimStatus,
} from '../../core/models/claim.model';
import { ClaimService } from '../../core/services/claim';

type StatusFilter = 'ALL' | ClaimStatus;

@Component({
  selector: 'app-officer-dashboard',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './officer-dashboard.html',
  styleUrl: './officer-dashboard.scss',
})
export class OfficerDashboard implements OnInit {
  private readonly claimService = inject(ClaimService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  claims: Claim[] = [];
  selectedStatus: StatusFilter = 'ALL';
  isLoading = true;
  errorMessage = '';
  actionInProgressId: string | null = null;

  ngOnInit(): void {
    this.loadClaims();
  }

  get filteredClaims(): Claim[] {
    if (this.selectedStatus === 'ALL') {
      return this.claims;
    }

    return this.claims.filter(
      (claim) => claim.status === this.selectedStatus,
    );
  }

  get unassignedCount(): number {
    return this.claims.filter(
      (claim) => !claim.assignedOfficer,
    ).length;
  }

  get underReviewCount(): number {
    return this.claims.filter(
      (claim) => claim.status === 'UNDER_REVIEW',
    ).length;
  }

  get informationRequestedCount(): number {
    return this.claims.filter(
      (claim) => claim.status === 'INFO_REQUESTED',
    ).length;
  }

  get outstandingExposure(): number {
    return this.claims
      .filter((claim) => claim.status !== 'REJECTED')
      .reduce(
        (total, claim) => total + claim.estimatedLoss,
        0,
      );
  }

  loadClaims(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.claimService.getClaims().subscribe({
      next: (claims) => {
        this.claims = [...claims].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
        );

        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        console.error('Unable to load officer claims:', error);

        this.errorMessage =
          'Claims could not be loaded. Please try again.';
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
    });
  }

  setFilter(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedStatus = select.value as StatusFilter;
  }

  assignToMe(claim: Claim): void {
    if (!claim.id) {
      return;
    }

    this.runClaimAction(
      claim.id,
      this.claimService.assignClaim(
        claim.id,
        'Alex Wong',
      ),
    );
  }

  changeStatus(
    claim: Claim,
    status: ClaimStatus,
  ): void {
    if (!claim.id) {
      return;
    }

    this.runClaimAction(
      claim.id,
      this.claimService.updateClaimStatus(
        claim.id,
        status,
      ),
    );
  }

  formatStatus(status: ClaimStatus): string {
    return status
      .toLowerCase()
      .split('_')
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1),
      )
      .join(' ');
  }

  statusClass(status: ClaimStatus): string {
    return `status-${status
      .toLowerCase()
      .replaceAll('_', '-')}`;
  }

  private runClaimAction(
    claimId: string,
    request: ReturnType<ClaimService['updateClaim']>,
  ): void {
    this.actionInProgressId = claimId;
    this.errorMessage = '';

    request.subscribe({
      next: (updatedClaim) => {
        this.claims = this.claims.map((claim) =>
          claim.id === updatedClaim.id
            ? updatedClaim
            : claim,
        );

        this.actionInProgressId = null;
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        console.error('Claim update failed:', error);

        this.errorMessage =
          'The claim could not be updated. Please try again.';
        this.actionInProgressId = null;
        this.changeDetector.detectChanges();
      },
    });
  }
}