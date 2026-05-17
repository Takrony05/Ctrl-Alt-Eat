# D5: Implementation Package

This document provides the required evidence for Test-Driven Prompting (TDP), failing tests, and edge case handling as specified in Phase 3 of the CSE323 guidelines.

## 1. Vertical Slice Overview
The Kitchen Display System (KDS) has been delivered as a complete vertical slice.
- **UI:** React frontend with real-time updates and Page Object Model testing.
- **Logic:** Django REST Framework API with explicit role-based access control (RBAC).
- **Database:** SQLite (development) with strict Django validators for quantities and statuses.

## 2. Test-Driven Prompting (TDP) Evidence
### Failing Test First
Before writing the business logic for the KDS, we wrote unit tests to establish a clear mathematical boundary. 
**Evidence:** The test `test_order_fifo_sorting` in `backend/orders/tests/test_models.py` was written to assert that `order1.created_at < order2.created_at`. Initially, this test failed because the `Meta` class in the `Order` model lacked the `ordering = ["priority", "created_at"]` rule.

### Edge Case Cage (Padlocks)
We implemented "padlocks" to prevent AI hallucinations and enforce constraints:
1. **Model Validators:** Added `MinValueValidator(1)` and `MaxValueValidator(100)` to the `table_number` to prevent the AI from generating impossible table assignments.
2. **Permission Classes:** Added a custom `IsChef` permission class. We wrote an integration test (`test_chef_access_only`) that intentionally attempts to access the dashboard as a customer. This blocks the AI from hallucinating open API routes.

## 3. Prompt Appendix
The following prompts illustrate our iterative TDP workflow:

**Prompt 1 (Defining the Boundary):**
> "Write a Django `TestCase` named `test_invalid_status_transition_logic`. Create an order in the 'in_progress' state, then assert that updating it to 'ready' works. Also, write a test `test_order_fifo_sorting` that proves orders are fetched oldest-first."

**Prompt 2 (First Implementation attempt - resulting in a failing test):**
> "Now implement the `Order` model to pass these tests. Keep the status choices simple."

**Prompt 3 (Iterative Correction - locking the cage):**
> "The integration test `test_chef_access_only` is failing because customers can see the dashboard (expected 403, got 200). Write a custom DRF permission class called `IsChef` that checks `request.user.role == 'chef'` and apply it to the `DashboardViewSet`."

## 4. Deliverables Links
*   **Source Code (GitHub):** *(Insert your GitHub link here)*
*   **Vertical Slice Demo Video:** *(Insert your 5-minute demo video link here)*
