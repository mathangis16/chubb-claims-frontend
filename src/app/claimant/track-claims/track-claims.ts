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
  successMessage = '';
  lastRefreshed: Date | null = null;

  expandedClaimId: string | null = null;
  additionalInformation = '';
  submissionInProgressId: string | null = null;

  ngOnInit(): void {
    this.loadClaims();
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

        this.lastRefreshed = new Date();
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

  openInformationForm(claim: Claim): void {
    if (!claim.id) {
      return;
    }

    this.expandedClaimId = claim.id;
    this.additionalInformation = '';
    this.successMessage = '';
  }

  closeInformationForm(): void {
    this.expandedClaimId = null;
    this.additionalInformation = '';
  }

  setAdditionalInformation(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.additionalInformation = textarea.value;
  }

  submitAdditionalInformation(claim: Claim): void {
    const information = this.additionalInformation.trim();

    if (
      !claim.id ||
      information.length < 10
    ) {
      return;
    }

    this.submissionInProgressId = claim.id;
    this.errorMessage = '';

    this.claimService
      .submitAdditionalInformation(
        claim.id,
        information,
      )
      .subscribe({
        next: (updatedClaim) => {
          this.claims = this.claims.map((existingClaim) =>
            existingClaim.id === updatedClaim.id
              ? updatedClaim
              : existingClaim,
          );

          this.successMessage =
            `${claim.referenceNumber}: information submitted successfully.`;

          this.expandedClaimId = null;
          this.additionalInformation = '';
          this.submissionInProgressId = null;
          this.changeDetector.detectChanges();

          window.setTimeout(() => {
            this.successMessage = '';
            this.changeDetector.detectChanges();
          }, 3000);
        },

        error: (error) => {
          console.error(
            'Additional information submission failed:',
            error,
          );

          this.errorMessage =
            'We could not submit the additional information. Please try again.';
          this.submissionInProgressId = null;
          this.changeDetector.detectChanges();
        },
      });
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

  hasReachedReview(status: ClaimStatus): boolean {
    return [
      'UNDER_REVIEW',
      'INFO_REQUESTED',
      'APPROVED',
      'REJECTED',
    ].includes(status);
  }

  hasDecision(status: ClaimStatus): boolean {
    return status === 'APPROVED' || status === 'REJECTED';
  }

  decisionLabel(status: ClaimStatus): string {
    if (status === 'APPROVED') {
      return 'Approved';
    }

    if (status === 'REJECTED') {
      return 'Rejected';
    }

    return 'Decision';
  }
}