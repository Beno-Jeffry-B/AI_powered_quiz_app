"""
Users Views — DFD 1.0 User Authentication
"""

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from apps.users.serializers import LoginRequestSerializer, RegisterSerializer, UserSerializer
from apps.users.services import UserService



# DFD 1.0 — Process 1.1: Register User
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            tokens = UserService.generate_auth_tokens(user)

            return Response({
                "message": "Registration successful",
                "access_token": tokens["access_token"],
                "refresh_token": tokens["refresh_token"],
            }, status=201)

        return Response(serializer.errors, status=400)


# DFD 1.0 — Process 1.2: Login User
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginRequestSerializer(data=request.data)

        if serializer.is_valid():
            result = UserService.login_user(
                serializer.validated_data["email"],
                serializer.validated_data["password"]
            )

            return Response({
                "message": "Login successful",
                "access_token": result["tokens"]["access_token"],
                "refresh_token": result["tokens"]["refresh_token"]
            })

        return Response(serializer.errors, status=400)

# DFD 1.0 — Process 1.3: Get User Profile
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = UserService.get_user_profile(request.user)
        serializer = UserSerializer(user)

        return Response({
            "user": serializer.data
        })
