"""
Core Constants — Shared across all DFD modules
"""

# DFD Module: All
DIFFICULTY_EASY   = "easy"
DIFFICULTY_MEDIUM = "medium"
DIFFICULTY_HARD   = "hard"

DIFFICULTY_CHOICES = [
    (DIFFICULTY_EASY,   "Easy"),
    (DIFFICULTY_MEDIUM, "Medium"),
    (DIFFICULTY_HARD,   "Hard"),
]

# Answer option keys
ANSWER_OPTIONS = ["A", "B", "C", "D"]

# API response message constants
MSG_SUCCESS = "success"
MSG_ERROR   = "error"
MSG_PENDING = "pending"
