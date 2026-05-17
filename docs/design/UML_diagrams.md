# UML Diagrams

## 1. System Sequence Diagram (SSD) — Happy & Failure Paths

This SSD illustrates the interaction between the Chef and the Kitchen Display System (KDS) when updating an order status, including both successful processing and an authentication failure scenario.

```mermaid
sequenceDiagram
    actor Chef
    participant Frontend as KDS Dashboard
    participant Backend as API Gateway & Auth
    participant DB as Database
    participant WS as WebSocket Layer
    actor Customer

    %% Happy Path
    rect rgb(235, 248, 235)
    Note over Chef,Customer: HAPPY PATH: Status Update Success
    Chef->>Frontend: Clicks "Mark as Ready" for Order #15
    Frontend->>Backend: PATCH /api/orders/15/ {status: "ready"}
    Backend->>Backend: Validate Token & Role (IsChef)
    Backend->>DB: Update order_status = "ready"
    DB-->>Backend: Confirm Update
    Backend->>WS: Broadcast {order_id: 15, status: "ready"}
    Backend-->>Frontend: 200 OK
    Frontend-->>Chef: UI Updates (Button changes to Delivered)
    WS-->>Customer: Toast Notification ("Order is ready!")
    end

    %% Failure Path
    rect rgb(253, 237, 237)
    Note over Chef,Backend: FAILURE PATH: Unauthorized Access (Edge Case)
    actor MaliciousUser as Customer (Attempting Chef Action)
    MaliciousUser->>Frontend: Attempts to invoke "Mark as Ready"
    Frontend->>Backend: PATCH /api/orders/15/ {status: "ready"}
    Backend->>Backend: Validate Token & Role (IsChef)
    Note right of Backend: User lacks 'chef' role
    Backend-->>Frontend: 403 Forbidden
    Frontend-->>MaliciousUser: Error Toast ("Unauthorized Action")
    end
```

## 2. Activity Diagram — Order State Machine

This diagram maps the code decision points for the order lifecycle management, demonstrating where edge cases are blocked (Padlocks).

```mermaid
flowchart TD
    Start((Start)) --> A[Chef Views Dashboard]
    A --> B{Fetch Orders}
    B -->|Success| C[Display FIFO Sorted Orders]
    B -->|Error 5xx| D[Display Server Error Message]
    
    C --> E[Chef Selects Order]
    E --> F{Current Status?}
    
    F -->|In Progress| G[Click 'Mark as Ready']
    F -->|Ready| H[Click 'Mark as Delivered']
    
    G --> I{Is User Chef?}
    I -->|Yes| J[Update Status to 'Ready']
    I -->|No| K[Return 403 Forbidden]
    
    J --> L[Broadcast WebSocket Event]
    L --> M((End))
    K --> M
    
    H --> N{Is User Chef?}
    N -->|Yes| O[Update Status to 'Delivered']
    N -->|No| K
    
    O --> P[Remove Order from Dashboard]
    P --> M
```
