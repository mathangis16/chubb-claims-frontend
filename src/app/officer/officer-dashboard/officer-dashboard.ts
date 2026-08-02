import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

import {
  Claim,
  ClaimStatus,
} from '../../core/models/claim.model';
import { ClaimService } from '../../core/services/claim';

type StatusFilter = 'ALL' | ClaimStatus;
type SortOption = 'NEWEST' | 'OLDEST' | 'HIGHEST_LOSS';

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
  selectedSort: SortOption = 'NEWEST';
  searchTerm = '';

  isLoading = true;
  errorMessage = '';
  successMessage = '';
  actionInProgressId: string | null = null;

  ngOnInit(): void {
    this.loadClaims();
  }

  get filteredClaims(): Claim[] {
    const search = this.searchTerm.trim().toLowerCase();

    const filteredClaims = this.claims.filter((claim) => {
      const matchesStatus =
        this.selectedStatus === 'ALL' ||
        claim.status === this.selectedStatus;

      const matchesSearch =
        !search ||
        claim.referenceNumber.toLowerCase().includes(search) ||
        claim.claimantName.toLowerCase().includes(search) ||
        claim.claimantEmail.toLowerCase().includes(search);

      return matchesStatus && matchesSearch;
    });

    return [...filteredClaims].sort((a, b) => {
      if (this.selectedSort === 'HIGHEST_LOSS') {
        return b.estimatedLoss - a.estimatedLoss;
      }

      const firstDate = new Date(a.createdAt).getTime();
      const secondDate = new Date(b.createdAt).getTime();

      if (this.selectedSort === 'OLDEST') {
        return firstDate - secondDate;
      }

      return secondDate - firstDate;
    });
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
    const openStatuses: ClaimStatus[] = [
      'SUBMITTED',
      'UNDER_REVIEW',
      'INFO_REQUESTED',
    ];

    return this.claims
      .filter((claim) => openStatuses.includes(claim.status))
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
        this.claims = claims;
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

  setStatusFilter(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedStatus = select.value as StatusFilter;
  }

  setSort(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedSort = select.value as SortOption;
  }

  setSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'ALL';
    this.selectedSort = 'NEWEST';
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
      `${claim.referenceNumber} assigned successfully.`,
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
      `${claim.referenceNumber} updated to ${this.formatStatus(status)}.`,
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

  isHighExposure(claim: Claim): boolean {
    return (
      claim.estimatedLoss >= 10000 &&
      claim.status !== 'APPROVED' &&
      claim.status !== 'REJECTED'
    );
  }

  private runClaimAction(
    claimId: string,
    request: Observable<Claim>,
    successMessage: string,
  ): void {
    this.actionInProgressId = claimId;
    this.errorMessage = '';
    this.successMessage = '';

    request.subscribe({
      next: (updatedClaim) => {
        this.claims = this.claims.map((claim) =>
          claim.id === updatedClaim.id
            ? updatedClaim
            : claim,
        );

        this.actionInProgressId = null;
        this.showSuccessMessage(successMessage);
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

  private showSuccessMessage(message: string): void {
    this.successMessage = message;

    window.setTimeout(() => {
      this.successMessage = '';
      this.changeDetector.detectChanges();
    }, 3000);
  }
}