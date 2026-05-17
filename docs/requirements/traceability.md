# Requirements Traceability Matrix

Legend: `GREEN / H = strong direct evidence`, `YELLOW / M = partial evidence`, `RED / L = weak/supporting evidence`.

| Heat Level | Meaning | Interpretation |
|---|---|---|
| GREEN / H | Strong coverage | Requirement is directly supported by UI, backend/data evidence, and tests or strong implementation proof. |
| YELLOW / M | Medium coverage | Requirement is implemented, but evidence is partial or would benefit from more tests. |
| RED / L | Weak coverage | Requirement has limited evidence, usually because it is UI-only or outside the core backend flow. |

| Req ID | Requirement Summary | UI Evidence | API / Backend Evidence | Data Evidence | Test Evidence | Coverage |
|---|---|---|---|---|---|---|
| FR-01 | Signup/login | `Login.jsx` | `auth_views.py`, `serializers.py` | `User`, `Token` | API and auth tests | GREEN / H |
| FR-02 | Email-domain role detection | `Login.jsx` | `SignupSerializer.create` | `User.role` | Serializer/auth tests | GREEN / H |
| FR-03 | Role-protected frontend routes | `App.jsx`, `Navbar.jsx` | Token auth | `User.role` | Partial frontend evidence | YELLOW / M |
| FR-04 | Grouped menu with add-ons | `CreateOrder.jsx` | `MenuItemViewSet` | `MenuItem`, `AddOn` | Menu API test | GREEN / H |
| FR-05 | Cart management | `Cart.jsx`, `CartContext.jsx` | - | Browser state | Cart tests | GREEN / H |
| FR-06 | Order submission | `Cart.jsx`, `CheckoutPage.jsx` | `OrderViewSet.create` | `Order`, `OrderItem` | API/serializer tests | GREEN / H |
| FR-07 | Order persistence details | Kitchen/order screens | `OrderSerializer` | `Order`, `OrderItem` | Model tests | GREEN / H |
| FR-08 | Customer order isolation | `OrderHistory.jsx` | `OrderViewSet.get_queryset` | `Order.created_by` | Integration test | GREEN / H |
| FR-09 | FIFO kitchen dashboard | `Dashboard.jsx`, `KitchenBoard.jsx` | `DashboardViewSet` | `Order.created_at` | Partial endpoint evidence | YELLOW / M |
| FR-10 | Chef status workflow | `StatusButtons.jsx` | `OrderViewSet.partial_update` | `Order.order_status` | Integration tests | GREEN / H |
| FR-11 | Ready notification | `Toast.jsx` | `OrderConsumer`, Channels | `created_by_id` event field | WebSocket test | YELLOW / M |
| FR-12 | Logout/session cleanup | `Navbar.jsx` | `LogoutView`, `MeView` | `Token` | Partial auth evidence | YELLOW / M |
| FR-13 | Demo payment selection | `PaymentOptions.jsx` | Not persisted | - | UI evidence only | RED / L |
| NFR-01 | Role-based access control | `App.jsx` protected routes | Dashboard/status permission checks | `User.role`, `Order.created_by` | Customer access restriction tests | GREEN / H |
| NFR-02 | Data integrity boundaries | Forms/API errors | Model/serializer validators | Order/menu fields | Boundary tests | GREEN / H |
| NFR-03 | Notification recovery | `OrderTrackingPage.jsx` | WebSocket + polling endpoints | `Order.order_status` | WebSocket test, component evidence | YELLOW / M |
| NFR-04 | Empty/loading/error feedback | Cart/menu/kitchen components | API error handling | - | Manual component evidence | YELLOW / M |
| NFR-05 | Busy-period readability | `Dashboard.jsx`, `KitchenBoard.jsx` | FIFO dashboard query | `Order.created_at`, `Order.order_status` | Partial endpoint evidence | YELLOW / M |

Full details are in `D2_Requirements_Report.md`.
