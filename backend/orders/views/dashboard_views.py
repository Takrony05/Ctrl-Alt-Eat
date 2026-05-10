from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from ..models import Order
from ..serializers import OrderSerializer


class DashboardViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/dashboard/      — Chef fetches all pending/active orders (FIFO).
    GET /api/dashboard/{id}/ — Single order detail.
    Requires authentication.
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Order.objects
            .filter(order_status__in=[Order.Status.PREPARING, Order.Status.READY])
            .prefetch_related('items__menu_item', 'items__selected_addons')
            .select_related('created_by')
            .order_by('created_at')  # FIFO
        )
