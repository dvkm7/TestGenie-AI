import React, { useState } from 'react';
import { 
  Terminal, 
  ChevronUp, 
  ChevronDown, 
  Copy, 
  Check, 
  Trash2, 
  Maximize2, 
  Minimize2,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface TerminalConsoleProps {
  output: string;
  onClear: () => void;
  isRunning: boolean;
  totalDurationMs?: number;
  onOpenMlTraceback?: () => void;
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({
  output,
  onClear,
  isRunning,
  totalDurationMs,
  onOpenMlTraceback,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      className={`border-t border-slate-800 bg-slate-950 transition-all duration-200 flex flex-col ${
        !isOpen ? 'h-9' : isExpanded ? 'h-96' : 'h-52'
      }`}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900 border-b border-slate-800 select-none">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pytest Sandbox Console</span>
            {isOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {isRunning && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 animate-pulse">
              <Clock className="w-3 h-3" />
              <span>Executing pytest runner...</span>
            </span>
          )}

          {!isRunning && typeof totalDurationMs === 'number' && (
            <span className="text-[11px] font-mono text-slate-400">
              [Last run: {totalDurationMs.toFixed(2)} ms]
            </span>
          )}
        </div>

        {isOpen && (
          <div className="flex items-center gap-2">
            {onOpenMlTraceback && (output.includes('FAILED') || output.includes('Error') || output.includes('Traceback') || output.includes('AssertionError')) && (
              <button
                type="button"
                onClick={onOpenMlTraceback}
                className="text-[11px] font-semibold text-cyan-300 hover:text-white bg-indigo-950 hover:bg-indigo-900 border border-indigo-700/70 px-2 py-0.5 rounded flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                title="Diagnose traceback with Machine Learning"
              >
                <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>ML Traceback Diagnosis</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className="text-xs text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors"
              title="Copy terminal output"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>

            <button
              onClick={onClear}
              className="text-xs text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors"
              title="Clear console"
            >
              <Trash2 className="w-3 h-3" />
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors hidden sm:block"
              title={isExpanded ? 'Restore size' : 'Expand terminal'}
            >
              {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </button>
          </div>
        )}
      </div>

      {/* Terminal Output Area */}
      {isOpen && (
        <div className="flex-1 p-3 overflow-y-auto font-mono text-[12px] leading-relaxed bg-black/80 text-slate-300 selection:bg-indigo-900 select-text">
          {output ? (
            <div className="space-y-0.5">
              {output.split('\n').map((line, idx) => {
                const isPassed = line.includes('PASSED') || line.includes('passed');
                const isFailed = line.includes('FAILED') || line.includes('failed') || line.includes('ERROR');
                const isHeader = line.includes('===');
                const isTrace = line.startsWith('    >');

                return (
                  <div
                    key={idx}
                    className={`whitespace-pre-wrap font-mono ${
                      isPassed
                        ? 'text-emerald-400 font-medium'
                        : isFailed
                        ? 'text-rose-400 font-medium'
                        : isHeader
                        ? 'text-cyan-400 font-semibold'
                        : isTrace
                        ? 'text-amber-300'
                        : 'text-slate-300'
                    }`}
                  >
                    {line}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-slate-500 italic">
              Pytest execution output will appear here. Click "Run All" or execute an individual test case above.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
