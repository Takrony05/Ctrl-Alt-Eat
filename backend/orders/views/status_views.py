from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Order
from ..serializers import OrderSerializer

@api_view(['GET'])
def get_order_status(request, pk):
    """GET /api/orders/{id}/ — returns the current order status."""
    try:
        order = Order.objects.get(pk=pk)
        return Response(OrderSerializer(order).data)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
