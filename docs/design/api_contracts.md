# API Contracts

## Base URL: `/api/`

### 1. Authentication
*Standard Django/DRF authentication applies.*

### 2. Orders
#### GET `/orders/`
- **Description**: Returns a list of all orders.
- **Response**: `200 OK` with a list of order objects.

#### POST `/orders/`
- **Description**: Creates a new order.
- **Payload**:
  ```json
  {
    "table_number": 5,
    "priority": 1,
    "items": [
      {"menu_item": 1, "quantity": 2, "notes": "No onions"}
    ]
  }
  ```
- **Response**: `201 Created`.

#### PATCH `/orders/{id}/`
- **Description**: Updates order status.
- **Payload**: `{"order_status": "ready"}`
- **Response**: `200 OK`.

### 3. Menu Items
#### GET `/menu-items/`
- **Description**: Returns all available menu items.
- **Response**: `200 OK`.
