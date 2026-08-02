# AI Working Journal

## 1. Choosing the assessment
**Asked:** Which assessment brief best fits my experience?

**AI suggested:** Full stack initially to demonstrate broader engineering ability, then frontend after considering my background.

**Decision:** Chose frontend.

**Why:** I already know React and TypeScript, so Angular is more manageable than learning Angular and Spring Boot together.

---

## 2. Defining the scope
**Asked:** What should I build within the time limit?

**AI suggested:** Claim submission, tracking and an officer dashboard.

**Decision:** Focus on one complete claim journey.

**Why:** It covers both user types without making the project too large.

---

## 3. State management
**Asked:** How should shared data be handled?

**AI suggested:** Angular services, signals or NgRx.

**Decision:** Use Angular services and simple component state.

**Why:** NgRx would be unnecessary for a small application.

---

## 4. Project structure
**Asked:** How should the Angular project be organised?

**AI suggested:** Separate claimant and officer features while keeping shared models and API logic in a core folder.

**Decision:** Created claimant, officer and core folders.

**Why:** This keeps the two user experiences separate while avoiding duplicated code.

---

## 5. Mock backend
**Asked:** How should claims be stored without building a real backend?

**AI suggested:** Use JSON Server and access it through an Angular service.

**Decision:** Used `db.json` with `ClaimService` and Angular `HttpClient`.

**Why:** This provides simple persistence while keeping the frontend structured like it would be with a real API.

---

## 6. Supporting two user types
**Asked:** How can one Angular app support claimant and officer views?

**AI suggested:** Use separate routes and a role switch.

**Decision:** Added claimant and officer routes with route-aware navigation.

**Why:** This demonstrates both workflows without implementing full authentication.

---

## 7. Claim tracking
**Asked:** How can claimants understand their current claim status?

**AI suggested:** Add a visual timeline.

**Decision:** Added Submitted, Under Review and Decision stages with status-specific messages.

**Why:** The timeline gives more context than a status badge alone.

---

## 8. Officer workload management
**Asked:** What would help an officer manage several claims?

**AI suggested:** Add summary metrics, search, filters, sorting and exposure indicators.

**Decision:** Added workload cards, search, status filtering, sorting and a high-exposure label.

**Why:** These features help officers identify and prioritise work.

---

## 9. Additional information workflow
**Asked:** How should the app handle an officer requesting more information?

**AI suggested:** Let the claimant submit a response and return the claim to Under Review.

**Decision:** Added a claimant response form and an officer view for submitted information.

**Why:** This completes the workflow across both user types.

---

## 10. UI and UX improvements
**Asked:** How could the interface look more professional?

**AI suggested:** Use consistent colours, typography, spacing, status badges and feedback states.

**Decision:** Applied a black header, restrained brand-inspired accents, responsive layouts and clear loading, error and success states.

**Why:** This created a more polished and consistent experience.

---

## 11. Testing and debugging
**Issue:** Some generated tests failed because the wrong type was imported and router dependencies were missing.

**AI suggested:** Inject `ClaimService` instead of the `Claim` interface and provide the Angular router in the app test.

**Decision:** Updated the test files and reran the full test suite.

**Result:** Five test files and six tests passed.

---

## 12. Production build
**Issue:** The build failed because component SCSS exceeded Angular’s default style budget.

**AI suggested:** Increase the component style budget instead of removing useful styling.

**Decision:** Updated the `anyComponentStyle` budget in `angular.json`.

**Result:** The production build completed successfully.

---

## Final reflection

AI helped with planning, Angular syntax, debugging, styling and documentation.

The suggestions were reviewed, tested and adjusted before being included. The final application focuses on a complete claim journey instead of adding too many unrelated features.