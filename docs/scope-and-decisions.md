# Scope and Decisions

## Goal
Build a simple claims management frontend platform for two user types: claimants and claims officers.

## Overall flow
1. Claimant submits a motor or property claim.
2. Claim appears in the claims officer dashboard.
3. Officer assigns and updates the claim.
4. Claimant can view the updated status.

## Main pages
- Submit claim
- Track claims
- Claims officer dashboard

## Priorities
- Clear workflows for both user types
- Form validation
- Loading, empty and error states
- Claim assignment and status updates
- Reusable Angular components

## Out of scope
- Real authentication
- Document uploads
- Real Kafka integration
- Email or SMS notifications
- Advanced reporting

## Technical decisions
- Angular, as required by the assessment
- JSON Server for the mock backend
- Angular services for API calls and shared data
- Separate routes for claimant and officer views
- No NgRx because the application state is small