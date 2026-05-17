# Hidden Requirements and Edge Cases

The persona analysis in the D2 report identifies the following edge cases:

| ID | Edge Case | Current Handling |
|---|---|---|
| EC-01 | Customer attempts unauthorized status update | Backend restricts status updates to chef/admin/staff users. |
| EC-02 | Customer opens kitchen dashboard API | Backend returns 403 for non-kitchen staff. |
| EC-03 | Lost WebSocket connection | Frontend reconnects and order tracking also polls status. |
| EC-04 | Ready notification sent while many customers are connected | Frontend filters by `customer_id` before showing the toast. |
| EC-05 | Simultaneous kitchen status changes | Backend allows only valid status transitions. |
| EC-06 | Duplicate order submission | Submit button is disabled while the request is in progress. |
| EC-07 | Invalid table number or quantity | Django validators and serializer tests reject boundary violations. |
| EC-08 | Empty queue, cart, or category | UI shows empty states instead of blank screens. |
| EC-09 | Kitchen overload | FIFO dashboard ordering, order counts, and wait-time display help chefs prioritize. |
| EC-10 | Weak role proof through email domain | Documented limitation; production would need verified staff identity. |

Full persona reasoning is in `D2_Requirements_Report.md`.
