# Week 06 Report: Terminal Console, Traceback Parsing & Export Architecture
**Course:** BITS Pilani - ZC229T  
**Project:** TestGenie - AI-Powered Test Case Generator for Student Coding Assignments  
**Timeline:** Week 6  
**Status:** Completed  

---

## 1. Objectives & Overview
Week 6 focused on developer tooling enhancements: creating the interactive in-browser Pytest Terminal Console, building the FastAPI & Pytest specification modal (`FastApiModal.tsx`), supporting custom student-authored test cases, and implementing one-click `.py` test suite downloads.

---

## 2. Team Member Task Breakdown

### **Shivansh Shrivastava (AI Architecture)**
- Implemented `src/components/CustomTestModal.tsx` logic ensuring custom student test functions adhere to the categorized partition schema (NORMAL, BOUNDARY, EDGE).
- Added prompt safeguards against adversarial input code (preventing recursive macro expansion or infinite prompt injections).
- Refined test explanation generation to provide actionable feedback when student assertions fail.

### **Niharika Sharma (Backend Core)**
- Implemented the `/api/specs` backend endpoint to serve `backend/schemas.py` and `backend/main.py` directly to the frontend modal.
- Configured FastAPI routing for the export endpoints and validated OpenAPI documentation generation.
- Designed JSON response payload serialization for the simulated Pytest terminal view.

### **Munagala Sreedivya (Frontend Engineering)**
- Built `src/components/TerminalConsole.tsx`:
  - Added collapsible toggle, expand-to-fullscreen mode, copy-all, and clear buttons.
  - Implemented syntax color-coding: cyan for headers, emerald for passed tests, rose for failures, and amber for assertion traces.
- Built `src/components/FastApiModal.tsx`:
  - Tabbed code viewer for `schemas.py`, `main.py`, `test_assignment.py`, and `conftest.py`.
  - Copy-to-clipboard and one-click download buttons.
- Enhanced `TestCard.tsx` with expandable traceback view toggles for failed tests.

### **Oviyaa D (Sandboxed Execution)**
- Designed the simulated terminal output generator in `server.ts` to output standard Pytest syntax:
  ```text
  ============================= test session starts =============================
  platform linux -- Python 3.10.12, pytest-runner-sandbox
  collected 8 items
  test_assignment.py::test_binary_search_middle_element ✓ PASSED (0.05ms)
  ...
  ======================= 8 passed in 0.02s =======================
  ```
- Verified terminal output rendering across failed assertion diffs and runtime exceptions.
- Hardened subprocess security constraints, ensuring memory limits are respected.

### **Abinaya B (Database Persistence)**
- Created `src/components/RubricInfoModal.tsx` detailing the BITS Pilani ZC229T grading methodology:
  - Normal cases: 40% weight (core happy path logic)
  - Boundary cases: 30% weight (extremities, empty lists, index bounds)
  - Edge cases: 30% weight (duplicates, out-of-bounds, negative numbers)
- Implemented database tracking models for recording student export actions and custom test additions.

---

## 3. Key Deliverables & Artifacts
- Interactive Pytest Terminal Console (`src/components/TerminalConsole.tsx`).
- FastAPI Schemas & Architecture Viewer (`src/components/FastApiModal.tsx`).
- Assignment Rubric Modal (`src/components/RubricInfoModal.tsx`).
- Custom test creation workflow (`src/components/CustomTestModal.tsx`).
- Complete Pytest export functionality (`test_assignment.py`).

---

## 4. Challenges & Mitigations
- **Challenge:** Formatting long multi-line Python tracebacks in a compact card UI.  
  *Mitigation:* Placed concise error summaries in the primary card view while providing an expandable, monospace traceback drawer for full diagnostic inspection.
- **Challenge:** Maintaining client-side test list reactivity when editing individual test asserts.  
  *Mitigation:* Added inline editing capabilities directly on each test card (`onUpdateTestCode`) allowing students to adjust test assertions on the fly.

---

## 5. Next Week Plan (Week 07)
- Perform comprehensive end-to-end stress testing.
- Test edge cases across diverse student algorithms (graphs, DP, string manipulation).
- Validate infinite loop timeout triggers and security guardrails.
