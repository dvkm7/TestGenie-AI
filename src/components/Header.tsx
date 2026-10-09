import React from 'react';
import { 
  Sparkles, 
  Terminal, 
  FileCode2, 
  Cpu, 
  Download, 
  BookOpen, 
  ChevronDown, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { PRESETS } from '../data/presets';
import { CodePreset } from '../types';

interface HeaderProps {
  currentPresetId: string;
  onSelectPreset: (preset: CodePreset) => void;
  onOpenSpecsModal: () => void;
  onOpenRubricModal: () => void;
  onDownloadPytest: () => void;
  onResetCode: () => void;
  isRunningAll: boolean;
  onRunAll: () => void;
  testsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentPresetId,
  onSelectPreset,
  onOpenSpecsModal,
  onOpenRubricModal,
  onDownloadPytest,
  onResetCode,
  isRunningAll,
  onRunAll,
  testsCount,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Branding & Course Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-bold text-lg md:text-xl text-white tracking-tight flex items-center gap-2">
                TestGenie
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 shadow-sm">
                  BITS Pilani ZC229T Project
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              AI-Powered Unit Test Case Generator & Sandbox Runner for Student Assignments
            </p>
          </div>
        </div>

        {/* Center / Right: Engine status badges & action controls */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-between md:justify-end">
          {/* Status Badges */}
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Pytest Sandbox (Python 3.10)
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-950/60 text-purple-300 border border-purple-800/40 font-mono">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              Gemini 3.8 Flash
            </span>
          </div>

          {/* Preset Selector */}
          <div className="relative group">
            <select
              value={currentPresetId}
              onChange={(e) => {
                const found = PRESETS.find((p) => p.id === e.target.value);
                if (found) onSelectPreset(found);
              }}
              className="appearance-none bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium py-1.5 pl-3 pr-8 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-sm transition-colors"
              title="Select Sample Student Assignment"
            >
              {PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset Code */}
          <button
            onClick={onResetCode}
            className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
            title="Reset code to original preset"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset Code</span>
          </button>

          {/* FastAPI & Pytest Spec View */}
          <button
            onClick={onOpenSpecsModal}
            className="text-xs text-indigo-300 hover:text-indigo-200 bg-indigo-950/70 hover:bg-indigo-900/80 border border-indigo-700/60 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
            title="View FastAPI Schemas and Backend Implementation"
          >
            <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>FastAPI Schemas</span>
          </button>

          {/* Rubric Info */}
          <button
            onClick={onOpenRubricModal}
            className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
            title="Assignment Grading Rubric & Case Guidelines"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Rubric</span>
          </button>

          {/* Download Pytest File */}
          <button
            onClick={onDownloadPytest}
            className="text-xs text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
            title="Download test suite as test_assignment.py"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Export .py</span>
          </button>

          {/* Primary Run All button */}
          <button
            onClick={onRunAll}
            disabled={isRunningAll || testsCount === 0}
            className="text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-emerald-900/30"
          >
            {isRunningAll ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Running ({testsCount})...</span>
              </>
            ) : (
              <>
                <Terminal className="w-3.5 h-3.5" />
                <span>Run Pytest ({testsCount})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
