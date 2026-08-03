# Chubb Claims Portal
A frontend prototype supporting two user journeys:
- Claimants can submit claims, track progress and provide additional information when requested.
- Claims officers can review claims, manage assignments, request information and record claim decisions.

The application was built as an Angular frontend with a mock REST backend to demonstrate the main claims workflow within the assessment time limit.

## Features

### Claimant experience
- Submit motor or property claims
- Form validation and submission feedback
- Track claim status and assigned officer
- View a visual claim progress timeline
- Respond when additional information is requested
- View loading, error and empty states

### Claims officer experience
- View workload summary metrics
- View outstanding open-claim exposure
- Search by reference number, claimant name or email
- Filter claims by status
- Sort by date or estimated loss
- Assign unassigned claims
- Request additional information
- Approve or reject claims with confirmation
- View additional information submitted by claimants
- Identify high-exposure open claims

## Technology
- Angular 22
- TypeScript
- SCSS
- Angular Reactive Forms
- Angular HttpClient
- RxJS
- JSON Server
- Vitest through Angular's testing setup

## Running the application

### Prerequisites
- Node.js 22 or later
- npm

### Install dependencies
```bash
npm install
```

### Start the mock backend
Run this command in the first terminal:
```bash
npx json-server --watch db.json --port 3000
```

The mock API will be available at:
http://localhost:3000/claims

The mock backend reads and updates claim data stored in:
```text
db.json
```

Keep this terminal running while using the application.

### Start the Angular application
Open a second terminal in the same project folder and run:
```bash
npm start
```

The frontend will be available at:
http://localhost:4200

Both terminals must remain running:
- JSON Server runs the mock claims API on port `3000`.
- Angular runs the frontend application on port `4200`.

## Running tests
Run the full test suite once with:
```bash
npm test -- --watch=false
```

At the time of completion, the project has five passing test files and six passing tests covering:
- application creation and portal title rendering,
- claim service creation,
- claimant submission component creation,
- claimant tracking component creation,
- officer dashboard component creation.

## Production build
Create an optimised production build with:
```bash
npm run build
```

The compiled application will be generated in:
dist/claims-portal

## Application structure
```text
src/app/
├── claimant/
│   ├── submit-claim/
│   └── track-claims/
├── officer/
│   └── officer-dashboard/
├── core/
│   ├── models/
│   └── services/
├── app.routes.ts
├── app.ts
├── app.html
└── app.scss
```

### Shared core layer
The `Claim` interface and `ClaimStatus` type define the shared claims data model.

`ClaimService` provides the API boundary between the Angular components and the mock REST backend. Components do not directly read from or write to `db.json`.

### Feature separation
Claimant and claims-officer workflows use separate routes and components while sharing the same claim model and service.

A route-synchronised role switch is included to demonstrate both user experiences without implementing authentication.

In a production system, the user role would come from authenticated identity information, and route guards would restrict access.

## Data and state flow
1. Components request or update claims through `ClaimService`.
2. `ClaimService` sends HTTP requests to JSON Server.
3. JSON Server reads from or writes to `db.json`.
4. Components update their local state after receiving the response.
5. Loading, success and error states provide feedback during asynchronous operations.

## Asynchronous processing approach
The prototype uses REST requests and refresh controls to show claim updates over time.

In production, backend services could use Kafka for claim events, while the frontend receives updates through an API using polling, Server-Sent Events or WebSockets.

## Scope decisions

### Implemented
- Claim submission
- Claim tracking
- Visual progress timeline
- Claim assignment
- Claim status updates
- Additional-information request and response workflow
- Officer search, filtering and sorting
- Workload summary metrics
- Outstanding exposure calculation
- Loading, empty, error and success states
- Responsive styling
- Basic automated tests
- Mock REST persistence

### Not implemented
- Authentication and authorisation
- Claimant-specific account filtering
- Document or image uploads
- Real backend services
- Direct Kafka integration
- Full claim audit history
- Production deployment

These items were left outside the prototype so that development could focus on a coherent end-to-end claims workflow within the assessment time limit.

## Accessibility and UX

The application includes:
- semantic form labels,
- visible keyboard focus states,
- status text in addition to colour,
- disabled controls during active requests,
- confirmation before final claim decisions,
- responsive layouts,
- loading, empty and error feedback.

## AI-assisted development

AI was used to support planning, Angular syntax, debugging, styling and documentation.

Suggestions were reviewed, tested and adapted before being included in the project.

The detailed development record is available in:
```text
docs/ai-working-journal.md
```
