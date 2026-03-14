"""
Core Utilities — Shared helper functions across all DFD modules
"""

from rest_framework.response import Response
from rest_framework import status


# ---------------------------------------------------------------------------
# Standardised API response helpers (DFD: All modules)
# ---------------------------------------------------------------------------

def success_response(data=None, message="Success", http_status=status.HTTP_200_OK):
    """Return a standardised success JSON response."""
    return Response(
        {
            "status": "success",
            "message": message,
            "data": data,
        },
        status=http_status,
    )


def error_response(message="An error occurred.", http_status=status.HTTP_400_BAD_REQUEST):
    """Return a standardised error JSON response."""
    return Response(
        {
            "status": "error",
            "message": message,
            "data": None,
        },
        status=http_status,
    )


def not_implemented_response(feature_name="This feature"):
    """Return a 501 Not Implemented response for skeleton endpoints."""
    return Response(
        {
            "status": "not_implemented",
            "message": f"{feature_name} is not yet implemented.",
        },
        status=status.HTTP_501_NOT_IMPLEMENTED,
    )
