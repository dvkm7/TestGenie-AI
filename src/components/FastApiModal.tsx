import React, { useState } from 'react';
import { 
  X, 
  FileCode2, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  Layers, 
  CheckCircle2,
  Code
} from 'lucide-react';
import { TestCase } from '../types';

interface FastApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  tests: TestCase[];
  studentCode: string;
}

export const FastApiModal: React.FC<FastApiModalProps> = ({
  isOpen,
  onClose,
  tests,
  studentCode,
}) => {
  const [activeTab, setActiveTab] = useState<'schemas' | 'fastapi' | 'pytest' | 'conftest'>('schemas');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const schemasPython = `"""
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
`;

  const fastApiPython = `"""
TestGenie FastAPI Backend Application
BITS Pilani ZC229T Course Project
Provides endpoints for AI test generation and sandboxed Pytest test execution.
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import json
import time
import sys
import os

from schemas import (
    GenerateTestsRequest,
    GenerateTestsResponse,
    ExecuteTestsRequest,
    ExecuteTestsResponse,
    SingleTestResult,
    ExecutionSummary,
    TestCaseStatus,
)

app = FastAPI(
    title="TestGenie API",
    description="AI-Powered Unit Test Case Generator and Pytest Runner (BITS Pilani ZC229T)",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "TestGenie API",
        "python_version": sys.version,
        "project": "BITS Pilani ZC229T",
    }

@app.post("/api/execute-tests", response_model=ExecuteTestsResponse)
def execute_tests(payload: ExecuteTestsRequest):
    """
    Executes student code alongside generated tests in an isolated sandbox.
    """
    input_data = json.dumps({
        "code": payload.code,
        "tests": [t.dict() for t in payload.tests]
    })

    try:
        proc = subprocess.run(
            [sys.executable, "runner.py"],
            input=input_data,
            text=True,
            capture_output=True,
            timeout=payload.timeout_seconds,
        )
        return json.loads(proc.stdout)
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=408, detail="Test execution timed out")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
`;

  const pytestFile = `# ==============================================================================
# TestGenie - BITS Pilani ZC229T Project
# Auto-generated Pytest Test Suite
# Run locally with: pytest test_assignment.py -v
# ==============================================================================

import pytest

# Student Solution Implementation:
${studentCode}

# ==============================================================================
# CATEGORIZED UNIT TESTS: NORMAL, BOUNDARY, EDGE
# ==============================================================================

${tests.map((t) => `# [Category: ${t.category}] - ${t.description}\n${t.code}`).join('\n\n')}
`;

  const conftestPy = `"""
pytest configuration and fixtures for TestGenie sandbox
"""
import pytest
import time

@pytest.fixture(autouse=True)
def benchmark_timer(request):
    start = time.perf_counter()
    yield
    duration_ms = (time.perf_counter() - start) * 1000
    # Recorded in terminal report
`;

  const getCodeContent = () => {
    switch (activeTab) {
      case 'schemas':
        return schemasPython;
      case 'fastapi':
        return fastApiPython;
      case 'pytest':
        return pytestFile;
      case 'conftest':
        return conftestPy;
    }
  };

  const getFileName = () => {
    switch (activeTab) {
      case 'schemas':
        return 'schemas.py';
      case 'fastapi':
        return 'main.py';
      case 'pytest':
        return 'test_assignment.py';
      case 'conftest':
        return 'conftest.py';
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCodeContent());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([getCodeContent()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = getFileName();
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/60">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                FastAPI Schemas & Pytest Architecture
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/60">
                  ZC229T Backend Spec
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Pydantic V2 data contracts, FastAPI endpoints, and exportable Pytest suite
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-5 pt-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('schemas')}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded-t-lg transition-colors border-b-2 ${
                activeTab === 'schemas'
                  ? 'border-indigo-500 text-indigo-300 bg-slate-800/80'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              schemas.py (Pydantic V2)
            </button>
            <button
              onClick={() => setActiveTab('fastapi')}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded-t-lg transition-colors border-b-2 ${
                activeTab === 'fastapi'
                  ? 'border-indigo-500 text-indigo-300 bg-slate-800/80'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              main.py (FastAPI Router)
            </button>
            <button
              onClick={() => setActiveTab('pytest')}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded-t-lg transition-colors border-b-2 ${
                activeTab === 'pytest'
                  ? 'border-emerald-500 text-emerald-300 bg-slate-800/80'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              test_assignment.py ({tests.length} tests)
            </button>
            <button
              onClick={() => setActiveTab('conftest')}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded-t-lg transition-colors border-b-2 ${
                activeTab === 'conftest'
                  ? 'border-indigo-500 text-indigo-300 bg-slate-800/80'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              conftest.py
            </button>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <button
              onClick={handleCopy}
              className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {getFileName()}</span>
            </button>
          </div>
        </div>

        {/* Code View */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-950">
          <pre className="font-mono text-xs text-slate-200 p-4 rounded-xl bg-slate-900 border border-slate-800/80 overflow-x-auto leading-relaxed selection:bg-indigo-900">
            <code>{getCodeContent()}</code>
          </pre>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>BITS Pilani Course ZC229T - Automated Unit Testing & Continuous Grading Framework</span>
          <span className="font-mono text-indigo-400">Ready for Pytest / CI Pipeline</span>
        </div>
      </div>
    </div>
  );
};
