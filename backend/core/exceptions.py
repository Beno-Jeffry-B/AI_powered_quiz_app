"""
Core Custom Exceptions — Shared across all DFD modules
"""

from rest_framework.exceptions import APIException
from rest_framework import status


# DFD Module: All — base exception for the quiz system
class QuizSystemException(APIException):
    """Base exception for all custom errors in the quiz system."""
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = "An unexpected error occurred."
    default_code = "quiz_system_error"


# DFD Module: 1.0 — Authentication
class AuthenticationFailed(QuizSystemException):
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = "Authentication failed."
    default_code = "authentication_failed"


# DFD Module: 2.0 — Quiz Generation
class QuizGenerationFailed(QuizSystemException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = "Failed to generate quiz."
    default_code = "quiz_generation_failed"


# DFD Module: 3.0 — Quiz Retrieval
class QuizNotFound(QuizSystemException):
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = "Quiz not found."
    default_code = "quiz_not_found"


# DFD Module: 4.0 — Attempt Submission
class AttemptSubmissionFailed(QuizSystemException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Failed to submit quiz attempt."
    default_code = "attempt_submission_failed"


# DFD Module: 5.0 — Evaluation
class EvaluationFailed(QuizSystemException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = "Failed to evaluate quiz attempt."
    default_code = "evaluation_failed"
