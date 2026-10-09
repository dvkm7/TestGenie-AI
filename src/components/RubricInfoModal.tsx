import React from 'react';
import { X, BookOpen, Award, CheckCircle, ShieldAlert, Cpu } from 'lucide-react';

interface RubricInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RubricInfoModal: React.FC<RubricInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Grading Rubric & Testing Methodology
              </h3>
              <p className="text-xs text-slate-400">
                BITS Pilani ZC229T Student Coding Assignment Evaluation Framework
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed">
          {/* Overview */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2">
            <h4 className="font-semibold text-sm text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Assessment Philosophy</span>
            </h4>
            <p>
              Automated grading in computer science relies on partition testing and boundary value analysis (BVA).
              TestGenie categorizes test suites into three fundamental buckets to guarantee high branch and condition coverage:
            </p>
          </div>

          {/* Normal Cases */}
          <div className="border border-emerald-900/40 bg-emerald-950/20 p-4 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-300 text-sm flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                1. NORMAL CASES (Weight: 40%)
              </span>
              <span className="font-mono text-[11px] text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                Happy Path
              </span>
            </div>
            <p className="text-slate-300">
              Verifies the standard operational path with typical valid inputs. For search algorithms, this covers middle array elements, odd/even length sorted lists, and expected return types.
            </p>
          </div>

          {/* Boundary Cases */}
          <div className="border border-amber-900/40 bg-amber-950/20 p-4 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                2. BOUNDARY CASES (Weight: 30%)
              </span>
              <span className="font-mono text-[11px] text-amber-400 px-2 py-0.5 rounded bg-amber-950 border border-amber-800">
                Off-By-One & Extremities
              </span>
            </div>
            <p className="text-slate-300">
              Evaluates boundaries where pointer adjustments frequently cause off-by-one errors:
              empty arrays (<code className="text-amber-200">[]</code>), single elements (<code className="text-amber-200">[x]</code>), index 0 (first element), and index <code className="text-amber-200">len-1</code> (last element).
            </p>
          </div>

          {/* Edge Cases */}
          <div className="border border-purple-900/40 bg-purple-950/20 p-4 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-300 text-sm flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-purple-400" />
                3. EDGE CASES (Weight: 30%)
              </span>
              <span className="font-mono text-[11px] text-purple-400 px-2 py-0.5 rounded bg-purple-950 border border-purple-800">
                Pathological & Robustness
              </span>
            </div>
            <p className="text-slate-300">
              Probes system robustness under adversarial or rare inputs: values strictly outside bounds, duplicate elements, negative integers, and edge loops that might cause infinite execution.
            </p>
          </div>

          {/* Execution Time Benchmark */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-1">
            <h4 className="font-semibold text-white">Execution Time Badges</h4>
            <p className="text-slate-400">
              Each test executes inside our sandbox using Python's high-resolution performance counter (<code className="text-cyan-300">time.perf_counter()</code>). Execution time badges ensure algorithmic complexity constraints like O(log n) vs O(n) are immediately visible.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
