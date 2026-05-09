from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..serializers import OrderSerializer

@api_view(['POST'])
def create_order(request):
    """POST /api/orders/ — accepts the cart payload and creates an Order."""
    serializer = OrderSerializer(data=request.data)
    if serializer.is_valid():
        order = serializer.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
