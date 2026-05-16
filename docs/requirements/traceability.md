# Requirements Traceability Matrix

Legend: `H = strong direct evidence`, `M = partial evidence`, `L = weak/supporting evidence`.

| Req ID | Requirement Summary | UI Evidence | API / Backend Evidence | Data Evidence | Test Evidence | Coverage |
|---|---|---|---|---|---|---|
| FR-01 | Signup/login | `Login.jsx` | `auth_views.py`, `serializers.py` | `User`, `Token` | API and auth tests | H |
| FR-02 | Email-domain role detection | `Login.jsx` | `SignupSerializer.create` | `User.role` | Serializer/auth tests | H |
| FR-03 | Role-protected frontend routes | `App.jsx`, `Navbar.jsx` | Token auth | `User.role` | Partial frontend evidence | M |
| FR-04 | Grouped menu with add-ons | `CreateOrder.jsx` | `MenuItemViewSet` | `MenuItem`, `AddOn` | Menu API test | H |
| FR-05 | Cart management | `Cart.jsx`, `CartContext.jsx` | - | Browser state | Cart tests | H |
| FR-06 | Order submission | `Cart.jsx`, `CheckoutPage.jsx` | `OrderViewSet.create` | `Order`, `OrderItem` | API/serializer tests | H |
| FR-07 | Order persistence details | Kitchen/order screens | `OrderSerializer` | `Order`, `OrderItem` | Model tests | H |
| FR-08 | Customer order isolation | `OrderHistory.jsx` | `OrderViewSet.get_queryset` | `Order.created_by` | Integration test | H |
| FR-09 | FIFO kitchen dashboard | `Dashboard.jsx`, `KitchenBoard.jsx` | `DashboardViewSet` | `Order.created_at` | Partial endpoint evidence | M |
| FR-10 | Chef status workflow | `StatusButtons.jsx` | `OrderViewSet.partial_update` | `Order.order_status` | Integration tests | H |
| FR-11 | Ready notification | `Toast.jsx` | `OrderConsumer`, Channels | `created_by_id` event field | WebSocket test | M |
| FR-12 | Boundary validation | Forms/API errors | Model/serializer validators | Order/menu fields | Boundary tests | H |
| FR-13 | Empty states | Cart/menu/kitchen components | - | - | Manual component evidence | M |
| FR-14 | Logout/session cleanup | `Navbar.jsx` | `LogoutView`, `MeView` | `Token` | Partial auth evidence | M |
| FR-15 | Demo payment selection | `PaymentOptions.jsx` | Not persisted | - | UI evidence only | L |

Full details are in `D2_Requirements_Report.md`.
