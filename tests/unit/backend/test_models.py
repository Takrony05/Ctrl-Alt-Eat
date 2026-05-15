import pytest
from orders.models import User, AddOn, MenuItem, Order, OrderItem

@pytest.mark.django_db
class TestModels:
    def test_user_creation(self):
        user = User.objects.create_user(username="testuser", email="test@gmail.com", password="password123")
        assert user.username == "testuser"
        assert user.role == User.Role.CUSTOMER
        assert str(user) == "testuser (customer)"

    def test_chef_user_creation(self):
        user = User.objects.create_user(username="chef1", email="chef@ejust.edu.eg", password="password123", role=User.Role.CHEF)
        assert user.role == User.Role.CHEF
        assert str(user) == "chef1 (chef)"

    def test_addon_model(self):
        addon = AddOn.objects.create(name="Extra Cheese", price=1.50)
        assert str(addon) == "Extra Cheese (+$1.50)"

    def test_menu_item_model(self):
        item = MenuItem.objects.create(name="Burger", category="Main Meal", price=10.00)
        assert str(item) == "Burger — Main Meal ($10.00)"

    def test_order_model(self):
        order = Order.objects.create(table_number=5)
        assert order.order_status == Order.Status.IN_PROGRESS
        assert "Order #" in str(order)
        assert "Table 5" in str(order)

    def test_order_item_model(self):
        item = MenuItem.objects.create(name="Burger", category="Main Meal", price=10.00)
        order = Order.objects.create(table_number=5)
        order_item = OrderItem.objects.create(order=order, menu_item=item, quantity=2)
        assert str(order_item) == f"2x Burger (Order #{order.id})"

    def test_negative_price_addon_fails_validation(self):
        from django.core.exceptions import ValidationError
        addon = AddOn(name="Test Addon", price=-5.00)
        with pytest.raises(ValidationError):
            addon.full_clean()

    def test_negative_price_menu_item_fails_validation(self):
        from django.core.exceptions import ValidationError
        item = MenuItem(name="Burger", category="Main Meal", price=-10.00)
        with pytest.raises(ValidationError):
            item.full_clean()

    def test_order_table_number_boundaries(self):
        from django.core.exceptions import ValidationError
        # Below boundary
        order_low = Order(table_number=0)
        with pytest.raises(ValidationError):
            order_low.full_clean()
        
        # Above boundary
        order_high = Order(table_number=101)
        with pytest.raises(ValidationError):
            order_high.full_clean()

    def test_order_item_quantity_boundaries(self):
        from django.core.exceptions import ValidationError
        item = MenuItem.objects.create(name="Burger", category="Main Meal", price=10.00)
        order = Order.objects.create(table_number=5)
        
        # Below boundary
        order_item_low = OrderItem(order=order, menu_item=item, quantity=0)
        with pytest.raises(ValidationError):
            order_item_low.full_clean()
        
        # Above boundary
        order_item_high = OrderItem(order=order, menu_item=item, quantity=51)
        with pytest.raises(ValidationError):
            order_item_high.full_clean()
