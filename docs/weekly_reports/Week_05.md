# Week 05 Report: Frontend Studio Architecture & Split-Screen Interface
**Course:** BITS Pilani - ZC229T  
**Project:** TestGenie - AI-Powered Test Case Generator for Student Coding Assignments  
**Timeline:** Week 5  
**Status:** Completed  

---

## 1. Objectives & Overview
Week 5 focused on building the primary student-facing user interface in React. We implemented the responsive split-screen studio, the custom Python code editor with line number guttering and 4-space tab indentation, category filtering tabs (ALL, NORMAL, BOUNDARY, EDGE), and the preloaded assignment demonstration for `binary_search`.

---

## 2. Team Member Task Breakdown

### **Shivansh Shrivastava (AI Architecture)**
- Curated the preloaded assignment demonstration data for `binary_search`:
  - 2 Normal cases (middle element, even-length array).
  - 3 Boundary cases (empty array `[]`, single element `[42]`, first/last elements).
  - 3 Edge cases (target outside bounds, negative integers, duplicate elements).
- Structured the educational rationale notes for each preloaded test explaining why BITS Pilani grading rubrics assess these specific conditions.
- Added prompt tuning rules for multi-parameter algorithms (Merge Intervals and Two Sum).

### **Niharika Sharma (Backend Core)**
- Updated `server.ts` with route optimizations for rapid concurrent test execution.
- Added health check metadata reporting active Python version, Gemini API key presence, and server readiness.
- Validated request payloads between React client and FastAPI schema specifications in `backend/schemas.py`.

### **Munagala Sreedivya (Frontend Engineering)**
- Authored `src/components/CodeEditor.tsx`:
  - Integrated dynamic line numbering gutter aligned with textarea line height.
  - Implemented `Tab` key interception to insert 4 spaces for Python indentation.
  - Added an assignment context textarea with a character counter and toggleable rubric guidelines.
- Authored `src/components/TestResultsPanel.tsx`:
  - Implemented the 4-way category filter bar (`ALL`, `NORMAL`, `BOUNDARY`, `EDGE`) with individual badge counts and color accents.
  - Integrated a search bar for instant filtering by test function name or expected values.
  - Built the live pass/fail visual progress bar.

### **Oviyaa D (Sandboxed Execution)**
- Created the "Test with Bug" feature in `src/data/presets.ts`. For `binary_search`, an intentional off-by-one boundary bug (`right = len(arr) - 2`) was introduced so students can immediately observe boundary test failures when running the suite.
- Validated keyboard navigation and accessibility standards for test execution controls.
- Optimized `runner.py` compilation overhead to achieve sub-millisecond execution times.

### **Abinaya B (Database Persistence)**
- Integrated SQLite persistence routines for tracking student preset selections.
- Prepared database seed scripts for standard assignment presets:
  - Binary Search
  - Valid Palindrome
  - Merge Intervals
- Benchmarked database query execution times for fetching past execution history.

---

## 3. Key Deliverables & Artifacts
- Responsive split-screen IDE layout (`src/components/CodeEditor.tsx` & `src/components/TestResultsPanel.tsx`).
- Preloaded `binary_search` algorithm with 8 categorized unit tests ready to run on initial load.
- Tabbed filtering system with live search capability.
- "Test with Bug" demonstration toggle.
- SQLite preset seed datasets.

---

## 4. Challenges & Mitigations
- **Challenge:** Standard browser textarea behavior moves focus on pressing `Tab`.  
  *Mitigation:* Intercepted `onKeyDown` events for `key === 'Tab'`, preventing the default focus shift and programmatically slicing 4 spaces at `selectionStart` while maintaining cursor position.
- **Challenge:** Synchronizing line number scrolling with the textarea.  
  *Mitigation:* Handled line count dynamically based on newline splits, ensuring line numbers remain aligned with editor text height.

---

## 5. Next Week Plan (Week 06)
- Develop the collapsible Pytest Terminal Console reproducing standard CLI output.
- Implement expandable traceback inspection for failed test cases.
- Build the FastAPI Schemas and Pytest file export modals.
