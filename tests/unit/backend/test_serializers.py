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

    def test_order_serializer_table_number_boundary(self):
        item = MenuItem.objects.create(name="Pizza", category="Main Meal", price=15.00)
        
        # Test 0 table number
        data_low = {
            "table_number": 0,
            "items": [{"menu_item": item.id, "quantity": 1}]
        }
        serializer_low = OrderCreateSerializer(data=data_low)
        assert not serializer_low.is_valid()
        assert 'table_number' in serializer_low.errors
        
        # Test > 100 table number
        data_high = {
            "table_number": 101,
            "items": [{"menu_item": item.id, "quantity": 1}]
        }
        serializer_high = OrderCreateSerializer(data=data_high)
        assert not serializer_high.is_valid()
        assert 'table_number' in serializer_high.errors

    def test_order_serializer_quantity_boundary(self):
        item = MenuItem.objects.create(name="Pizza", category="Main Meal", price=15.00)
        
        # Test 0 quantity
        data_low = {
            "table_number": 3,
            "items": [{"menu_item": item.id, "quantity": 0}]
        }
        serializer_low = OrderCreateSerializer(data=data_low)
        assert not serializer_low.is_valid()
        assert 'quantity' in serializer_low.errors['items'][0]
        
        # Test > 50 quantity
        data_high = {
            "table_number": 3,
            "items": [{"menu_item": item.id, "quantity": 51}]
        }
        serializer_high = OrderCreateSerializer(data=data_high)
        assert not serializer_high.is_valid()
        assert 'quantity' in serializer_high.errors['items'][0]

    def test_order_serializer_notes_length_boundary(self):
        item = MenuItem.objects.create(name="Pizza", category="Main Meal", price=15.00)
        
        # Test very long note (over 500 characters)
        data = {
            "table_number": 3,
            "items": [{"menu_item": item.id, "quantity": 1, "notes": "A" * 501}]
        }
        serializer = OrderCreateSerializer(data=data)
        assert not serializer.is_valid()
        assert 'notes' in serializer.errors['items'][0]
