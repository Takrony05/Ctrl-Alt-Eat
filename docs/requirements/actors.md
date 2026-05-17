# Actor Classification

This file summarizes the actor classification used in the D2 Requirements Report.

| Actor Type | Actors | Rationale |
|---|---|---|
| Primary | Customer, Chef / Kitchen Staff | They directly use the system to place orders and prepare/update kitchen tickets. |
| Supporting | Authentication Service, Database, WebSocket Channel Layer, React Frontend | They provide services needed by the primary actors but do not own the business goal. |
| Offstage | Restaurant Manager/Admin, Cashier/Payment Role, IT Maintainer, Course Evaluator | They care about operation, review, or future extension but are not central runtime users of the KDS flow. |

Full details are in `D2_Requirements_Report.md`.
