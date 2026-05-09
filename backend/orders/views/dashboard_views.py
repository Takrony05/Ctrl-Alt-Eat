from rest_framework import viewsets
from ..models import Order
from ..serializers import OrderSerializer

class DashboardViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for the Kitchen Dashboard.
    Shows only orders that are in_progress or ready.
    """
    queryset = Order.objects.filter(
        order_status__in=[Order.Status.IN_PROGRESS, Order.Status.READY]
    ).prefetch_related('items__menu_item')
    serializer_class = OrderSerializer
