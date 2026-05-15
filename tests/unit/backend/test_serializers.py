import pytest
from orders.serializers import SignupSerializer, OrderCreateSerializer
from orders.models import User, MenuItem

@pytest.mark.django_db
class TestSerializers:
    def test_signup_serializer_customer(self):
        data = {
            "username": "customer1",
            "email": "customer@gmail.com",
            "password": "password123",
            "name": "John Doe"
        }
        serializer = SignupSerializer(data=data)
        assert serializer.is_valid()
        user = serializer.save()
        assert user.role == User.Role.CUSTOMER

    def test_signup_serializer_chef(self):
        data = {
            "username": "chef1",
            "email": "chef@ejust.edu.eg",
            "password": "password123",
            "name": "Chef Mike"
        }
        serializer = SignupSerializer(data=data)
        assert serializer.is_valid()
        user = serializer.save()
        assert user.role == User.Role.CHEF

    def test_order_create_serializer(self):
        item = MenuItem.objects.create(name="Pizza", category="Main Meal", price=15.00)
        data = {
            "table_number": 3,
            "items": [
                {"menu_item": item.id, "quantity": 1, "notes": "No olives"}
            ]
        }
        serializer = OrderCreateSerializer(data=data)
        assert serializer.is_valid()
        order = serializer.save()
        assert order.table_number == 3
        assert order.items.count() == 1
        assert order.items.first().menu_item == item
