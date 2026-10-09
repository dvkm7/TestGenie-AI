# Week 01 Report: Project Inception & Requirements Engineering
**Course:** BITS Pilani - ZC229T  
**Project:** TestGenie - AI-Powered Test Case Generator for Student Coding Assignments  
**Timeline:** Week 1  
**Status:** Completed  

---

## 1. Objectives & Overview
The primary goal for Week 1 was to formalize the problem statement, define pedagogical goals for automated test generation in student programming assignments, establish team communication channels, and design the high-level system architecture across AI, backend, frontend, execution sandboxing, and persistence layers.

### Problem Context
Introductory and intermediate computer science students frequently struggle with writing exhaustive unit tests, especially around boundary conditions and edge cases (e.g., empty collections, singleton lists, zero boundaries, off-by-one errors). TestGenie was conceived to help students iteratively validate their algorithmic code against structured test suites prior to final assignment submission.

---

## 2. Team Member Task Breakdown

### **Shivansh Shrivastava (AI Architecture)**
- Formulated the core AI architecture and token budgeting for LLM-based unit test generation.
- Researched Gemini model capabilities for Python code comprehension and partition testing synthesis.
- Designed the initial prompt engineering taxonomy: separating test cases into Normal (happy path), Boundary (extremities), and Edge (pathological) classes.
- Established JSON output schemas and fallback parsing strategies for handling varied model completion formats.

### **Niharika Sharma (Backend Core)**
- Formulated the backend architecture and REST endpoint topology using FastAPI.
- Designed the API contract linking client requests with the AI orchestrator and execution runner.
- Researched FastAPI middleware requirements for CORS handling, request body validation, and error interceptors.
- Outlined router structures for `/api/generate-tests`, `/api/execute-tests`, and `/api/health`.

### **Munagala Sreedivya (Frontend Engineering)**
- Created low-fidelity wireframes and interface prototypes for the student IDE studio.
- Researched Monaco / web code editor integration for Python syntax highlighting and line numbers.
- Designed the split-screen layout: left panel for student Python code and problem context; right panel for categorized test cards.
- Established Tailwind CSS design tokens, typography (`Fira Code` + `Inter`), and dark-mode themes.

### **Oviyaa D (Sandboxed Execution)**
- Researched secure Python code execution sandboxes, process isolation, and security constraints.
- Surveyed automated grading sandboxes (GradeScope, Web-CAT) for subprocess isolation best practices.
- Formulated execution watchguard constraints: 5-second hard timeout, CPU throttling, and `SIGKILL` termination against infinite loops.
- Outlined the Python runner script architecture (`runner.py`) for clean namespace separation.

### **Abinaya B (Database Persistence)**
- Designed the relational persistence architecture using SQLite and SQLAlchemy ORM.
- Modeled database entities for student assignment submissions, test suite runs, and execution history.
- Analyzed BITS Pilani ZC229T grading rubrics and identified metrics to track: pass rate percentages, execution durations, and test coverage ratios.
- Drafted database schema specifications for recording test execution benchmark logs.

---

## 3. Key Deliverables & Artifacts
- Project Charter & Requirements Specification Document.
- AI Prompt Architecture & Taxonomy Draft.
- FastAPI REST Route Specification.
- Low-fidelity UI Wireframes & Monaco layout mockups.
- Subprocess Execution Sandbox Security Specifications.
- SQLite Relational Schema ER Diagram draft.

---

## 4. Challenges & Mitigations
- **Challenge:** Preventing malicious or runaway student code execution in the runner.  
  *Mitigation:* Established strict subprocess isolation with a 5-second hard timeout and standard I/O redirection.
- **Challenge:** Ensuring consistent JSON responses from LLM test generation.  
  *Mitigation:* Designed structured schema contracts with strict parsing and fallback logic.

---

## 5. Next Week Plan (Week 02)
- Finalize FastAPI REST routes and Pydantic V2 schemas.
- Implement SQLAlchemy ORM models and SQLite persistence tables.
- Prototype the React UI layout and code editor components.
- Implement initial subprocess execution scripts with timeout controls.
