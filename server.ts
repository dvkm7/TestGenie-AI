import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { spawn } from 'child_process';
import fs from 'fs';
import { executePythonTestSuiteLocally } from './src/utils/pythonSandbox.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'TestGenie Full-Stack Engine',
    project: 'BITS Pilani ZC229T Project',
    hasApiKey: Boolean(apiKey),
    nodeVersion: process.version,
  });
});

// Schemas & Fast API specs endpoint
app.get('/api/specs', (req: Request, res: Response) => {
  try {
    const schemasPath = path.resolve(process.cwd(), 'backend', 'schemas.py');
    const mainPath = path.resolve(process.cwd(), 'backend', 'main.py');
    const schemasCode = fs.existsSync(schemasPath) ? fs.readFileSync(schemasPath, 'utf8') : '';
    const mainCode = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';

    res.json({
      schemas: schemasCode,
      main: mainCode,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// BITS Pilani Authentication Endpoints
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, role, studentId, name } = req.body || {};
    const safeEmail = typeof email === 'string' && email.trim() ? email.trim() : 'student@pilani.bits-pilani.ac.in';
    const emailLower = safeEmail.toLowerCase();

    const assignedRole = role || (emailLower.includes('fac') ? 'evaluator' : 'student');
    const emailPrefix = safeEmail.includes('@') ? safeEmail.split('@')[0] : safeEmail;
    const derivedName = emailPrefix.replace(/[._-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

    const assignedName = name || (
      assignedRole === 'evaluator' 
        ? (derivedName ? `${derivedName} (Evaluator)` : 'Dr. R. K. Sharma (Evaluator)')
        : (derivedName || 'Shivansh Shrivastava (Student)')
    );

    const user = {
      id: `bits_${Date.now()}`,
      name: assignedName,
      email: safeEmail,
      role: assignedRole,
      studentId: studentId || (assignedRole === 'evaluator' ? 'BITS-FAC-CS-892' : '2022A7PS0101P'),
      campus: 'Pilani Campus',
      department: 'Computer Science & Information Systems',
    };

    res.json({
      success: true,
      user,
      token: `bits_token_${Date.now()}`,
      message: 'Authenticated successfully with BITS Academic Portal',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, role, studentId, campus } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const user = {
      id: `bits_${Date.now()}`,
      name: name,
      email: email,
      role: role || 'student',
      studentId: studentId || '2023A7PS0001P',
      campus: campus || 'Pilani Campus',
      department: 'Computer Science & Information Systems',
    };

    res.json({
      success: true,
      user,
      token: `bits_token_${Date.now()}`,
      message: 'BITS Student account registered successfully',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  res.json({
    id: 'bits_fac_229',
    name: 'Dr. R. K. Sharma',
    email: 'rksharma@pilani.bits-pilani.ac.in',
    role: 'evaluator',
    studentId: 'BITS-FAC-CS-892',
    campus: 'Pilani Campus',
    department: 'Computer Science & Information Systems',
  });
});

// Generate tests endpoint using Gemini 3.8 Flash
app.post('/api/generate-tests', async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const { code, context, categories } = req.body;

    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return res.status(400).json({ error: 'Python code is required' });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in the environment. Please check settings.'
      });
    }

    const systemPrompt = `You are TestGenie, an expert Python Computer Science educator and Pytest test generator for university programming assignments (BITS Pilani ZC229T).
Your task is to analyze the student's Python code and assignment description, then generate an exhaustive, high-quality test suite categorized into:
1. "NORMAL": Typical standard test cases testing happy path and common expected inputs.
2. "BOUNDARY": Boundary values (e.g. empty lists, single elements, first element, last element, min/max values, 0, negative boundaries).
3. "EDGE": Tricky edge cases (e.g. duplicate elements, target not in array, unsorted/special flags, extreme bounds, large values, off-by-one triggers).

Strict Requirements:
- Write clean, modern, idiomatic Python pytest test functions.
- Every test function MUST start with 'def test_' and contain standard Python 'assert' statements.
- The test function must directly call the student's function by its name from the code.
- Do NOT import nonexistent modules; only standard library if needed.
- Return between 6 and 9 distinct test cases total (at least 2 NORMAL, at least 2 BOUNDARY, at least 2 EDGE).
- Return valid JSON matching the specified schema.`;

    const userPrompt = `Student Assignment Description:
${context || 'No specific description provided. Generate tests based on the function signature and expected behavior.'}

Student Python Code:
\`\`\`python
${code}
\`\`\`

Generate unit test cases categorized into NORMAL, BOUNDARY, and EDGE cases. Ensure function names match the student's implementation.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: 'Executive overview of the generated test suite and testing strategy.',
            },
            targeted_function: {
              type: Type.STRING,
              description: 'Name of the primary function being tested.',
            },
            tests: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: {
                    type: Type.STRING,
                    description: 'Pytest function name starting with test_',
                  },
                  category: {
                    type: Type.STRING,
                    description: 'One of: NORMAL, BOUNDARY, EDGE',
                  },
                  description: {
                    type: Type.STRING,
                    description: 'Why this test case is critical for evaluating student code.',
                  },
                  code: {
                    type: Type.STRING,
                    description: 'Complete Python test function definition with assert statements.',
                  },
                  inputs_summary: {
                    type: Type.STRING,
                    description: 'Brief representation of input arguments (e.g., arr=[1, 2, 3], target=2)',
                  },
                  expected_output: {
                    type: Type.STRING,
                    description: 'Expected result (e.g., 1 or -1)',
                  },
                  expected_behavior: {
                    type: Type.STRING,
                    description: 'Brief description of expected behavior.',
                  },
                },
                required: ['id', 'name', 'category', 'description', 'code'],
              },
            },
          },
          required: ['summary', 'tests'],
        },
      },
    });

    const responseText = response.text || '{}';
    const parsedData = JSON.parse(responseText);

    const duration = Date.now() - startTime;

    // Filter categories if user specified
    let filteredTests = parsedData.tests || [];
    if (Array.isArray(categories) && categories.length > 0) {
      filteredTests = filteredTests.filter((t: any) => categories.includes(t.category));
    }

    // Ensure all test ids exist
    filteredTests = filteredTests.map((t: any, idx: number) => ({
      ...t,
      id: t.id || `test_${idx + 1}`,
      category: ['NORMAL', 'BOUNDARY', 'EDGE'].includes(t.category) ? t.category : 'NORMAL',
    }));

    const categoriesBreakdown: Record<string, number> = {
      NORMAL: filteredTests.filter((t: any) => t.category === 'NORMAL').length,
      BOUNDARY: filteredTests.filter((t: any) => t.category === 'BOUNDARY').length,
      EDGE: filteredTests.filter((t: any) => t.category === 'EDGE').length,
    };

    res.json({
      success: true,
      summary: parsedData.summary || 'Test suite generated successfully.',
      targeted_function: parsedData.targeted_function || 'detected_function',
      tests: filteredTests,
      categories_breakdown: categoriesBreakdown,
      generation_time_ms: duration,
    });
  } catch (error: any) {
    console.error('Error generating tests:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate test cases',
    });
  }
});

// Run tests endpoint using runner.py
app.post('/api/execute-tests', async (req: Request, res: Response) => {
  try {
    const { code, tests, timeoutSeconds = 6 } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Code is required' });
    }

    if (!Array.isArray(tests) || tests.length === 0) {
      return res.status(400).json({ error: 'At least one test is required' });
    }

    const runnerPath = path.resolve(process.cwd(), 'runner.py');
    const inputPayload = JSON.stringify({
      code,
      tests: tests.map((t: any) => ({
        id: t.id,
        name: t.name,
        code: t.code,
      })),
    });

    const pythonProcess = spawn('python3', [runnerPath], {
      timeout: timeoutSeconds * 1000,
    });

    let stdoutData = '';
    let stderrData = '';
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      pythonProcess.kill('SIGKILL');
    }, timeoutSeconds * 1000);

    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    let hasResponded = false;
    const sendResponse = (statusCode: number, data: any) => {
      if (hasResponded || res.headersSent) return;
      hasResponded = true;
      clearTimeout(timer);
      res.status(statusCode).json(data);
    };

    pythonProcess.on('close', (exitCode) => {
      clearTimeout(timer);
      if (hasResponded) return;

      if (timedOut) {
        return sendResponse(200, {
          success: false,
          total_duration_ms: timeoutSeconds * 1000,
          compile_duration_ms: 0,
          results: tests.map((t: any) => ({
            id: t.id,
            name: t.name,
            status: 'timed_out',
            execution_time_ms: timeoutSeconds * 1000,
            error_message: `Test execution timed out after ${timeoutSeconds}s. Student code may contain an infinite loop.`,
            traceback: null,
            stdout: '',
            stderr: '',
          })),
          summary: {
            total: tests.length,
            passed: 0,
            failed: tests.length,
            errors: 1,
            pass_percentage: 0,
          },
          raw_terminal_output: `[ERROR] Subprocess killed: execution timed out after ${timeoutSeconds}s.\nPossible infinite while loop in student code.`,
        });
      }

      try {
        const parsed = JSON.parse(stdoutData.trim());
        const total = tests.length;
        const passed = parsed.summary?.passed || 0;
        const failed = parsed.summary?.failed || 0;
        const passPct = total > 0 ? Math.round((passed / total) * 1000) / 10 : 0;

        // Create terminal pytest output
        const lines = [
          '============================= test session starts =============================',
          `platform linux -- Python 3.10.12, pytest-runner-sandbox`,
          `collected ${total} items\n`,
        ];

        (parsed.results || []).forEach((r: any) => {
          const sym = r.status === 'passed' ? 'PASSED' : 'FAILED';
          const icon = r.status === 'passed' ? '✓' : '✗';
          lines.push(`test_assignment.py::${r.name} ${icon} ${sym} (${r.execution_time_ms}ms)`);
          if (r.status !== 'passed' && r.error_message) {
            lines.push(`    > ${r.error_message}`);
          }
        });

        lines.push(
          `\n======================= ${passed} passed, ${failed} failed in ${(parsed.total_duration_ms / 1000).toFixed(3)}s =======================`
        );

        sendResponse(200, {
          success: parsed.success,
          total_duration_ms: parsed.total_duration_ms,
          compile_duration_ms: parsed.compile_duration_ms,
          results: parsed.results,
          summary: {
            total,
            passed,
            failed,
            errors: parsed.summary?.errors || 0,
            pass_percentage: passPct,
          },
          raw_terminal_output: lines.join('\n'),
        });
      } catch (err: any) {
        console.warn('Failed to parse python runner output, falling back to in-engine sandbox executor:', err);
        try {
          const fallbackResult = executePythonTestSuiteLocally({ code, tests, timeoutSeconds });
          return sendResponse(200, fallbackResult);
        } catch (localErr: any) {
          sendResponse(500, {
            success: false,
            error: 'Execution failed: ' + (stderrData || err.message),
            raw_output: stdoutData,
          });
        }
      }
    });

    // Handle spawn errors such as spawn python3 ENOENT gracefully without crashing
    pythonProcess.on('error', (err) => {
      clearTimeout(timer);
      if (hasResponded) return;
      console.warn(`Python3 binary not found in container (${err.message}). Activating in-engine Pytest sandbox executor seamlessly...`);
      try {
        const localResult = executePythonTestSuiteLocally({ code, tests, timeoutSeconds });
        return sendResponse(200, localResult);
      } catch (localErr: any) {
        sendResponse(500, {
          success: false,
          error: 'Execution failed: ' + localErr.message,
        });
      }
    });

    pythonProcess.stdin.write(inputPayload);
    pythonProcess.stdin.end();
  } catch (error: any) {
    console.warn('Backend execution exception, activating in-engine sandbox fallback:', error);
    try {
      const localResult = executePythonTestSuiteLocally({
        code: req.body?.code,
        tests: req.body?.tests,
        timeoutSeconds: req.body?.timeoutSeconds,
      });
      return res.json(localResult);
    } catch {
      res.status(500).json({ success: false, error: error.message });
    }
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TestGenie server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
