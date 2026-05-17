# Senior QA Audit Log

**Objective:** Eliminate unquantifiable adjectives from the Kitchen Display System (KDS) requirements and replace them with measurable technical metrics, as per the Phase 2 rubric for QA refinement.

| Original Requirement (Vague) | Unquantifiable Adjective | Refined Requirement (Measurable Metric) | Implementation Strategy |
| :--- | :--- | :--- | :--- |
| "The kitchen dashboard should load **fast**." | **fast** | The kitchen dashboard must render within **500ms** under normal load and handle polling efficiently. | Implemented a React frontend optimized for fast DOM updates, with database queries utilizing `select_related` and `prefetch_related` in Django to prevent N+1 issues. |
| "The communication between chef and customer should be **real-time**." | **real-time** | Order status updates must broadcast to the customer via WebSockets with a latency of **≤ 200ms**. | Configured Django Channels with an ASGI server and an `InMemoryChannelLayer` (or Redis in production) to push state changes immediately. |
| "The system must be **secure**." | **secure** | The system must block unauthorized access by returning a **403 Forbidden** HTTP status to users without the `chef` or `admin` role. | Enforced via a custom `IsChef` permission class applied to the `DashboardViewSet` in Django REST Framework. |
| "The UI should be **reliable** when errors occur." | **reliable** | The frontend must display a toast notification with a specific error message within **1 second** if an API call returns a **5xx** status code. | Automated via Playwright E2E tests (KDS-05 scenario) which intercepts and mocks a 500 server error to verify the UI reaction. |
| "The chef dashboard should be **easy to read**." | **easy to read** | The dashboard cards must prominently display the table number using a font size of at least **1.5rem** and use distinct color badges (e.g., yellow for `in_progress`, green for `ready`). | Implemented using Tailwind CSS utility classes ensuring high contrast and immediate visual recognition in a fast-paced environment. |

*Audited by: KDS QA Lead*
