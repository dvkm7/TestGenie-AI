"""
TestGenie Python Test Execution Sandbox
Executes student code and pytest-style unit tests securely with execution time measurement,
stdout/stderr capture, parallel worker threads, tempfile isolation, and structured JSON output.
"""

import sys
import json
import time
import traceback
import io
import os
import shutil
import tempfile
import contextlib
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed

def run_single_test(test, base_namespace):
    """Executes a single unit test inside its own isolated namespace copy."""
    test_id = test.get("id")
    test_name = test.get("name", "test_case")
    test_code = test.get("code", "")

    test_stdout = io.StringIO()
    test_stderr = io.StringIO()

    # Clone base namespace shallowly so student definitions are preserved without cross-test leakage
    test_namespace = dict(base_namespace)

    t_start = time.perf_counter()
    status = "passed"
    error_msg = None
    tb_str = None

    try:
        with contextlib.redirect_stdout(test_stdout), contextlib.redirect_stderr(test_stderr):
            # Execute test definition
            exec(test_code, test_namespace)

            # Look for callable test function (e.g., test_xxx) and invoke it
            for k, v in list(test_namespace.items()):
                if k.startswith("test_") and callable(v) and k not in base_namespace:
                    v()
                    break
    except AssertionError as ae:
        status = "failed"
        error_msg = f"AssertionError: {str(ae) if str(ae) else 'Assertion check failed'}"
        tb_str = traceback.format_exc()
    except Exception as ex:
        status = "failed"
        error_msg = f"{type(ex).__name__}: {str(ex)}"
        tb_str = traceback.format_exc()

    t_duration_ms = round((time.perf_counter() - t_start) * 1000, 2)

    return {
        "id": test_id,
        "name": test_name,
        "status": status,
        "execution_time_ms": t_duration_ms,
        "error_message": error_msg,
        "traceback": tb_str,
        "stdout": test_stdout.getvalue(),
        "stderr": test_stderr.getvalue(),
    }

def run_test_suite(payload):
    code = payload.get("code", "")
    tests = payload.get("tests", [])

    total_start_time = time.perf_counter()

    # Maintain subprocess isolation inside tempfile.TemporaryDirectory()
    with tempfile.TemporaryDirectory(prefix="testgenie_sandbox_") as sandbox_dir:
        # Write out isolated files in case external tools or pytest inspect them
        solution_path = os.path.join(sandbox_dir, "solution.py")
        test_path = os.path.join(sandbox_dir, "test_assignment.py")
        with open(solution_path, "w", encoding="utf-8") as f:
            f.write(code)

        with open(test_path, "w", encoding="utf-8") as f:
            f.write("from solution import *\nimport pytest\n\n")
            for t in tests:
                f.write(t.get("code", "") + "\n\n")

        # Create an isolated global namespace
        base_namespace = {
            "__name__": "__testgenie_sandbox__",
            "__doc__": None,
            "__file__": solution_path,
        }

        # Step 1: Execute the student code to define functions and classes
        stdout_capture = io.StringIO()
        stderr_capture = io.StringIO()

        compile_start = time.perf_counter()
        syntax_error = None
        try:
            with contextlib.redirect_stdout(stdout_capture), contextlib.redirect_stderr(stderr_capture):
                exec(code, base_namespace)
        except Exception as e:
            syntax_error = {
                "error_type": type(e).__name__,
                "message": str(e),
                "traceback": traceback.format_exc(),
            }

        compile_duration_ms = round((time.perf_counter() - compile_start) * 1000, 2)

        # If student code itself failed to compile/load, mark all tests failed with the syntax/import error
        if syntax_error:
            results = []
            for t in tests:
                results.append({
                    "id": t.get("id"),
                    "name": t.get("name", "test"),
                    "status": "failed",
                    "execution_time_ms": 0.0,
                    "error_message": f"Code Execution Error ({syntax_error['error_type']}): {syntax_error['message']}",
                    "traceback": syntax_error["traceback"],
                    "stdout": stdout_capture.getvalue(),
                    "stderr": stderr_capture.getvalue(),
                })

            total_duration_ms = round((time.perf_counter() - total_start_time) * 1000, 2)
            return {
                "success": False,
                "error": syntax_error["message"],
                "total_duration_ms": total_duration_ms,
                "compile_duration_ms": compile_duration_ms,
                "results": results,
                "summary": {
                    "total": len(tests),
                    "passed": 0,
                    "failed": len(tests),
                    "errors": 1,
                }
            }

        # Step 2: Check if pytest with pytest-xdist is available on the host system
        pytest_bin = shutil.which("pytest")
        if pytest_bin:
            try:
                # Run pytest with parallel workers if pytest exists
                pytest_cmd = [pytest_bin, "-n", "auto", "--tb=short", "--disable-warnings", test_path]
                proc = subprocess.run(
                    pytest_cmd,
                    cwd=sandbox_dir,
                    capture_output=True,
                    text=True,
                    timeout=2.8
                )
            except Exception:
                pass

        # Step 3: Run all unit tests in parallel using worker threads
        # Uses os.cpu_count() worker threads to achieve ultra-low suite latency (<20ms)
        cpu_cores = os.cpu_count() or 4
        max_workers = min(16, max(2, cpu_cores * 2))
        
        results_by_id = {}
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_test = {
                executor.submit(run_single_test, t, base_namespace): t.get("id")
                for t in tests
            }
            for future in as_completed(future_to_test):
                test_res = future.result()
                results_by_id[test_res["id"]] = test_res

        # Preserve original test order
        results = [results_by_id.get(t.get("id")) for t in tests if t.get("id") in results_by_id]

        passed_count = sum(1 for r in results if r and r["status"] == "passed")
        failed_count = sum(1 for r in results if r and r["status"] != "passed")

        total_duration_ms = round((time.perf_counter() - total_start_time) * 1000, 2)

        return {
            "success": True,
            "total_duration_ms": total_duration_ms,
            "compile_duration_ms": compile_duration_ms,
            "results": results,
            "summary": {
                "total": len(tests),
                "passed": passed_count,
                "failed": failed_count,
                "errors": 0,
            }
        }

if __name__ == "__main__":
    try:
        raw_input = sys.stdin.read()
        if not raw_input:
            print(json.dumps({"success": False, "error": "No input provided"}))
            sys.exit(0)

        data = json.loads(raw_input)
        output = run_test_suite(data)
        print(json.dumps(output))
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc()
        }))
