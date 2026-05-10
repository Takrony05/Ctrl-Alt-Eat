from collections import defaultdict

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from ..models import Order, MenuItem
from ..serializers import (
    OrderCreateSerializer,
    OrderSerializer,
    OrderStatusUpdateSerializer,
    MenuItemSerializer,
)


class MenuItemViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/menu-items/  — returns all items grouped by category.
    No auth required so the menu is publicly viewable.
    """
    queryset = MenuItem.objects.prefetch_related('available_addons').order_by('category', 'name')
    serializer_class = MenuItemSerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        """Return items grouped by category."""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        grouped = defaultdict(list)
        for item in serializer.data:
            grouped[item['category']].append(item)
        return Response(dict(grouped))


class OrderViewSet(viewsets.ModelViewSet):
    """
    POST /api/orders/       — customer submits cart
    GET  /api/orders/       — list all orders (staff)
    GET  /api/orders/{id}/  — retrieve single order
    PATCH /api/orders/{id}/ — chef updates order status
    """
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.all().prefetch_related(
            'items__menu_item',
            'items__selected_addons',
        ).select_related('created_by')

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        if self.action in ('partial_update', 'update'):
            return OrderStatusUpdateSerializer
        return OrderSerializer

    def perform_create(self, serializer):
        order = serializer.save(created_by=self.request.user)
        return order

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save(created_by=request.user)
        # Return full order detail
        detail_serializer = OrderSerializer(order, context={'request': request})
        return Response(detail_serializer.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        """PATCH /api/orders/{id}/ — Chef marks order as ready."""
        order = self.get_object()
        serializer = OrderStatusUpdateSerializer(order, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # If order is now 'ready', broadcast WebSocket event
        if order.order_status == Order.Status.READY:
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                "orders",
                {
                    "type": "order_ready",
                    "order_id": order.id,
                    "table_number": order.table_number,
                    "customer_id": order.created_by_id,
                },
            )

        detail_serializer = OrderSerializer(order, context={'request': request})
        return Response(detail_serializer.data)
