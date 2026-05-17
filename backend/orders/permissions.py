from rest_framework import permissions

class IsChef(permissions.BasePermission):
    """
    Custom permission to only allow chefs to access the view.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return getattr(request.user, 'role', None) == 'chef' or request.user.is_staff
