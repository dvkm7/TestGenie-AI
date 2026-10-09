"""
TestGenie Python Test Execution Sandbox
Executes student code and pytest-style unit tests securely with execution time measurement,
stdout/stderr capture, and structured JSON output.
"""

import sys
import json
import time
import traceback
import io
import contextlib

def run_test_suite(payload):
    code = payload.get("code", "")
    tests = payload.get("tests", [])

    results = []
    total_start_time = time.perf_counter()

    # Create an isolated global namespace
    base_namespace = {
        "__name__": "__testgenie_sandbox__",
        "__doc__": None,
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

    # Step 2: Run each test individually with execution isolation and timing
    passed_count = 0
    failed_count = 0

    for t in tests:
        test_id = t.get("id")
        test_name = t.get("name", "test_case")
        test_code = t.get("code", "")

        test_stdout = io.StringIO()
        test_stderr = io.StringIO()

        # Clone namespace shallowly so student definitions are preserved
        test_namespace = dict(base_namespace)

        t_start = time.perf_counter()
        status = "passed"
        error_msg = None
        tb_str = None

        try:
            with contextlib.redirect_stdout(test_stdout), contextlib.redirect_stderr(test_stderr):
                # Execute test definition
                exec(test_code, test_namespace)

                # Look for callable test function (e.g., test_xxx) or run statements
                # If the test code defined a function starting with test_, invoke it
                ran_func = False
                for k, v in list(test_namespace.items()):
                    if k.startswith("test_") and callable(v) and k not in base_namespace:
                        v()
                        ran_func = True
                        break

                # If no test function was defined, but there are direct asserts executed, that's already completed.
        except AssertionError as ae:
            status = "failed"
            error_msg = f"AssertionError: {str(ae) if str(ae) else 'Assertion check failed'}"
            tb_str = traceback.format_exc()
            failed_count += 1
        except Exception as ex:
            status = "failed"
            error_msg = f"{type(ex).__name__}: {str(ex)}"
            tb_str = traceback.format_exc()
            failed_count += 1
        else:
            passed_count += 1

        t_duration_ms = round((time.perf_counter() - t_start) * 1000, 2)

        results.append({
            "id": test_id,
            "name": test_name,
            "status": status,
            "execution_time_ms": t_duration_ms,
            "error_message": error_msg,
            "traceback": tb_str,
            "stdout": test_stdout.getvalue(),
            "stderr": test_stderr.getvalue(),
        })

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
