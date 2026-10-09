# TestGenie: AI-Powered Test Case Generator for Student Coding Assignments

[![Course](https://img.shields.io/badge/Course-BITS%20Pilani%20ZC229T-blue.svg)](https://www.bits-pilani.ac.in/)
[![Python](https://img.shields.io/badge/Python-3.10-yellow.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Pydantic%20v2-009688.svg)](https://fastapi.tiangolo.com/)
[![AI Model](https://img.shields.io/badge/AI%20Model-Gemini%203.8%20Flash-8e44ad.svg)](https://ai.google.dev/)
[![Status](https://img.shields.io/badge/Status-Completed-success.svg)](#milestones)

> **Course:** BITS Pilani — ZC229T  
> **Project Title:** TestGenie — An AI-Powered Test Case Generator & Sandbox Runner for Student Coding Assignments  
> **Academic Session:** 2026

---

## 1. Project Overview

In computer science education, writing comprehensive test suites is one of the most vital yet challenging skills for students to master. Most student assignment submissions fail automated grading pipelines not because of core algorithm syntax errors, but because of unhandled **boundary conditions** (e.g., empty arrays, single elements, zero crossings) and **pathological edge cases** (e.g., duplicate keys, extreme integers, off-by-one errors).

**TestGenie** is a specialized full-stack educational workbench built to solve this challenge. It allows students to paste their Python code, provide assignment problem statements, and automatically generate high-coverage Pytest unit tests categorized into **Normal**, **Boundary**, and **Edge** cases using **Gemini 3.8 Flash**.

The application features an integrated, real-time Python 3 sandbox runner that executes the generated test cases against the student's code, calculates precise execution time metrics with sub-millisecond badges, reports detailed assertion diffs, and displays a live simulated Pytest terminal console.

---

## 2. Team Matrix

| Member Name | Core Role | Key Deliverables & Responsibilities |
| :--- | :--- | :--- |
| **Shivansh Shrivastava** | **AI Architecture** | System Prompt Engineering, JSON Output Parsing & Fallback Logic; Gemini 3.8 Flash pipeline orchestration. |
| **Niharika Sharma** | **Backend Core** | FastAPI REST Endpoints, Routing & Database Integrations; request validation & API parity. |
| **Munagala Sreedivya** | **Frontend Engineering** | React UI Layout, Monaco Code Editor Integration & Styling; dark-mode IDE interface, category tabs. |
| **Oviyaa D** | **Sandboxed Execution** | Subprocess Execution Engine (`runner.py`), 5s Timeout Controls & Security; Pytest CLI terminal formatting. |
| **Abinaya B** | **Database Persistence** | SQLite Relational Schemas, SQLAlchemy ORM & Metrics Tracking; evaluation rubrics & test history data models. |

---

## 3. Technology Stack

### Frontend Client
- **Framework:** React 19 (SPA with functional components & custom hooks)
- **Language:** TypeScript 5.7+
- **Styling:** Tailwind CSS (modern dark-mode palette, custom monospace typography)
- **Icons:** Lucide React (`Sparkles`, `Terminal`, `CheckCircle2`, `Bug`, `FileCode2`, etc.)
- **Build System:** Vite 8.3 with `@tailwindcss/vite` and `@vitejs/plugin-react`

### Backend & AI Systems
- **Web Server:** Node.js Express server running with `tsx` (`server.ts`)
- **Vite Integration:** Mounted Vite dev middleware in development; static production bundle serving
- **Generative AI:** Google `@google/genai` TypeScript SDK with model **`gemini-3.8-flash`**
- **Structured Output:** Native JSON Schema enforcement (`responseMimeType: "application/json"`)
- **Telemetry:** Authenticated via `GEMINI_API_KEY` with `User-Agent: 'aistudio-build'`

### Sandbox Execution Engine
- **Runtime:** Python 3.10 sandbox (`runner.py`)
- **Isolation:** Standalone subprocess execution via `child_process.spawn`
- **Timer Resolution:** High-precision sub-millisecond timing via `time.perf_counter()`
- **Safety Watchguard:** 6-second timeout with automated `SIGKILL` termination against infinite loops
- **I/O Redirection:** `contextlib.redirect_stdout` and `redirect_stderr` preventing output pollution

### API Contracts & Schemas
- **Schema Engine:** Pydantic V2 (`backend/schemas.py`)
- **Specification:** FastAPI (`backend/main.py`)
- **Export Formats:** Standalone runnable `test_assignment.py` and `conftest.py`

---

## 4. 8-Week Milestone Tracking Table
 
| Week | Milestone Phase | Key Deliverables & Activities | Lead Contributors | Status |
| :---: | :--- | :--- | :--- | :---: |
| **01** | **Ideation & Requirements** | Problem definition, pedagogical goals, initial wireframes, Git repo setup, project charter. | Shivansh Shrivastava, All | ✅ Done |
| **02** | **Schemas & Contracts** | FastAPI Pydantic V2 data models (`schemas.py`), SQLite & SQLAlchemy relational schemas, API specs. | Niharika Sharma, Abinaya B | ✅ Done |
| **03** | **LLM Integration** | Server-side Gemini 3.8 Flash pipeline, partition testing prompt engineering, JSON schema enforcement. | Shivansh Shrivastava, Niharika Sharma | ✅ Done |
| **04** | **Sandbox Runner Engine** | Python `runner.py` subprocess execution, namespace isolation, 5s timeout controls & security watchguard. | Oviyaa D, Niharika Sharma | ✅ Done |
| **05** | **Frontend IDE Studio** | Split-screen layout, code editor with line numbers, tab indentation, category filtering tabs & styling. | Munagala Sreedivya, Oviyaa D | ✅ Done |
| **06** | **Console & Export** | Simulated Pytest terminal console, traceback diff parsing, FastAPI specs modal, metrics tracking. | Munagala Sreedivya, Abinaya B | ✅ Done |
| **07** | **Stress Testing & QA** | Edge-case algorithm test matrix, 5s timeout protection, WCAG accessibility audit, latency benchmarks. | Oviyaa D, Shivansh Shrivastava | ✅ Done |
| **08** | **Final Delivery** | Weekly reports packaging (`Week_01.md` - `Week_08.md`), README update, presentation sign-off. | Shivansh Shrivastava, All | ✅ Done |

Detailed weekly progress reports are available in [`docs/weekly_reports/`](docs/weekly_reports/).

---

## 5. System Architecture & Workflow

```text
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                      Student Browser (React 19 Frontend)                     │
 │  ┌───────────────────────────────┐     ┌─────────────────────────────────┐  │
 │  │      Python Code Editor       │     │    Categorized Test Cards       │  │
 │  │    (solution.py + Context)    │     │   (NORMAL / BOUNDARY / EDGE)    │  │
 │  └───────────────┬───────────────┘     └─────────────────┬───────────────┘  │
 └──────────────────┼───────────────────────────────────────┼──────────────────┘
                    │ POST /api/generate-tests              │ POST /api/execute-tests
                    ▼                                       ▼
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                         Express Backend Server (Node.js)                    │
 │                                                                             │
 │  ┌────────────────────────────────────┐  ┌───────────────────────────────┐  │
 │  │   Gemini 3.8 Flash Integration     │  │ Subprocess Sandbox Controller │  │
 │  │     (@google/genai SDK)            │  │ (child_process.spawn + timer) │  │
 │  └─────────────────┬──────────────────┘  └───────────────┬───────────────┘  │
 └────────────────────┼─────────────────────────────────────┼──────────────────┘
                      │ Structured JSON Prompt              │ stdin / stdout JSON
                      ▼                                     ▼
             Google Gemini API                   Python 3 Sandbox (runner.py)
          (Model: gemini-3.8-flash)            - Namespace isolation
          - NORMAL cases (40%)                 - time.perf_counter() metrics
          - BOUNDARY cases (30%)               - Traceback & assertion diffs
          - EDGE cases (30%)                   - 6s timeout watchguard
```

---

## 6. Three-Tier Test Categorization Methodology

In accordance with the BITS Pilani ZC229T grading rubric:

1. **NORMAL CASES (40% Weight):**
   - Focuses on typical operational inputs exercising the core algorithmic branches.
   - Example: Searching for an element at the middle index of an odd or even-length array.

2. **BOUNDARY CASES (30% Weight):**
   - Probes extremes where student pointer logic or iteration loops frequently introduce off-by-one errors.
   - Example: Empty arrays (`[]`), single elements (`[42]`), first element (`index 0`), and last element (`index len - 1`).

3. **EDGE CASES (30% Weight):**
   - Validates code resilience against rare, tricky, or adversarial conditions.
   - Example: Target values strictly outside the array range, duplicate entries, negative numbers, and out-of-order bounds.

---

## 7. Project Directory Structure

```text
.
├── backend/
│   ├── main.py                     # FastAPI application router & endpoints
│   └── schemas.py                  # Pydantic V2 request & response schemas
├── docs/
│   └── weekly_reports/
│       ├── Week_01.md              # Requirements & project charter
│       ├── Week_02.md              # System design & API schemas
│       ├── Week_03.md              # Gemini 3.8 Flash prompt engineering
│       ├── Week_04.md              # Python sandbox execution engine
│       ├── Week_05.md              # Split-screen frontend IDE studio
│       ├── Week_06.md              # Pytest terminal console & export
│       ├── Week_07.md              # System testing & edge-case QA
│       └── Week_08.md              # Final integration & project delivery
├── src/
│   ├── components/
│   │   ├── CodeEditor.tsx          # Python editor with line numbers & context
│   │   ├── CustomTestModal.tsx     # Add custom test case dialog
│   │   ├── FastApiModal.tsx        # View & download FastAPI specs / Pytest suite
│   │   ├── Header.tsx              # BITS Pilani banner, presets & controls
│   │   ├── RubricInfoModal.tsx     # ZC229T grading rubric documentation
│   │   ├── TerminalConsole.tsx     # Simulated Pytest CLI terminal drawer
│   │   ├── TestCard.tsx            # Test case card with badge & copy button
│   │   └── TestResultsPanel.tsx    # Category tabs, filter bar & progress stats
│   ├── data/
│   │   └── presets.ts              # Preloaded Binary Search & algorithm presets
│   ├── App.tsx                     # Main application orchestrator
│   ├── main.tsx                    # React DOM entry point
│   ├── index.css                   # Tailwind CSS imports & IDE typography
│   └── types.ts                    # TypeScript interface definitions
├── index.html                      # HTML entry point with synchronized metadata
├── metadata.json                   # AI Studio applet metadata & capabilities
├── package.json                    # Project dependencies & full-stack scripts
├── runner.py                       # Sandboxed Python test runner script
├── server.ts                       # Express server with Vite middleware & Gemini API
└── tsconfig.json                   # TypeScript compiler configuration
```

---

## 8. Quick Start Guide

### Prerequisites
- Node.js (v18+ or v22+)
- Python 3.10+
- Google Gemini API Key (configured in environment as `GEMINI_API_KEY`)

### Installation & Execution
```bash
# 1. Install dependencies
npm install

# 2. Run full-stack development server (Express + Vite)
npm run dev

# 3. Open in browser
# http://localhost:3000
```

### Running Standalone Pytest Suite
You can export `test_assignment.py` directly from the web interface, or run:
```bash
python3 runner.py << 'EOF'
{
  "code": "def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1",
  "tests": [
    {
      "id": "1",
      "name": "test_normal_middle",
      "code": "def test_normal_middle():\n    assert binary_search([1, 3, 5, 7, 9], 5) == 2"
    }
  ]
}
EOF
```

---

## 9. Academic Attribution & License
 
- **Course:** BITS Pilani Work Integrated Learning Programmes (WILP) — ZC229T
- **Development Team:** Shivansh Shrivastava, Niharika Sharma, Munagala Sreedivya, Oviyaa D, Abinaya B
- **License:** Apache License 2.0
