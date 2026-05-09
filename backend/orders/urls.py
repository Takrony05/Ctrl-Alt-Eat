from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.order_views import OrderViewSet, MenuItemViewSet
from .views.dashboard_views import DashboardViewSet

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'menu-items', MenuItemViewSet, basename='menu-item')
router.register(r'dashboard', DashboardViewSet, basename='dashboard')

urlpatterns = [
    path('', include(router.urls)),
]