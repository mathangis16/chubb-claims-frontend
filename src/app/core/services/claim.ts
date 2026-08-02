import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Claim, ClaimStatus } from '../models/claim.model';

// tells angular that this class is a service and can be used anywhere in the app
@Injectable({
  providedIn: 'root',
})
export class ClaimService {
  // gives the service access to Angular’s built-in HTTP tool
  private readonly http= inject(HttpClient);
  private readonly apiUrl= 'http://localhost:3000/claims';

  // retrieves all claims
  getClaims(): Observable<Claim[]> {
    return this.http.get<Claim[]>(this.apiUrl);
  }

  // submits a new claim to the backend
  createClaim(claim: Omit<Claim, 'id'>): Observable<Claim> {
    return this.http.post<Claim>(this.apiUrl, claim);
  }

  // changes part of an existing claim
  updateClaim(id: string, changes: Partial<Claim>): Observable<Claim> {
    return this.http.patch<Claim>(`${this.apiUrl}/${id}`, changes);
  }

  // assigns a claim to an officer and updates its status to UNDER_REVIEW
  assignClaim(id: string, officerName: string): Observable<Claim> {
    return this.updateClaim(id, {
      assignedOfficer: officerName,
      status: 'UNDER_REVIEW',
    });
  }

  updateClaimStatus(id: string, status: ClaimStatus): Observable<Claim> {
    return this.updateClaim(id, { status });
  }
}