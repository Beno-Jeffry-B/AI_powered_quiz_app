"""
Users Views — DFD 1.0 User Authentication
"""

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from apps.users.serializers import LoginRequestSerializer
from apps.users.services import UserService
from core.utils import not_implemented_response


# DFD 1.0 — Process 1.1: Register User
class RegisterView(APIView):
    """
    POST /api/v1/auth/register/
    Accepts: { email, username, password }
    Returns: { access_token, refresh_token, user }
    TODO: Implement in DFD 1.0 Authentication module.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email    = request.data.get("email", "").strip()
        password = request.data.get("password", "")

        if not email or not password:
            return Response({"detail": "Email and password are required."}, status=400)

        try:
            user   = UserService.register_user(email=email, password=password)
            tokens = UserService.generate_auth_tokens(user)
            return Response({
                "message": "Registration successful",
                "access_token":  tokens["access_token"],
                "refresh_token": tokens["refresh_token"],
            }, status=201)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=400)


# DFD 1.0 — Process 1.2: Login User
class LoginView(APIView):
    """
    POST /api/v1/auth/login/
    Accepts: { email, password }
    Returns: { access_token, refresh_token }
    TODO: Implement in DFD 1.0 Authentication module.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginRequestSerializer(data=request.data)
        if serializer.is_valid():
            user = UserService.verify_user(
                serializer.validated_data["email"],
                serializer.validated_data["password"]
            )
            tokens = UserService.generate_auth_tokens(user)
            return Response({
                "message": "Login successful",
                "access_token": tokens["access_token"],
                "refresh_token": tokens["refresh_token"]
            })
        return Response(serializer.errors, status=400)


# DFD 1.0 — Process 1.3: Get User Profile
class ProfileView(APIView):
    """
    GET /api/v1/auth/profile/
    Returns: { user }
    TODO: Implement in DFD 1.0 Authentication module.
    """

    def get(self, request):
        return not_implemented_response("User profile")
