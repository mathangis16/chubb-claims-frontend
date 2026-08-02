import { Routes } from '@angular/router';
import { SubmitClaim } from './claimant/submit-claim/submit-claim';
import { TrackClaims } from './claimant/track-claims/track-claims';
import { OfficerDashboard } from './officer/officer-dashboard/officer-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'claimant/submit', pathMatch: 'full' },
  { path: 'claimant/submit', component: SubmitClaim },
  { path: 'claimant/claims', component: TrackClaims },
  { path: 'officer/dashboard', component: OfficerDashboard },
  { path: '**', redirectTo: 'claimant/submit' }
];

// note: the first empty path is the default route, which redirects to the claimant submit page
// the last path is a wildcard route that catches any undefined routes and redirects to the claimant submit page as well