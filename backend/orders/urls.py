from django.urls import path
from .views.order_views import create_order
from .views.status_views import get_order_status

urlpatterns = [
    path('orders/', create_order, name='create-order'),
    path('orders/<int:pk>/', get_order_status, name='order-status'),
]