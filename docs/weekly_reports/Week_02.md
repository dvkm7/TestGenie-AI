# Week 02 Report: System Design, Schemas & API Contract Definition
**Course:** BITS Pilani - ZC229T  
**Project:** TestGenie - AI-Powered Test Case Generator for Student Coding Assignments  
**Timeline:** Week 2  
**Status:** Completed  

---

## 1. Objectives & Overview
During Week 2, the team formalized system contracts, implemented Pydantic V2 data validation models for FastAPI, structured relational database tables with SQLAlchemy for metrics tracking, designed the React editor interface layout, and prototyped initial subprocess execution scripts.

---

## 2. Team Member Task Breakdown

### **Shivansh Shrivastava (AI Architecture)**
- Developed initial system prompt templates constraining Gemini to generate standard Python `def test_...():` functions with `assert` statements.
- Designed JSON output schemas defining required properties: `summary`, `targeted_function`, and `tests` array with `id`, `name`, `category`, `description`, and `code`.
- Implemented robust JSON parsing and sanitation logic to strip potential markdown code fences or conversational filler from raw AI completions.
- Drafted prompt evaluation datasets covering iterative and recursive algorithm patterns.

### **Niharika Sharma (Backend Core)**
- Implemented core FastAPI application router structure in `backend/main.py`.
- Developed Pydantic V2 request and response schemas in `backend/schemas.py`:
  - `GenerateTestsRequest` and `GenerateTestsResponse`
  - `ExecuteTestsRequest` and `ExecuteTestsResponse`
  - `TestCase`, `TestCategory`, `TestCaseStatus`, and `ExecutionSummary`
- Configured FastAPI CORS middleware, health check endpoint (`/health`), and JSON error response handlers.

### **Munagala Sreedivya (Frontend Engineering)**
- Built responsive layout structure in React with Tailwind CSS dark-mode theme.
- Integrated code editor interface with line numbers, monospace font settings (`Fira Code`), and custom syntax styling.
- Created reusable UI badge components for test categories:
  - `NORMAL`: Emerald badge (`#059669`)
  - `BOUNDARY`: Amber badge (`#d97706`)
  - `EDGE`: Purple badge (`#7c3aed`)
- Implemented responsive navigation header with BITS Pilani ZC229T course project branding.

### **Oviyaa D (Sandboxed Execution)**
- Built prototype subprocess execution pipeline using Python's `subprocess.run`.
- Designed standard I/O redirection using `io.StringIO` and `contextlib.redirect_stdout` to isolate student `print()` statements from test results.
- Benchmarked process spawning overhead and tuned command-line flags (`-B` to prevent `.pyc` caching).
- Implemented 5-second execution timeout guard throwing structured timeout exceptions.

### **Abinaya B (Database Persistence)**
- Designed SQLite relational schemas and authored SQLAlchemy ORM models:
  - `AssignmentSubmission`: tracking student code, assignment context, and timestamp.
  - `TestSuiteRun`: storing generated test count, category breakdowns, and AI generation duration.
  - `ExecutionMetric`: tracking passed/failed counts, total execution time, and pass percentage.
- Configured database engine connection strings and automated SQLite schema migrations.

---

## 3. Key Deliverables & Artifacts
- `backend/schemas.py`: Pydantic V2 data model definitions.
- `backend/main.py`: FastAPI router and endpoint skeletons.
- SQLite database schema & SQLAlchemy ORM entity models.
- Prototype React split-screen editor UI with category badges.
- Sandbox subprocess execution prototype script.

---

## 4. Challenges & Mitigations
- **Challenge:** Pydantic V2 syntax migration differences from legacy V1.  
  *Mitigation:* Standardized on Pydantic V2 idioms (`model_dump()`, `Field(..., description=...)`).
- **Challenge:** Isolating student code stdout from JSON runner outputs.  
  *Mitigation:* Encapsulated user code execution in `contextlib.redirect_stdout` buffers.

---

## 5. Next Week Plan (Week 03)
- Integrate Gemini 3.8 Flash model via `@google/genai` TypeScript SDK.
- Connect FastAPI backend routes with the AI generation pipeline.
- Implement editor indentation controls and category selection checkboxes in the UI.
- Refine sandbox runner to execute individual unit tests sequentially with timing.
