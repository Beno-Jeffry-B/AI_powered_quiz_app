"""
Core Custom Permissions — Shared across all DFD modules
"""

from rest_framework.permissions import BasePermission


# DFD Module: All — ownership check placeholder
class IsOwner(BasePermission):
    """
    Object-level permission: only allow access to the owner of an object.
    TODO: implement check_object_permissions in relevant views.
    """

    def has_object_permission(self, request, view, obj):
        # Placeholder — to be implemented per module
        return obj.user == request.user


# DFD Module: 1.0 — allow unauthenticated access (login / register)
class AllowAny(BasePermission):
    """Allows access to any request (authenticated or not)."""

    def has_permission(self, request, view):
        return True
