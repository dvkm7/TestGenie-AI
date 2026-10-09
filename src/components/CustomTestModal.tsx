import React, { useState } from 'react';
import { X, Plus, Terminal, Code2 } from 'lucide-react';
import { TestCase, TestCategory } from '../types';

interface CustomTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTest: (test: TestCase) => void;
  defaultFunctionName?: string;
}

export const CustomTestModal: React.FC<CustomTestModalProps> = ({
  isOpen,
  onClose,
  onAddTest,
  defaultFunctionName = 'binary_search',
}) => {
  const [name, setName] = useState(`test_${defaultFunctionName}_custom`);
  const [category, setCategory] = useState<TestCategory>('NORMAL');
  const [description, setDescription] = useState('Verify custom condition for student assignment.');
  const [inputsSummary, setInputsSummary] = useState('arr=[1, 2, 3], target=2');
  const [expectedOutput, setExpectedOutput] = useState('1');
  const [code, setCode] = useState(`def test_${defaultFunctionName}_custom():\n    assert ${defaultFunctionName}([1, 2, 3], 2) == 1`);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    const newTest: TestCase = {
      id: `custom_${Date.now()}`,
      name: name.trim().startsWith('test_') ? name.trim() : `test_${name.trim()}`,
      category,
      description: description.trim(),
      inputs_summary: inputsSummary.trim() || undefined,
      expected_output: expectedOutput.trim() || undefined,
      code: code.trim(),
    };

    onAddTest(newTest);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/60">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Add Custom Test Case</h3>
              <p className="text-xs text-slate-400">Append a student or instructor verification assert</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Test Function Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {(['NORMAL', 'BOUNDARY', 'EDGE'] as TestCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    category === cat
                      ? cat === 'NORMAL'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                        : cat === 'BOUNDARY'
                        ? 'bg-amber-950 text-amber-300 border-amber-600'
                        : 'bg-purple-950 text-purple-300 border-purple-600'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Rationale / Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Input Summary (Optional)</label>
              <input
                type="text"
                value={inputsSummary}
                onChange={(e) => setInputsSummary(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Expected Output (Optional)</label>
              <input
                type="text"
                value={expectedOutput}
                onChange={(e) => setExpectedOutput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Pytest Code</label>
            <textarea
              rows={4}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md"
            >
              Add to Test Suite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
