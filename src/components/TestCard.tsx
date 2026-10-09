import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Play, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle,
  Info,
  Terminal,
  RefreshCw,
  Code2
} from 'lucide-react';
import { TestCase, SingleTestResult, TestCategory } from '../types';

interface TestCardProps {
  test: TestCase;
  result?: SingleTestResult;
  isRunning: boolean;
  onRunSingle: (test: TestCase) => void;
  onUpdateTestCode?: (testId: string, newCode: string) => void;
}

export const TestCard: React.FC<TestCardProps> = ({
  test,
  result,
  isRunning,
  onRunSingle,
  onUpdateTestCode,
}) => {
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(true);
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState(test.code);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(test.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback
    }
  };

  const handleSaveEdit = () => {
    if (onUpdateTestCode) {
      onUpdateTestCode(test.id, editedCode);
    }
    setIsEditing(false);
  };

  // Category badge styling
  const getCategoryBadge = (category: TestCategory) => {
    switch (category) {
      case 'NORMAL':
        return {
          bg: 'bg-emerald-950/80',
          text: 'text-emerald-300',
          border: 'border-emerald-700/60',
          label: 'NORMAL CASE',
          dot: 'bg-emerald-400',
        };
      case 'BOUNDARY':
        return {
          bg: 'bg-amber-950/80',
          text: 'text-amber-300',
          border: 'border-amber-700/60',
          label: 'BOUNDARY CASE',
          dot: 'bg-amber-400',
        };
      case 'EDGE':
        return {
          bg: 'bg-purple-950/80',
          text: 'text-purple-300',
          border: 'border-purple-700/60',
          label: 'EDGE CASE',
          dot: 'bg-purple-400',
        };
    }
  };

  const catStyle = getCategoryBadge(test.category);

  return (
    <div
      className={`rounded-xl border transition-all duration-200 bg-slate-900/90 overflow-hidden shadow-sm hover:shadow-md ${
        result?.status === 'passed'
          ? 'border-emerald-800/40 hover:border-emerald-700/60'
          : result?.status === 'failed'
          ? 'border-rose-800/50 hover:border-rose-700/80 bg-rose-950/10'
          : result?.status === 'timed_out'
          ? 'border-amber-800/60 bg-amber-950/10'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Top Bar of the Card */}
      <div className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 bg-slate-950/40 border-b border-slate-800/60">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider font-mono uppercase border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${catStyle.dot}`}></span>
            {catStyle.label}
          </span>

          {/* Test Name */}
          <span className="font-mono text-xs font-semibold text-slate-200">
            {test.name}
          </span>
        </div>

        {/* Execution Status Badge & Execution Time */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {isRunning ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-950 text-indigo-300 border border-indigo-700/60">
              <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" />
              Running...
            </span>
          ) : result?.status === 'passed' ? (
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                PASSED
              </span>
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-800/90 text-slate-300 border border-slate-700 shadow-inner"
                title="Exact test execution time"
              >
                <Clock className="w-3 h-3 text-cyan-400" />
                {result.execution_time_ms < 0.1
                  ? `< 0.1 ms`
                  : `${result.execution_time_ms.toFixed(2)} ms`}
              </span>
            </div>
          ) : result?.status === 'failed' ? (
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-700">
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                FAILED
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                <Clock className="w-3 h-3 text-rose-400" />
                {result.execution_time_ms.toFixed(2)} ms
              </span>
            </div>
          ) : result?.status === 'timed_out' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-700">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              TIMED OUT
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800/70 text-slate-400 border border-slate-700/60">
              <Clock className="w-3 h-3 text-slate-500" />
              Pending
            </span>
          )}

          {/* Quick Run Single Button */}
          <button
            onClick={() => onRunSingle(test)}
            disabled={isRunning}
            className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 disabled:opacity-50 transition-colors"
            title="Run this single test case"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* Test Description & Metadata */}
      <div className="p-3.5 space-y-2.5 text-xs">
        <p className="text-slate-300 leading-relaxed">
          {test.description}
        </p>

        {/* Input & Expected Output badges */}
        {(test.inputs_summary || test.expected_output) && (
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            {test.inputs_summary && (
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-950/70 border border-slate-800 text-[11px] font-mono text-slate-300">
                <span className="text-slate-500 font-sans text-[10px] uppercase font-bold">Input:</span>
                <span className="text-indigo-300">{test.inputs_summary}</span>
              </div>
            )}
            {test.expected_output && (
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-950/70 border border-slate-800 text-[11px] font-mono text-slate-300">
                <span className="text-slate-500 font-sans text-[10px] uppercase font-bold">Expected:</span>
                <span className="text-emerald-300">{test.expected_output}</span>
              </div>
            )}
          </div>
        )}

        {/* Failure Details & Error Banner if failed */}
        {result?.status === 'failed' && (
          <div className="mt-2 rounded-lg bg-rose-950/40 border border-rose-800/60 p-2.5 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 text-rose-300 font-mono text-xs font-medium">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                <span>{result.error_message || 'Assertion Error'}</span>
              </div>
              {result.traceback && (
                <button
                  onClick={() => setShowErrorDetails(!showErrorDetails)}
                  className="text-[11px] text-rose-400 hover:text-rose-200 underline flex-shrink-0"
                >
                  {showErrorDetails ? 'Hide Traceback' : 'View Traceback'}
                </button>
              )}
            </div>

            {showErrorDetails && result.traceback && (
              <pre className="p-2 bg-slate-950 rounded border border-rose-900/60 text-[11px] font-mono text-rose-200/90 overflow-x-auto whitespace-pre-wrap leading-tight">
                {result.traceback}
              </pre>
            )}
          </div>
        )}

        {/* Code Snippet Container */}
        <div className="mt-2 rounded-lg bg-slate-950 border border-slate-800/80 overflow-hidden">
          <div className="px-3 py-1.5 bg-slate-900/90 border-b border-slate-800/60 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-400 font-mono">
              <Terminal className="w-3 h-3 text-indigo-400" />
              <span>pytest code</span>
            </div>

            <div className="flex items-center gap-2">
              {onUpdateTestCode && (
                <button
                  onClick={() => {
                    if (isEditing) handleSaveEdit();
                    else setIsEditing(true);
                  }}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {isEditing ? (
                    <span className="text-emerald-400 font-medium">Save</span>
                  ) : (
                    <span>Edit</span>
                  )}
                </button>
              )}

              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
                title="Copy pytest function"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowCode(!showCode)}
                className="text-slate-500 hover:text-slate-300"
              >
                {showCode ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {showCode && (
            <div className="p-3">
              {isEditing ? (
                <textarea
                  value={editedCode}
                  onChange={(e) => setEditedCode(e.target.value)}
                  className="w-full bg-slate-900 font-mono text-xs text-slate-100 p-2 rounded border border-indigo-600 focus:outline-none"
                  rows={4}
                />
              ) : (
                <pre className="font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed selection:bg-indigo-900">
                  <code>{test.code}</code>
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
