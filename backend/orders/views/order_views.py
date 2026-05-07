from rest_framework import viewsets
from ..models import Order, MenuItem
from ..serializers import OrderSerializer, MenuItemSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-priority', '-created_at')
    serializer_class = OrderSerializer

class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all().order_by('category', 'name')
    serializer_class = MenuItemSerializer
