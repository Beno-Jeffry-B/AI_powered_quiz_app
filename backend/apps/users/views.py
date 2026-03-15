"""
Users Views — DFD 1.0 User Authentication
"""

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from apps.users.serializers import LoginRequestSerializer
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
        return not_implemented_response("User registration")


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
            return Response({
                "message": "Credentials received",
                "data": {
                    "email": serializer.validated_data["email"],
                    "password": serializer.validated_data["password"]
                }
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
