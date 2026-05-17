from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from ..permissions import IsChef

from ..models import Order
from ..serializers import OrderSerializer
from .order_views import is_kitchen_staff


class DashboardViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/dashboard/      — Chef fetches all active orders (FIFO).
    GET /api/dashboard/{id}/ — Single order detail.

    Only returns orders with status `in_progress` or `ready`.
    Delivered and cancelled orders are intentionally excluded.
    Requires chef authentication.
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsChef]

    def get_queryset(self):
        if not is_kitchen_staff(self.request.user):
            raise PermissionDenied("Only kitchen staff can view the kitchen dashboard.")

        return (
            Order.objects
            .filter(order_status__in=[
                Order.Status.IN_PROGRESS,
                Order.Status.READY,
            ])
            .prefetch_related('items__menu_item', 'items__selected_addons')
            .select_related('created_by')
            .order_by('created_at')  # FIFO — oldest first
        )
