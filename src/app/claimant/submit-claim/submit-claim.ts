import {
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Claim } from '../../core/models/claim.model';
import { ClaimService } from '../../core/services/claim';

@Component({
  selector: 'app-submit-claim',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './submit-claim.html',
  styleUrl: './submit-claim.scss',
})
export class SubmitClaim {
  private readonly formBuilder = inject(FormBuilder);
  private readonly claimService = inject(ClaimService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  isSubmitting = false;
  submittedClaim: Claim | null = null;
  errorMessage = '';

  claimForm = this.formBuilder.nonNullable.group({
    claimType: ['MOTOR', Validators.required],
    claimantName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
      ],
    ],
    claimantEmail: [
      '',
      [
        Validators.required,
        Validators.email,
      ],
    ],
    incidentDate: ['', Validators.required],
    description: [
      '',
      [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(500),
      ],
    ],
    estimatedLoss: [
      0,
      [
        Validators.required,
        Validators.min(1),
      ],
    ],
  });

  submitClaim(): void {
    if (this.claimForm.invalid) {
      this.claimForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.submittedClaim = null;

    const formValue = this.claimForm.getRawValue();

    const newClaim: Omit<Claim, 'id'> = {
      referenceNumber: this.generateReferenceNumber(),
      claimType: formValue.claimType as Claim['claimType'],
      claimantName: formValue.claimantName.trim(),
      claimantEmail: formValue.claimantEmail.trim(),
      incidentDate: formValue.incidentDate,
      description: formValue.description.trim(),
      estimatedLoss: formValue.estimatedLoss,
      status: 'SUBMITTED',
      assignedOfficer: null,
      createdAt: new Date().toISOString(),
    };

    this.claimService.createClaim(newClaim).subscribe({
      next: (claim) => {
        this.submittedClaim = claim;
        this.isSubmitting = false;

        this.claimForm.reset({
          claimType: 'MOTOR',
          claimantName: '',
          claimantEmail: '',
          incidentDate: '',
          description: '',
          estimatedLoss: 0,
        });

        this.changeDetector.detectChanges();
      },
      error: (error) => {
        console.error('Claim submission failed:', error);

        this.errorMessage =
          'We could not submit your claim. Please try again.';
        this.isSubmitting = false;

        this.changeDetector.detectChanges();
      },
    });
  }

  fieldInvalid(fieldName: string): boolean {
    const field = this.claimForm.get(fieldName);

    return !!field &&
      field.invalid &&
      (field.touched || field.dirty);
  }

  private generateReferenceNumber(): string {
    const timestampPart = Date.now()
      .toString()
      .slice(-6);

    return `CLM-${timestampPart}`;
  }
}