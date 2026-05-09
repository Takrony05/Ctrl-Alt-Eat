# Kitchen Display System — Full Implementation Plan

The scaffold already exists with Django models, basic ViewSets, and empty React stubs. This plan fills in **all the missing logic** to deliver the complete feature set: auth flow, menu browsing, cart, order placement, chef dashboard, and real-time WebSocket notifications.

---

## User Review Required

> [!IMPORTANT]
> The `package.json` currently uses **Create React App** (`react-scripts`), but the spec requires **Vite**. I will **not** change the toolchain — I'll work within CRA since Vite is missing and the folder already uses CRA conventions. I'll add the missing `vite.config.js` / re-wire only if you explicitly ask for it.

> [!IMPORTANT]
> The frontend `package.json` uses `REACT_APP_*` env vars (CRA convention). The Vite convention is `VITE_*`. Since we're staying on CRA for now I'll keep `REACT_APP_API_URL`.

> [!WARNING]
> `channels` (Django Channels) requires `daphne` or `uvicorn` as the ASGI server. Running `python manage.py runserver` will still work for development (channels falls back gracefully), but real WebSockets need `daphne manage.py`. Instructions will be in README.

---

## Open Questions

> [!NOTE]
> None blocking — proceeding with sensible defaults. The `table_number` field is required by the model; I'll expose it in the order form with a default of `1`.

---

## Proposed Changes

### Backend — Auth & Channels

#### [MODIFY] [settings.py](file:///c:/Users/Blu-Ray/Desktop/FOE/Sem.%206/Software%20Engineering/Ctrl-Alt-Eat/backend/kitchen_display/settings.py)
- Add `channels`, `daphne` to `INSTALLED_APPS`
- Add `CHANNEL_LAYERS` (in-memory for dev)
- Add `CORS_ALLOW_ALL_ORIGINS = True` (dev) and `CORS_ALLOW_CREDENTIALS = True`
- Add `REST_FRAMEWORK` default auth: TokenAuthentication

#### [MODIFY] [asgi.py](file:///c:/Users/Blu-Ray/Desktop/FOE/Sem.%206/Software%20Engineering/Ctrl-Alt-Eat/backend/kitchen_display/asgi.py)
- Wire `URLRouter` with WebSocket path `ws/orders/`

#### [MODIFY] [requirements.txt](file:///c:/Users/Blu-Ray/Desktop/FOE/Sem.%206/Software%20Engineering/Ctrl-Alt-Eat/backend/requirements.txt)
- Add `channels`, `daphne`, `djangorestframework-simplejwt` (for token auth)

#### [MODIFY] [urls.py](file:///c:/Users/Blu-Ray/Desktop/FOE/Sem.%206/Software%20Engineering/Ctrl-Alt-Eat/backend/kitchen_display/urls.py)
- Add `auth/` include for signup/login endpoints

---

### Backend — Orders App

#### [MODIFY] [serializers.py](file:///c:/Users/Blu-Ray/Desktop/FOE/Sem.%206/Software%20Engineering/Ctrl-Alt-Eat/backend/orders/serializers.py)
- Add `SignupSerializer` (create user, detect role from email domain)
- Add `LoginSerializer` (validate credentials, return token)
- Extend `MenuItemSerializer` to group by category (utility method)
- Fix `OrderSerializer.create` to accept `items` array with add-on IDs
- Add `OrderStatusUpdateSerializer` (just `order_status` field)

#### [MODIFY] [order_views.py](file:///c:/Users/Blu-Ray/Desktop\FOE/Sem.%206/Software%20Engineering/Ctrl-Alt-Eat/backend/orders/views/order_views.py)
- `OrderViewSet`: restrict `POST /api/orders/` to authenticated customers; on create, fire WebSocket broadcast
- `MenuItemViewSet`: return items grouped by category on `GET /api/menu-items/`

#### [MODIFY] [dashboard_views.py](file:///c:/Users/Blu-Ray/Desktop/FOE/Sem.%206/Software%20Engineering/Ctrl-Alt-Eat/backend/orders/views/dashboard_views.py)
- Restrict to chef role; FIFO ordering by `created_at`

#### [MODIFY] [status_views.py](file:///c:/Users/Blu-Ray/Desktop/FOE/Sem.%206/Software%20Engineering/Ctrl-Alt-Eat/backend/orders/views/status_views.py)
- Implement `PATCH /api/orders/{id}/` → set status to `ready`; broadcast WebSocket event to customer's group

#### [NEW] consumers.py — `orders/consumers.py`
- `OrderConsumer`: on connect, join group `order_{order_id}` or `customer_{user_id}`; on receive, pass-through
- On status change → broadcast `{ type: "order_ready", order_id, customer_id }`

#### [MODIFY] [urls.py](file:///c:/Users/Blu-Ray/Desktop/FOE/Sem.%206/Software%20Engineering/Ctrl-Alt-Eat/backend/orders/urls.py)
- Add `auth/signup/` and `auth/login/` paths
- Add custom `PATCH /orders/{id}/status/` or override `partial_update` on OrderViewSet

---

### Frontend — Auth

#### [NEW] `src/context/AuthContext.jsx`
- Global context: `user`, `token`, `login()`, `logout()`, `signup()`
- Persists token to `localStorage`

#### [NEW] `src/pages/Login.jsx`
- Login + inline Sign-Up toggle
- On signup: detect role from email
- On success: redirect to `/menu` (customer) or `/chef` (chef)

---

### Frontend — Customer Flow

#### [NEW] `src/context/CartContext.jsx`
- Global cart state: `cartItems`, `addToCart()`, `removeFromCart()`, `clearCart()`
- Persists across tab navigation

#### [NEW] `src/pages/CustomerHome.jsx`
- Three tabs: Main Meal / Dessert / Drink
- Fetch `GET /api/menu-items/` on mount
- Each item card: name, description, price, add-on chips, "Add to Cart" button

#### [NEW] `src/pages/Cart.jsx`
- Lists cart items with quantities, chosen add-ons
- Shows per-item subtotals + grand total
- "Place Order" → `POST /api/orders/`
- Opens on cart icon click (via React Router or modal)

#### [MODIFY] `src/components/Navbar.jsx`
- Show cart icon with badge (item count) for customers
- Show logout button
- Conditionally render links based on role

---

### Frontend — Chef Dashboard

#### [MODIFY] `src/pages/Dashboard.jsx`
- Fetch `GET /api/dashboard/` on mount + poll every 10s (WebSocket upgrade later)
- Render order cards with timestamp, items, add-ons

#### [MODIFY] `src/components/KitchenBoard.jsx`
- Real data from props
- Each card: order ID, table, timestamp, item list with add-ons
- "Mark as Ready" button → `PATCH /api/orders/{id}/`

#### [MODIFY] `src/components/StatusButtons.jsx`
- Accept `onMarkReady` callback; show spinner while loading

---

### Frontend — WebSocket & Notifications

#### [MODIFY] `src/services/api.js`
- Add all API functions: `signup`, `login`, `getMenuItems`, `getDashboard`, `markOrderReady`, `placeOrder`
- Add auth token injection via axios interceptor

#### [NEW] `src/hooks/useOrderSocket.js`
- Custom hook: connect to `ws://localhost:8000/ws/orders/`
- On `order_ready` message → show browser notification / toast

#### [NEW] `src/components/Toast.jsx`
- Pop-up notification: "Your order is ready to be picked up! 🎉"
- Auto-dismiss after 5s

---

### Frontend — Routing & App Shell

#### [MODIFY] `src/App.jsx`
- Wrap with `AuthProvider` and `CartProvider`
- Add routes: `/login`, `/menu`, `/cart`, `/chef`, `/history`
- Protected routes: redirect to `/login` if not authenticated

---

### Misc

#### [MODIFY] `docker-compose.yml`
- Add backend + frontend services

#### [MODIFY] `README.md`
- Setup instructions, how to run backend + frontend

---

## Verification Plan

### Automated
- `python manage.py test` — backend unit tests pass
- `python manage.py migrate` — migrations apply cleanly
- `python manage.py runserver` — server starts without error

### Manual (browser)
1. Open frontend → redirected to `/login`
2. Sign up with `student@gmail.com` → Customer role
3. Sign up with `chef@ejust.edu.eg` → Chef role
4. Customer: browse menu tabs, add items with add-ons, open cart, place order
5. Chef: see new order on dashboard, click "Mark as Ready"
6. Customer: receives "Your order is ready" pop-up notification
