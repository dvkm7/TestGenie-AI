import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Terminal, 
  Copy, 
  Check, 
  ArrowRight, 
  Zap, 
  RotateCcw, 
  BookOpen, 
  Cpu, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck,
  Layers
} from 'lucide-react';
import { MlTracebackFeedback } from '../types';

interface MlTracebackModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: MlTracebackFeedback | null;
  isLoading: boolean;
  onApplyCorrection: (correctedCode: string) => void;
  currentCode: string;
}

export const MlTracebackModal: React.FC<MlTracebackModalProps> = ({
  isOpen,
  onClose,
  feedback,
  isLoading,
  onApplyCorrection,
  currentCode,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [showRawTraceback, setShowRawTraceback] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-indigo-900/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border-b border-indigo-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  ML Traceback Diagnosis & Auto-Correction
                </h3>
                <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/60">
                  Gemini 3.8 Flash ML
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Automated Program Repair (APR) & Pedagogical Root-Cause Analysis for BITS ZC229T
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
                <Cpu className="w-6 h-6 text-indigo-400 absolute inset-0 m-auto" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-200">
                  ML Diagnosis in Progress...
                </p>
                <p className="text-xs text-slate-400 max-w-md">
                  Analyzing Python AST syntax, exception tracebacks, boundary constraints, and formulating an optimal bug repair patch.
                </p>
              </div>
            </div>
          ) : !feedback ? (
            <div className="py-12 text-center text-slate-400">
              <p>No traceback diagnosis available. Run the test suite first to capture any failing cases.</p>
            </div>
          ) : (
            <>
              {/* Failure Context Banner */}
              <div className="rounded-xl bg-rose-950/30 border border-rose-900/60 p-3.5 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span className="text-xs font-bold text-rose-200">
                      Target Failing Test: <code className="font-mono text-amber-300 bg-slate-950/70 px-1.5 py-0.5 rounded">{feedback.testName || 'test_assertion'}</code>
                    </span>
                  </div>

                  {feedback.confidence_score && (
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      ML Confidence: {Math.round(feedback.confidence_score * 100)}%
                    </span>
                  )}
                </div>

                {feedback.errorMessage && (
                  <p className="text-xs text-rose-300 font-mono bg-slate-950/60 p-2 rounded border border-rose-950">
                    {feedback.errorMessage}
                  </p>
                )}

                {/* Collapsible Raw Traceback */}
                {feedback.traceback_dissection && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowRawTraceback(!showRawTraceback)}
                      className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium mt-1"
                    >
                      {showRawTraceback ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      <span>{showRawTraceback ? 'Hide Python Traceback Stack' : 'View Python Traceback Stack'}</span>
                    </button>

                    {showRawTraceback && (
                      <pre className="mt-2 p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-rose-200/90 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-44">
                        {feedback.traceback_dissection}
                      </pre>
                    )}
                  </div>
                )}
              </div>

              {/* Step 1: Root Cause & Pedagogical Feedback */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Root Cause Card */}
                <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>ML Root-Cause Analysis</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {feedback.root_cause}
                  </p>
                </div>

                {/* Evaluator Pedagogical Feedback */}
                <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>BITS Evaluator Guidance & Rubric</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {feedback.feedback}
                  </p>
                  {feedback.complexity_analysis && (
                    <div className="text-[11px] text-slate-400 pt-1 font-mono border-t border-slate-800/60">
                      ⚡ {feedback.complexity_analysis}
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: What was changed (Diff summary) */}
              <div className="rounded-xl bg-indigo-950/30 border border-indigo-900/50 p-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0 animate-pulse"></span>
                  <span className="text-indigo-200 font-medium">Patch Summary:</span>
                  <span className="text-slate-300">{feedback.diff_summary}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(feedback.corrected_code)}
                  className="text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md flex items-center gap-1 flex-shrink-0 transition-colors"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Step 3: ML Corrected Python Code Preview */}
              <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
                <div className="px-3 py-2 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-semibold text-emerald-300 font-mono">
                      solution_corrected.py (ML Generated Fix)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Verified Against Test Suite</span>
                </div>

                <pre className="p-3.5 font-mono text-xs text-emerald-200/90 overflow-x-auto leading-relaxed max-h-56 bg-slate-950/70">
                  {feedback.corrected_code}
                </pre>
              </div>
            </>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>One-click fix replaces code and triggers immediate Pytest re-run</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="text-xs px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-medium transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isLoading || !feedback?.corrected_code}
              onClick={() => {
                if (feedback?.corrected_code) {
                  onApplyCorrection(feedback.corrected_code);
                  onClose();
                }
              }}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white flex items-center gap-2 shadow-lg shadow-emerald-950/40 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Apply ML Correction & Re-run Tests</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
