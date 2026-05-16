from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from ..models import Order, MenuItem
from django.urls import reverse

User = get_user_model()

class OrderAPITest(APITestCase):
    def setUp(self):
        self.chef = User.objects.create_user(username='chef', email='chef@ejust.edu.eg', password='password', role='chef')
        self.customer = User.objects.create_user(username='customer', email='cust@gmail.com', password='password', role='customer')
        self.other_customer = User.objects.create_user(username='other', email='other@gmail.com', password='password', role='customer')
        
        self.item = MenuItem.objects.create(name='Pizza', price=15.00, category='Main Meal')
        self.order = Order.objects.create(created_by=self.customer, table_number=5, order_status=Order.Status.IN_PROGRESS)

    def test_get_kitchen_dashboard(self):
        """Integration Test 1: GET /api/dashboard/ returns active orders for chefs"""
        self.client.force_authenticate(user=self.chef)
        url = reverse('dashboard-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(any(o['id'] == self.order.id for o in response.data))

    def test_patch_order_status_update(self):
        """Integration Test 2: PATCH /api/orders/{id}/ updates status"""
        self.client.force_authenticate(user=self.chef)
        url = reverse('order-detail', kwargs={'pk': self.order.id})
        data = {'order_status': Order.Status.READY}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.order.refresh_from_db()
        self.assertEqual(self.order.order_status, Order.Status.READY)

    def test_chef_access_only(self):
        """Integration Test 3: Ensure RBAC is enforced on dashboard (Customers blocked)"""
        self.client.force_authenticate(user=self.customer)
        url = reverse('dashboard-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_order_detail_isolation(self):
        """Integration Test 4: Ensure customers cannot access other customers' order details"""
        self.client.force_authenticate(user=self.other_customer)
        url = reverse('order-detail', kwargs={'pk': self.order.id})
        response = self.client.get(url)
        
        # Should return 404 Not Found if filtered by queryset or 403 if permission denied
        # Our OrderViewSet filters by created_by
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
