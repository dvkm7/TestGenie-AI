# Week 07 Report: System Testing, Edge-Case Stress Testing & Verification
**Course:** BITS Pilani - ZC229T  
**Project:** TestGenie - AI-Powered Test Case Generator for Student Coding Assignments  
**Timeline:** Week 7  
**Status:** Completed  

---

## 1. Objectives & Overview
Week 7 was focused on rigorous validation, quality assurance, performance benchmarking, and edge-case stress testing across multiple algorithmic domains. The team verified that TestGenie reliably catches common student logical flaws while protecting the hosting environment from timeouts and runaway code.

---

## 2. Team Member Task Breakdown

### **Shivansh Shrivastava (AI Architecture)**
- Tested AI test generation across 15+ student coding assignment problems:
  - Binary Search, Quickselect, Merge Intervals
  - Valid Parentheses, Longest Common Subsequence
  - Two Sum, Linked List reversal, Binary Tree Traversals
- Verified that Gemini consistently allocates test cases across all three categories (at least 2 Normal, 2 Boundary, 2 Edge) with 100% adherence.
- Evaluated token consumption efficiency and confirmed average generation time stays under 2.5 seconds.

### **Niharika Sharma (Backend Core)**
- Conducted full-suite end-to-end integration tests between the frontend client, Express API routes, Gemini AI generation pipeline, and Python sandbox.
- Stress-tested concurrent execution requests to verify subprocess resource cleanup.
- Verified that health checks (`/api/health`) consistently report Python runtime availability and model readiness.

### **Munagala Sreedivya (Frontend Engineering)**
- Audited responsive layouts across tablet and mobile viewports.
- Tested dark-mode color contrast ratios to meet WCAG AA accessibility standards.
- Refined notification toasts to ensure informative, non-intrusive feedback during test execution and generation events.
- Tested Monaco and code editor rendering performance under rapid code pasting and editing.

### **Oviyaa D (Sandboxed Execution)**
- Executed edge-case testing matrix covering:
  - Infinite recursion (`def f(): return f()`)
  - Infinite loops (`while True: pass`)
  - Large arrays (`[0] * 100000`)
  - Non-standard input types and unexpected exceptions (`TypeError`, `ZeroDivisionError`)
- Verified that the 5-second timeout reliably kills the subprocess and reports the `timed_out` state without crashing the server.
- Measured execution latency: typical test suite execution duration averaged under 0.5 milliseconds for standard arrays.

### **Abinaya B (Database Persistence)**
- Validated output compliance against BITS Pilani ZC229T evaluation rubrics.
- Conducted data integrity tests on SQLite database models under rapid test execution cycles.
- Audited all API payloads against the Pydantic schemas in `backend/schemas.py`.
- Formulated the historical metrics aggregation queries to compute overall student pass rates.

---

## 3. Key Deliverables & Artifacts
- Edge-case testing report and verification matrix.
- Timeout & infinite-loop safeguard validation log (5-second timeout confirmed).
- Performance latency benchmark report (sub-millisecond test execution verified).
- Cross-browser and responsive layout audit documentation.
- Database stress test integrity log.

---

## 4. Challenges & Mitigations
- **Challenge:** High latency when generating tests for complex, multi-function student submissions.  
  *Mitigation:* Optimized the Gemini system prompt to focus synthesis on the primary entry point function while keeping auxiliary helper functions in scope.
- **Challenge:** Handling student code that attempts network or filesystem I/O.  
  *Mitigation:* Documented sandbox boundaries and confirmed standard library isolation in `runner.py`.

---

## 5. Next Week Plan (Week 08)
- Complete comprehensive project documentation and README.md.
- Package weekly reports (Week 01 through Week 08) into `docs/weekly_reports/`.
- Prepare final demonstration for BITS Pilani ZC229T project presentation.
