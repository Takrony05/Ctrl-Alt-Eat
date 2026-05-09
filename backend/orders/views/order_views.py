from rest_framework import viewsets
from ..models import Order, MenuItem
from ..serializers import OrderSerializer, MenuItemSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().prefetch_related('items__menu_item')
    serializer_class = OrderSerializer

class MenuItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
