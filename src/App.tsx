/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { TestResultsPanel } from './components/TestResultsPanel';
import { TerminalConsole } from './components/TerminalConsole';
import { FastApiModal } from './components/FastApiModal';
import { RubricInfoModal } from './components/RubricInfoModal';
import { CustomTestModal } from './components/CustomTestModal';
import { PRESETS } from './data/presets';
import { TestCase, SingleTestResult, TestCategory, CodePreset, ExecutionSummary } from './types';
import { AlertCircle, CheckCircle2, Sparkles, Terminal } from 'lucide-react';

export default function App() {
  // Preload binary_search preset on first load
  const [currentPreset, setCurrentPreset] = useState<CodePreset>(PRESETS[0]);
  const [code, setCode] = useState<string>(PRESETS[0].code);
  const [context, setContext] = useState<string>(PRESETS[0].context);
  const [tests, setTests] = useState<TestCase[]>(PRESETS[0].defaultTests);

  // Execution states
  const [results, setResults] = useState<Record<string, SingleTestResult>>({});
  const [runningTestIds, setRunningTestIds] = useState<Set<string>>(new Set());
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBuggyActive, setIsBuggyActive] = useState(false);

  // Summary and terminal
  const [summary, setSummary] = useState<ExecutionSummary | undefined>(undefined);
  const [totalDurationMs, setTotalDurationMs] = useState<number | undefined>(undefined);
  const [terminalOutput, setTerminalOutput] = useState<string>(
    `============================= test session starts =============================
platform linux -- Python 3.10.12, pytest-runner-sandbox
rootdir: /testgenie/sandbox (BITS Pilani ZC229T Project)
collected ${PRESETS[0].defaultTests.length} items from binary_search assignment

Ready to execute unit tests. Click "Run All" or execute individual test cards.
`
  );

  // Modals & Notifications
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);
  const [isRubricModalOpen, setIsRubricModalOpen] = useState(false);
  const [isCustomTestModalOpen, setIsCustomTestModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Switch preset
  const handleSelectPreset = (preset: CodePreset) => {
    setCurrentPreset(preset);
    setCode(preset.code);
    setContext(preset.context);
    setTests(preset.defaultTests);
    setResults({});
    setIsBuggyActive(false);
    setSummary(undefined);
    setTotalDurationMs(undefined);
    setTerminalOutput(
      `============================= test session starts =============================
platform linux -- Python 3.10.12, pytest-runner-sandbox
rootdir: /testgenie/sandbox (${preset.title})
collected ${preset.defaultTests.length} items

Ready to execute test suite. Click "Run All" to begin.
`
    );
    showToast(`Switched to "${preset.title}" preset with ${preset.defaultTests.length} test cases`, 'info');
  };

  // Reset code to original preset code
  const handleResetCode = () => {
    setCode(currentPreset.code);
    setIsBuggyActive(false);
    showToast('Student code reset to default template', 'info');
  };

  // Toggle intentional buggy code to test failures
  const handleToggleBuggy = () => {
    if (!currentPreset.buggyCode) return;
    if (isBuggyActive) {
      setCode(currentPreset.code);
      setIsBuggyActive(false);
      showToast('Restored clean implementation', 'info');
    } else {
      setCode(currentPreset.buggyCode);
      setIsBuggyActive(true);
      showToast('Inserted buggy implementation with boundary logic error!', 'error');
    }
  };

  // Execute all tests
  const handleRunAll = async () => {
    if (tests.length === 0 || isRunningAll) return;

    setIsRunningAll(true);
    setRunningTestIds(new Set(tests.map((t) => t.id)));

    try {
      const response = await fetch('/api/execute-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          tests: tests.map((t) => ({
            id: t.id,
            name: t.name,
            code: t.code,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data) {
        throw new Error(data?.error || 'Execution failed');
      }

      const newResultsMap: Record<string, SingleTestResult> = {};
      (data.results || []).forEach((r: SingleTestResult) => {
        newResultsMap[r.id] = r;
      });

      setResults(newResultsMap);
      setSummary(data.summary);
      setTotalDurationMs(data.total_duration_ms);
      if (data.raw_terminal_output) {
        setTerminalOutput(data.raw_terminal_output);
      }

      if (data.summary) {
        if (data.summary.failed === 0) {
          showToast(
            `All ${data.summary.total} tests passed! (${data.total_duration_ms.toFixed(2)}ms)`,
            'success'
          );
        } else {
          showToast(
            `${data.summary.passed}/${data.summary.total} tests passed. ${data.summary.failed} failed.`,
            'error'
          );
        }
      }
    } catch (err: any) {
      console.error('Error running test suite:', err);
      setTerminalOutput((prev) => `${prev}\n\n[ERROR] Execution failed: ${err.message}`);
      showToast(`Execution error: ${err.message}`, 'error');
    } finally {
      setIsRunningAll(false);
      setRunningTestIds(new Set());
    }
  };

  // Run a single test case
  const handleRunSingle = async (test: TestCase) => {
    setRunningTestIds((prev) => new Set(prev).add(test.id));

    try {
      const response = await fetch('/api/execute-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          tests: [{ id: test.id, name: test.name, code: test.code }],
        }),
      });

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const singleRes = data.results[0];
        setResults((prev) => ({
          ...prev,
          [test.id]: singleRes,
        }));

        const statusText = singleRes.status === 'passed' ? 'PASSED ✓' : 'FAILED ✗';
        const line = `test_assignment.py::${test.name} ${statusText} [${singleRes.execution_time_ms}ms]`;
        setTerminalOutput((prev) => `${prev}\n${line}`);

        if (singleRes.status === 'passed') {
          showToast(`${test.name} passed in ${singleRes.execution_time_ms}ms`, 'success');
        } else {
          showToast(`${test.name} failed: ${singleRes.error_message || 'Assertion error'}`, 'error');
        }
      }
    } catch (err: any) {
      showToast(`Error running test: ${err.message}`, 'error');
    } finally {
      setRunningTestIds((prev) => {
        const updated = new Set(prev);
        updated.delete(test.id);
        return updated;
      });
    }
  };

  // AI Test Generation
  const handleGenerateTests = async (selectedCategories: TestCategory[]) => {
    if (!code.trim() || isGenerating) return;

    setIsGenerating(true);
    showToast('Gemini 3.8 Flash is generating categorized unit tests...', 'info');

    try {
      const response = await fetch('/api/generate-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          context,
          categories: selectedCategories,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate tests');
      }

      if (data.tests && data.tests.length > 0) {
        setTests(data.tests);
        setResults({});
        setSummary(undefined);
        setTotalDurationMs(undefined);

        const breakdown = data.categories_breakdown || {};
        const breakdownStr = Object.entries(breakdown)
          .map(([k, v]) => `${v} ${k}`)
          .join(', ');

        setTerminalOutput(
          `============================= test session starts =============================
platform linux -- Python 3.10.12, pytest-runner-sandbox
AI Synthesizer: Generated ${data.tests.length} tests (${breakdownStr})
Target: ${data.targeted_function || 'student_solution'}
Summary: ${data.summary}

Click "Run All" or hit any individual test card to execute.
`
        );

        showToast(
          `Generated ${data.tests.length} unit tests (${breakdownStr})`,
          'success'
        );
      }
    } catch (err: any) {
      console.error('Error generating tests:', err);
      showToast(`Generation failed: ${err.message}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Update a test's code inline
  const handleUpdateTestCode = (testId: string, newCode: string) => {
    setTests((prev) =>
      prev.map((t) => (t.id === testId ? { ...t, code: newCode } : t))
    );
    showToast('Test code updated', 'info');
  };

  // Add custom test case
  const handleAddCustomTest = (newTest: TestCase) => {
    setTests((prev) => [newTest, ...prev]);
    showToast(`Added custom test "${newTest.name}"`, 'success');
  };

  // Download entire test file (.py)
  const handleDownloadPytest = () => {
    const content = `# ==============================================================================
# TestGenie - BITS Pilani ZC229T Project
# Auto-generated Pytest Test Suite
# Run locally with: pytest test_assignment.py -v
# ==============================================================================

import pytest

# Student Solution Implementation:
${code}

# ==============================================================================
# CATEGORIZED UNIT TESTS: NORMAL, BOUNDARY, EDGE
# ==============================================================================

${tests.map((t) => `# [Category: ${t.category}] - ${t.description}\n${t.code}`).join('\n\n')}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'test_assignment.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded test_assignment.py for local execution', 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md text-xs font-medium border animate-in fade-in slide-in-from-top-4 duration-200 bg-slate-900/95 border-slate-700 text-slate-100">
          {toastMessage.type === 'success' && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          )}
          {toastMessage.type === 'error' && (
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          )}
          {toastMessage.type === 'info' && (
            <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <Header
        currentPresetId={currentPreset.id}
        onSelectPreset={handleSelectPreset}
        onOpenSpecsModal={() => setIsSpecsModalOpen(true)}
        onOpenRubricModal={() => setIsRubricModalOpen(true)}
        onDownloadPytest={handleDownloadPytest}
        onResetCode={handleResetCode}
        isRunningAll={isRunningAll}
        onRunAll={handleRunAll}
        testsCount={tests.length}
      />

      {/* Main Split Screen Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 lg:p-6 flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
          {/* Left Panel: Python Code Editor & Assignment Context (5 cols on lg) */}
          <div className="lg:col-span-5 h-[620px] lg:h-[720px] flex flex-col">
            <CodeEditor
              code={code}
              setCode={setCode}
              context={context}
              setContext={setContext}
              onGenerateTests={handleGenerateTests}
              isGenerating={isGenerating}
              hasBuggyOption={Boolean(currentPreset.buggyCode)}
              isBuggyActive={isBuggyActive}
              onToggleBuggy={handleToggleBuggy}
              onResetToDefault={handleResetCode}
            />
          </div>

          {/* Right Panel: Categorized Test Suite & Runner (7 cols on lg) */}
          <div className="lg:col-span-7 h-[620px] lg:h-[720px] flex flex-col">
            <TestResultsPanel
              tests={tests}
              results={results}
              isRunningAll={isRunningAll}
              runningTestIds={runningTestIds}
              onRunAll={handleRunAll}
              onRunSingle={handleRunSingle}
              onAddCustomTest={() => setIsCustomTestModalOpen(true)}
              onUpdateTestCode={handleUpdateTestCode}
              onDownloadPytest={handleDownloadPytest}
              summary={summary}
              totalDurationMs={totalDurationMs}
              testSuiteTitle={currentPreset.title}
              isGenerating={isGenerating}
            />
          </div>
        </div>

        {/* Bottom Panel: Interactive Pytest Terminal Console */}
        <div className="rounded-xl overflow-hidden shadow-xl border border-slate-800">
          <TerminalConsole
            output={terminalOutput}
            onClear={() => setTerminalOutput('')}
            isRunning={isRunningAll || runningTestIds.size > 0}
            totalDurationMs={totalDurationMs}
          />
        </div>
      </main>

      {/* Modals */}
      <FastApiModal
        isOpen={isSpecsModalOpen}
        onClose={() => setIsSpecsModalOpen(false)}
        tests={tests}
        studentCode={code}
      />

      <RubricInfoModal
        isOpen={isRubricModalOpen}
        onClose={() => setIsRubricModalOpen(false)}
      />

      <CustomTestModal
        isOpen={isCustomTestModalOpen}
        onClose={() => setIsCustomTestModalOpen(false)}
        onAddTest={handleAddCustomTest}
        defaultFunctionName={
          code.match(/def\s+([a-zA-Z0-9_]+)/)?.[1] || 'binary_search'
        }
      />
    </div>
  );
}
