import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Sparkles,
  Download,
  Copy,
  Check,
  Terminal,
  Zap,
  Filter
} from 'lucide-react';
import { TestCase, SingleTestResult, TestCategory, ExecutionSummary } from '../types';
import { TestCard } from './TestCard';

interface TestResultsPanelProps {
  tests: TestCase[];
  results: Record<string, SingleTestResult>;
  isRunningAll: boolean;
  runningTestIds: Set<string>;
  onRunAll: () => void;
  onRunSingle: (test: TestCase) => void;
  onAddCustomTest: () => void;
  onUpdateTestCode: (testId: string, newCode: string) => void;
  onDownloadPytest: () => void;
  summary?: ExecutionSummary;
  totalDurationMs?: number;
  testSuiteTitle?: string;
  isGenerating: boolean;
}

export const TestResultsPanel: React.FC<TestResultsPanelProps> = ({
  tests,
  results,
  isRunningAll,
  runningTestIds,
  onRunAll,
  onRunSingle,
  onAddCustomTest,
  onUpdateTestCode,
  onDownloadPytest,
  summary,
  totalDurationMs,
  testSuiteTitle,
  isGenerating,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | TestCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PASSED' | 'FAILED' | 'PENDING'>('ALL');
  const [copiedAll, setCopiedAll] = useState(false);

  // Filter tests based on active tab, search query, and status
  const filteredTests = tests.filter((t) => {
    // Tab filter
    if (activeTab !== 'ALL' && t.category !== activeTab) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      const res = results[t.id];
      if (statusFilter === 'PASSED' && res?.status !== 'passed') return false;
      if (statusFilter === 'FAILED' && res?.status !== 'failed' && res?.status !== 'error' && res?.status !== 'timed_out') return false;
      if (statusFilter === 'PENDING' && res?.status && res?.status !== 'pending') return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = t.name.toLowerCase().includes(q);
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchCode = t.code.toLowerCase().includes(q);
      return matchName || matchDesc || matchCode;
    }

    return true;
  });

  // Calculate counts per category
  const normalCount = tests.filter((t) => t.category === 'NORMAL').length;
  const boundaryCount = tests.filter((t) => t.category === 'BOUNDARY').length;
  const edgeCount = tests.filter((t) => t.category === 'EDGE').length;

  // Calculate pass rates
  const executedCount = Object.keys(results).length;
  const passedCount = summary
    ? summary.passed
    : Object.values(results).filter((r) => r.status === 'passed').length;
  const failedCount = summary
    ? summary.failed
    : Object.values(results).filter(
        (r) => r.status === 'failed' || r.status === 'error' || r.status === 'timed_out'
      ).length;
  const passPercentage =
    summary && summary.total > 0
      ? Math.round((summary.passed / summary.total) * 100)
      : tests.length > 0
      ? Math.round((passedCount / tests.length) * 100)
      : 0;

  const handleCopyAllTests = async () => {
    try {
      const fullCode = tests.map((t) => t.code).join('\n\n');
      await navigator.clipboard.writeText(fullCode);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Header & Tabs */}
      <div className="bg-slate-950/70 border-b border-slate-800 p-3.5 space-y-3">
        {/* Top title and Run All button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-white flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Generated Pytest Suite</span>
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {tests.length} Cases
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Categorized testing matrix for student assignment validation
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopyAllTests}
              className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
              title="Copy entire Pytest test suite"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden md:inline">Copy Suite</span>
                </>
              )}
            </button>

            <button
              onClick={onAddCustomTest}
              className="text-xs text-indigo-300 hover:text-white bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800/60 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
              title="Add a custom test case"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Add Test</span>
            </button>

            <button
              onClick={onRunAll}
              disabled={isRunningAll || tests.length === 0}
              className="text-xs font-semibold px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center gap-1.5 shadow-md shadow-emerald-950 transition-all cursor-pointer"
            >
              {isRunningAll ? (
                <>
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>Executing...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run All</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Suite Execution Summary Banner */}
        {executedCount > 0 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{passedCount} Passed</span>
              </div>
              {failedCount > 0 && (
                <div className="flex items-center gap-1 text-rose-400 font-semibold">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>{failedCount} Failed</span>
                </div>
              )}
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-mono">
                {passPercentage}% Pass Rate
              </span>
              {typeof totalDurationMs === 'number' && (
                <>
                  <span className="text-slate-500">•</span>
                  <span className="inline-flex items-center gap-1 text-cyan-300 font-mono">
                    <Zap className="w-3 h-3 text-cyan-400" />
                    {totalDurationMs.toFixed(2)} ms total
                  </span>
                </>
              )}
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full sm:w-48 bg-slate-800 h-2 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${(passedCount / tests.length) * 100}%` }}
              ></div>
              <div
                className="bg-rose-500 h-full transition-all duration-300"
                style={{ width: `${(failedCount / tests.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Tab Selector: ALL, NORMAL, BOUNDARY, EDGE */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-0.5 overflow-x-auto">
          <div className="flex items-center gap-1">
            {/* ALL Tab */}
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 ${
                activeTab === 'ALL'
                  ? 'border-indigo-500 text-white bg-slate-850'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span>ALL</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                {tests.length}
              </span>
            </button>

            {/* NORMAL Tab */}
            <button
              onClick={() => setActiveTab('NORMAL')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 ${
                activeTab === 'NORMAL'
                  ? 'border-emerald-500 text-emerald-300 bg-slate-850'
                  : 'border-transparent text-slate-400 hover:text-emerald-400 hover:bg-slate-900'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>NORMAL</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                {normalCount}
              </span>
            </button>

            {/* BOUNDARY Tab */}
            <button
              onClick={() => setActiveTab('BOUNDARY')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 ${
                activeTab === 'BOUNDARY'
                  ? 'border-amber-500 text-amber-300 bg-slate-850'
                  : 'border-transparent text-slate-400 hover:text-amber-400 hover:bg-slate-900'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>BOUNDARY</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-950 text-amber-300 border border-amber-800/50">
                {boundaryCount}
              </span>
            </button>

            {/* EDGE Tab */}
            <button
              onClick={() => setActiveTab('EDGE')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 ${
                activeTab === 'EDGE'
                  ? 'border-purple-500 text-purple-300 bg-slate-850'
                  : 'border-transparent text-slate-400 hover:text-purple-400 hover:bg-slate-900'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              <span>EDGE</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-950 text-purple-300 border border-purple-800/50">
                {edgeCount}
              </span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative hidden md:block w-44">
            <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 text-[11px] pl-7 pr-2.5 py-1 rounded-md border border-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Test Cards List Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[350px]">
        {isGenerating ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
            <p className="text-sm font-semibold text-slate-200">
              Generating High-Coverage Unit Tests...
            </p>
            <p className="text-xs text-slate-400 max-w-sm">
              Analyzing AST structures, function edge cases, boundary thresholds, and synthesizing Pytest assertions.
            </p>
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="h-56 flex flex-col items-center justify-center text-center p-6 space-y-2 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
            <Filter className="w-8 h-8 text-slate-600" />
            <p className="text-sm font-semibold text-slate-300">
              No test cases found in this view
            </p>
            <p className="text-xs text-slate-500">
              Try switching tabs, clearing search filters, or click "Generate AI Unit Tests" on the left.
            </p>
          </div>
        ) : (
          filteredTests.map((test) => (
            <TestCard
              key={test.id}
              test={test}
              result={results[test.id]}
              isRunning={runningTestIds.has(test.id)}
              onRunSingle={onRunSingle}
              onUpdateTestCode={onUpdateTestCode}
            />
          ))
        )}
      </div>
    </div>
  );
};
