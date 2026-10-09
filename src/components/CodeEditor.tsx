import React, { useState } from 'react';
import { 
  Code2, 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  Bug, 
  HelpCircle, 
  RotateCcw,
  Sliders,
  CheckSquare,
  Square,
  AlertCircle
} from 'lucide-react';
import { TestCategory } from '../types';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  context: string;
  setContext: (context: string) => void;
  onGenerateTests: (selectedCategories: TestCategory[]) => void;
  isGenerating: boolean;
  hasBuggyOption: boolean;
  isBuggyActive: boolean;
  onToggleBuggy: () => void;
  onResetToDefault: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  setCode,
  context,
  setContext,
  onGenerateTests,
  isGenerating,
  hasBuggyOption,
  isBuggyActive,
  onToggleBuggy,
  onResetToDefault,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<TestCategory[]>([
    'NORMAL',
    'BOUNDARY',
    'EDGE',
  ]);
  const [showPromptHints, setShowPromptHints] = useState(false);

  const toggleCategory = (cat: TestCategory) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length === 1) return; // Keep at least one
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Line count for editor line numbering
  const lineCount = Math.max(code.split('\n').length, 12);

  // Handle Tab key inside textarea for proper 4-space Python indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const spaces = '    ';
      const newCode = code.substring(0, start) + spaces + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + spaces.length;
      }, 0);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/70 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex space-x-1.5 mr-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md text-xs font-mono text-slate-200 border border-slate-700/60">
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>solution.py</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">Python 3.10</span>
        </div>

        <div className="flex items-center gap-1.5">
          {hasBuggyOption && (
            <button
              onClick={onToggleBuggy}
              className={`text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all font-medium ${
                isBuggyActive
                  ? 'bg-rose-950 text-rose-300 border border-rose-700 shadow-sm shadow-rose-950'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
              title="Toggle intentionally buggy code to demonstrate test runner catching logic errors"
            >
              <Bug className={`w-3.5 h-3.5 ${isBuggyActive ? 'text-rose-400' : 'text-slate-400'}`} />
              <span>{isBuggyActive ? 'Buggy Code Active' : 'Test with Bug'}</span>
            </button>
          )}

          <button
            onClick={handleCopyCode}
            className="text-xs text-slate-400 hover:text-slate-200 p-1.5 rounded-md hover:bg-slate-800 transition-colors"
            title="Copy code"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="relative flex-1 flex min-h-[300px] max-h-[460px] overflow-hidden bg-slate-950/90 font-mono text-xs">
        {/* Line Numbers Gutter */}
        <div className="w-11 py-3 bg-slate-950 select-none text-right pr-2.5 text-slate-600 font-mono border-r border-slate-800/70 text-[11px] leading-[20px] overflow-hidden">
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="hover:text-slate-400 transition-colors">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="flex-1 w-full p-3 bg-transparent text-slate-100 resize-none focus:outline-none font-mono text-[13px] leading-[20px] selection:bg-indigo-900 selection:text-indigo-100"
          placeholder="Paste student Python function code here..."
        />
      </div>

      {/* Assignment Problem Statement / Context */}
      <div className="border-t border-slate-800 bg-slate-900/80 p-3.5 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Assignment Context / Problem Statement</span>
          </label>
          <button
            onClick={() => setShowPromptHints(!showPromptHints)}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <HelpCircle className="w-3 h-3" />
            <span>{showPromptHints ? 'Hide Hints' : 'Rubric Guidelines'}</span>
          </button>
        </div>

        {showPromptHints && (
          <div className="text-[11px] text-slate-400 bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg space-y-1">
            <p className="font-medium text-slate-300">💡 Guidelines for BITS Pilani ZC229T assignments:</p>
            <ul className="list-disc list-inside space-y-0.5 text-slate-400">
              <li>Specify expected time complexity constraints (e.g. O(log n) vs O(n)).</li>
              <li>Mention exact return values for absent elements (-1, None, False).</li>
              <li>Include behavior on empty lists or extreme numbers (boundaries).</li>
            </ul>
          </div>
        )}

        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={3}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 resize-y leading-relaxed"
          placeholder="Provide the assignment problem requirements, constraints, input bounds, and grading criteria..."
        />

        {/* Generator Controls & Category Checkboxes */}
        <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Sliders className="w-3 h-3 text-slate-400" />
              Categories:
            </span>

            {/* NORMAL Checkbox */}
            <button
              onClick={() => toggleCategory('NORMAL')}
              className={`text-[11px] font-medium px-2 py-1 rounded-md border flex items-center gap-1.5 transition-colors ${
                selectedCategories.includes('NORMAL')
                  ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60'
                  : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-400'
              }`}
            >
              {selectedCategories.includes('NORMAL') ? (
                <CheckSquare className="w-3 h-3 text-emerald-400" />
              ) : (
                <Square className="w-3 h-3" />
              )}
              <span>Normal</span>
            </button>

            {/* BOUNDARY Checkbox */}
            <button
              onClick={() => toggleCategory('BOUNDARY')}
              className={`text-[11px] font-medium px-2 py-1 rounded-md border flex items-center gap-1.5 transition-colors ${
                selectedCategories.includes('BOUNDARY')
                  ? 'bg-amber-950/70 text-amber-300 border-amber-700/60'
                  : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-400'
              }`}
            >
              {selectedCategories.includes('BOUNDARY') ? (
                <CheckSquare className="w-3 h-3 text-amber-400" />
              ) : (
                <Square className="w-3 h-3" />
              )}
              <span>Boundary</span>
            </button>

            {/* EDGE Checkbox */}
            <button
              onClick={() => toggleCategory('EDGE')}
              className={`text-[11px] font-medium px-2 py-1 rounded-md border flex items-center gap-1.5 transition-colors ${
                selectedCategories.includes('EDGE')
                  ? 'bg-purple-950/70 text-purple-300 border-purple-700/60'
                  : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-400'
              }`}
            >
              {selectedCategories.includes('EDGE') ? (
                <CheckSquare className="w-3 h-3 text-purple-400" />
              ) : (
                <Square className="w-3 h-3" />
              )}
              <span>Edge</span>
            </button>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => onGenerateTests(selectedCategories)}
            disabled={isGenerating || !code.trim()}
            className="w-full sm:w-auto text-xs font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin text-cyan-200" />
                <span>Synthesizing Test Suite...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                <span>Generate AI Unit Tests</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
