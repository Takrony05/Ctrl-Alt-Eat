# Traceability Matrix

| Requirement | Implementation | Tests |
|-------------|----------------|-------|
| User Auth   | [serializers.py](file:///d:/uni/project%20sotfware/Ctrl-Alt-Eat/backend/orders/serializers.py) | [test_serializers.py](file:///d:/uni/project%20sotfware/Ctrl-Alt-Eat/tests/unit/backend/test_serializers.py) |
| Role detection | [serializers.py](file:///d:/uni/project%20sotfware/Ctrl-Alt-Eat/backend/orders/serializers.py) | [Auth.test.jsx](file:///d:/uni/project%20sotfware/Ctrl-Alt-Eat/frontend/src/__tests__/Auth.test.jsx) |
| Order Creation | [order_views.py](file:///d:/uni/project%20sotfware/Ctrl-Alt-Eat/backend/orders/views/order_views.py) | [test_api_views.py](file:///d:/uni/project%20sotfware/Ctrl-Alt-Eat/tests/integration/backend/test_api_views.py) |
| Cart Logic | [CartContext.jsx](file:///d:/uni/project%20sotfware/Ctrl-Alt-Eat/frontend/src/context/CartContext.jsx) | [Cart.test.jsx](file:///d:/uni/project%20sotfware/Ctrl-Alt-Eat/frontend/src/__tests__/Cart.test.jsx) |
| Status Update | [status_views.py](file:///d:/uni/project%20sotfware/Ctrl-Alt-Eat/backend/orders/views/status_views.py) | [test_websockets.py](file:///d:/uni/project%20sotfware/Ctrl-Alt-Eat/tests/integration/backend/test_websockets.py) |
| Full Flow | Entire System | [test_order_flow.py](file:///d:/uni/project%20sotfware/Ctrl-Alt-Eat/tests/e2e/test_order_flow.py) |
