from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from ..models import Order, MenuItem, OrderItem, AddOn
from django.utils import timezone
import time

User = get_user_model()

class OrderModelTest(TestCase):
    def setUp(self):
        self.chef = User.objects.create_user(username='chef_user', email='chef@ejust.edu.eg', password='password', role='chef', name='Chef Ahmad')
        self.customer = User.objects.create_user(username='cust_user', email='cust@gmail.com', password='password', role='customer')
        self.item = MenuItem.objects.create(name='Burger', price=10.00, category='Main Meal')
        self.addon = AddOn.objects.create(name='Extra Cheese', price=2.00)

    # --- EXISTING TESTS (1-2) ---
    def test_order_fifo_sorting(self):
        """Unit Test 1: Verify orders are retrieved in FIFO order (Oldest First)"""
        order1 = Order.objects.create(created_by=self.customer, table_number=1, order_status=Order.Status.IN_PROGRESS)
        time.sleep(0.01)
        order2 = Order.objects.create(created_by=self.customer, table_number=2, order_status=Order.Status.IN_PROGRESS)
        active_orders = Order.objects.filter(order_status=Order.Status.IN_PROGRESS).order_by('created_at')
        self.assertEqual(list(active_orders), [order1, order2])

    def test_invalid_status_transition_logic(self):
        """Unit Test 2: Verify status state machine logic"""
        order = Order.objects.create(created_by=self.customer, table_number=1, order_status=Order.Status.IN_PROGRESS)
        order.order_status = Order.Status.READY
        order.save()
        self.assertEqual(order.order_status, Order.Status.READY)

    # --- NEW TESTS (3-14) ---
    def test_user_str_representation(self):
        """Unit Test 3: Verify User string representation (Name + Role)"""
        self.assertEqual(str(self.chef), "Chef Ahmad (chef)")
        self.assertEqual(str(self.customer), "cust_user (customer)")

    def test_addon_str_representation(self):
        """Unit Test 4: Verify AddOn string representation"""
        self.assertEqual(str(self.addon), "Extra Cheese (+$2.00)")

    def test_addon_price_validator(self):
        """Unit Test 5: Verify AddOn price cannot be negative"""
        addon = AddOn(name='Negative Addon', price=-1.00)
        with self.assertRaises(ValidationError):
            addon.full_clean()

    def test_menu_item_str_representation(self):
        """Unit Test 6: Verify MenuItem string representation"""
        self.assertEqual(str(self.item), "Burger — Main Meal ($10.00)")

    def test_menu_item_price_validator(self):
        """Unit Test 7: Verify MenuItem price cannot be negative"""
        item = MenuItem(name='Free Burger', price=-5.00, category='Main')
        with self.assertRaises(ValidationError):
            item.full_clean()

    def test_order_str_representation(self):
        """Unit Test 8: Verify Order string representation"""
        order = Order.objects.create(table_number=5)
        self.assertEqual(str(order), f"Order #{order.id} — Table 5 [in_progress]")

    def test_order_default_status(self):
        """Unit Test 9: Verify new orders default to 'in_progress'"""
        order = Order.objects.create(table_number=10)
        self.assertEqual(order.order_status, Order.Status.IN_PROGRESS)

    def test_order_table_number_validator(self):
        """Unit Test 10: Verify table number boundaries (1-100)"""
        order_low = Order(table_number=0)
        with self.assertRaises(ValidationError):
            order_low.full_clean()
        order_high = Order(table_number=101)
        with self.assertRaises(ValidationError):
            order_high.full_clean()

    def test_order_item_str_representation(self):
        """Unit Test 11: Verify OrderItem string representation"""
        order = Order.objects.create(table_number=1)
        oi = OrderItem.objects.create(order=order, menu_item=self.item, quantity=2)
        self.assertEqual(str(oi), f"2x Burger (Order #{order.id})")

    def test_order_item_quantity_validator(self):
        """Unit Test 12: Verify OrderItem quantity boundaries (1-50)"""
        order = Order.objects.create(table_number=1)
        oi_low = OrderItem(order=order, menu_item=self.item, quantity=0)
        with self.assertRaises(ValidationError):
            oi_low.full_clean()
        oi_high = OrderItem(order=order, menu_item=self.item, quantity=51)
        with self.assertRaises(ValidationError):
            oi_high.full_clean()

    def test_order_meta_ordering(self):
        """Unit Test 13: Verify Meta ordering (priority then created_at)"""
        order1 = Order.objects.create(priority=2, table_number=1)
        order2 = Order.objects.create(priority=1, table_number=2)
        self.assertEqual(list(Order.objects.all()[:2]), [order2, order1])

    def test_chef_role_validation(self):
        """Unit Test 14: Verify chef role assignment works correctly"""
        user = User.objects.create_user(username='new_chef', role=User.Role.CHEF)
        self.assertTrue(user.role == 'chef')
