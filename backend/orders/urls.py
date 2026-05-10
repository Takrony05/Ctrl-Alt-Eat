from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token

from .views.order_views import OrderViewSet, MenuItemViewSet
from .views.dashboard_views import DashboardViewSet
from .views.auth_views import SignupView, LoginView, LogoutView, MeView

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'menu-items', MenuItemViewSet, basename='menu-item')
router.register(r'dashboard', DashboardViewSet, basename='dashboard')

urlpatterns = [
    path('', include(router.urls)),
    # Auth endpoints
    path('auth/signup/', SignupView.as_view(), name='auth-signup'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/logout/', LogoutView.as_view(), name='auth-logout'),
    path('auth/me/', MeView.as_view(), name='auth-me'),
]