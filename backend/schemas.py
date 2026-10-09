"""
TestGenie Backend Schemas
FastAPI & Pydantic V2 Models for Test Generation & Sandbox Execution
Course Project: BITS Pilani ZC229T
"""

from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class TestCategory(str, Enum):
    NORMAL = "NORMAL"
    BOUNDARY = "BOUNDARY"
    EDGE = "EDGE"

class TestCaseStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    PASSED = "passed"
    FAILED = "failed"
    ERROR = "error"
    TIMED_OUT = "timed_out"

class TestCase(BaseModel):
    id: str = Field(..., description="Unique identifier for the test case")
    name: str = Field(..., description="Pythonic test function name (e.g., test_binary_search_empty_array)")
    category: TestCategory = Field(..., description="Category: NORMAL, BOUNDARY, or EDGE")
    description: str = Field(..., description="Educational rationale explaining why this test case matters")
    code: str = Field(..., description="Executable Python pytest test function definition")
    inputs_summary: Optional[str] = Field(None, description="Concise description of input parameters")
    expected_output: Optional[str] = Field(None, description="Expected return value or assertion")
    expected_behavior: Optional[str] = Field(None, description="Expected function behavior or exception")

class GenerateTestsRequest(BaseModel):
    code: str = Field(..., min_length=5, description="Student Python source code to test")
    context: str = Field(..., min_length=3, description="Assignment problem statement or requirements")
    function_name: Optional[str] = Field(None, description="Primary function or class to target")
    include_categories: Optional[List[TestCategory]] = Field(
        default=[TestCategory.NORMAL, TestCategory.BOUNDARY, TestCategory.EDGE],
        description="Categories to generate"
    )

class GenerateTestsResponse(BaseModel):
    success: bool
    summary: str = Field(..., description="Executive summary of the generated test suite")
    targeted_function: Optional[str] = None
    tests: List[TestCase] = Field(default_factory=list)
    categories_breakdown: Dict[str, int] = Field(default_factory=dict)
    generation_time_ms: Optional[float] = None

class TestExecutionItem(BaseModel):
    id: str
    name: str
    code: str

class ExecuteTestsRequest(BaseModel):
    code: str = Field(..., description="Student Python source code under test")
    tests: List[TestExecutionItem] = Field(..., description="List of test cases to execute")
    timeout_seconds: Optional[int] = Field(default=5, ge=1, le=15, description="Subprocess execution timeout")

class SingleTestResult(BaseModel):
    id: str
    name: str
    status: TestCaseStatus
    execution_time_ms: float = Field(..., description="Execution time in milliseconds")
    error_message: Optional[str] = None
    traceback: Optional[str] = None
    stdout: Optional[str] = None
    stderr: Optional[str] = None

class ExecutionSummary(BaseModel):
    total: int
    passed: int
    failed: int
    errors: int
    pass_percentage: float

class ExecuteTestsResponse(BaseModel):
    success: bool
    total_duration_ms: float
    compile_duration_ms: float
    results: List[SingleTestResult]
    summary: ExecutionSummary
    raw_terminal_output: Optional[str] = None

# ==============================================================================
# BITS Pilani Authentication & User Session Schemas
# ==============================================================================

class UserRole(str, Enum):
    STUDENT = "student"
    EVALUATOR = "evaluator"

class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    role: UserRole
    student_id: Optional[str] = None
    campus: Optional[str] = "Pilani Campus"
    department: Optional[str] = "Computer Science & Information Systems"

class LoginRequest(BaseModel):
    email: str = Field(..., description="BITS institutional email (@pilani.bits-pilani.ac.in)")
    password: Optional[str] = None
    role: Optional[UserRole] = UserRole.STUDENT
    student_id: Optional[str] = None
    name: Optional[str] = None

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: Optional[str] = None
    role: UserRole
    student_id: Optional[str] = None
    campus: Optional[str] = "Pilani Campus"

class AuthResponse(BaseModel):
    success: bool
    user: UserProfile
    token: str
    message: Optional[str] = None

