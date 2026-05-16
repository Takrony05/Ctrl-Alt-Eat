import pytest
from rest_framework.test import APIClient
from orders.models import User, MenuItem, Order

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def customer_user(db):
    return User.objects.create_user(username="customer", email="customer@gmail.com", password="password123", role=User.Role.CUSTOMER)

@pytest.fixture
def chef_user(db):
    return User.objects.create_user(username="chef", email="chef@ejust.edu.eg", password="password123", role=User.Role.CHEF)

@pytest.mark.django_db
class TestAPIViews:
    def test_signup_api(self, api_client):
        response = api_client.post("/api/auth/signup/", {
            "username": "newuser",
            "email": "new@gmail.com",
            "password": "password123",
            "name": "New User"
        })
        assert response.status_code == 201
        assert User.objects.filter(username="newuser").exists()

    def test_login_api(self, api_client, customer_user):
        response = api_client.post("/api/auth/login/", {
            "username": "customer",
            "password": "password123"
        })
        assert response.status_code == 200
        assert "token" in response.data

    def test_menu_items_api(self, api_client):
        MenuItem.objects.create(name="Burger", category="Main Meal", price=10.00)
        response = api_client.get("/api/menu-items/")
        assert response.status_code == 200
        assert "Main Meal" in response.data

    def test_create_order_authenticated(self, api_client, customer_user):
        item = MenuItem.objects.create(name="Burger", category="Main Meal", price=10.00)
        api_client.force_authenticate(user=customer_user)
        response = api_client.post("/api/orders/", {
            "table_number": 5,
            "items": [{"menu_item": item.id, "quantity": 1}]
        }, format='json')
        assert response.status_code == 201
        assert Order.objects.count() == 1

    def test_chef_can_update_status(self, api_client, chef_user, customer_user):
        item = MenuItem.objects.create(name="Burger", category="Main Meal", price=10.00)
        order = Order.objects.create(table_number=5, created_by=customer_user)
        api_client.force_authenticate(user=chef_user)
        response = api_client.patch(f"/api/orders/{order.id}/", {"order_status": "ready"}, format='json')
        assert response.status_code == 200
        order.refresh_from_db()
        assert order.order_status == "ready"

    def test_customer_cannot_see_others_orders(self, api_client, customer_user):
        other_user = User.objects.create_user(username="other", email="other@gmail.com", password="password")
        Order.objects.create(table_number=1, created_by=other_user)
        api_client.force_authenticate(user=customer_user)
        response = api_client.get("/api/orders/")
        assert response.status_code == 200
        assert len(response.data) == 0
