"""
Root URL Configuration — AI Quiz Generation & Attempt System
All app-level URLs are mounted under /api/v1/
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),

    # API v1 — wiring all DFD modules
    path("api/v1/auth/",        include("apps.users.urls")),       # DFD 1.0
    path("api/v1/quizzes/",     include("apps.quizzes.urls")),     # DFD 2.0
    path("api/v1/questions/",   include("apps.questions.urls")),   # DFD 3.0
    path("api/v1/attempts/",    include("apps.attempts.urls")),    # DFD 4.0
    path("api/v1/evaluation/",  include("apps.evaluation.urls")),  # DFD 5.0
]
