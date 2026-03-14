"""
Users URL Configuration — DFD 1.0 User Authentication
Mounted at: /api/v1/auth/
"""

from django.urls import path
from apps.users.views import RegisterView, LoginView, ProfileView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="user-register"),  # DFD 1.1
    path("login/",    LoginView.as_view(),    name="user-login"),     # DFD 1.2
    path("profile/",  ProfileView.as_view(),  name="user-profile"),   # DFD 1.3
]
