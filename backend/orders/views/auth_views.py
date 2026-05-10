from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from rest_framework import status

from ..serializers import SignupSerializer, LoginSerializer, UserSerializer


class SignupView(APIView):
    """
    POST /api/auth/signup/
    Body: { username, email, password, name? }
    Returns: { token, user }
    Role is auto-detected: @ejust.edu.eg → chef, else → customer.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """
    POST /api/auth/login/
    Body: { username, password }
    Returns: { token, user }
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
        })


class LogoutView(APIView):
    """
    POST /api/auth/logout/
    Deletes the user's token.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
        except Exception:
            pass
        return Response({'detail': 'Logged out successfully.'})


class MeView(APIView):
    """
    GET /api/auth/me/
    Returns the currently authenticated user's profile.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)
