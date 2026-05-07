from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.order_views import OrderViewSet, MenuItemViewSet

router = DefaultRouter()
router.register(r'orders', OrderViewSet)
router.register(r'menu-items', MenuItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
