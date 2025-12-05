'use client';

import { useState } from 'react';

// Types for our Builder
type PuzzleConfig = {
  id: number;
  trigger: string; // 'computer' | 'book' | 'door' etc.
  title: string;
  desc: string;
  initialCode: string;
  requiredString: string; // Code must include this to pass
  successMsg: string;
  top: number; // % position
  left: number; // % position
};

const DEFAULT_PUZZLES: PuzzleConfig[] = [
  {
    id: 1,
    trigger: 'computer',
    title: 'Format The Code',
    desc: 'The terminal is messy. Fix the spacing.',
    initialCode: 'function run(){console.log("run");return true;}',
    requiredString: '\n', // Simple check: did they add newlines?
    successMsg: 'System formatted.',
    top: 40,
    left: 20
  },
  {
    id: 2,
    trigger: 'door',
    title: 'Unlock The Door',
    desc: 'Write a loop to brute force the lock (0-1000).',
    initialCode: '// Write loop here',
    requiredString: 'for',
    successMsg: 'DOOR UNLOCKED!',
    top: 20,
    left: 80
  }
];

export default function EscapeRoomBuilder() {
  const [puzzles, setPuzzles] = useState<PuzzleConfig[]>(DEFAULT_PUZZLES);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Editor Handlers
  const addPuzzle = () => {
    const newId = Math.max(...puzzles.map(p => p.id), 0) + 1;
    setPuzzles([...puzzles, {
      id: newId,
      trigger: 'box',
      title: 'New Puzzle',
      desc: 'Description here',
      initialCode: '// Code here',
      requiredString: 'result',
      successMsg: 'Solved!',
      top: 50,
      left: 50
    }]);
    setEditingId(newId);
  };

  const updatePuzzle = (id: number, field: keyof PuzzleConfig, value: any) => {
    setPuzzles(puzzles.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const deletePuzzle = (id: number) => {
    setPuzzles(puzzles.filter(p => p.id !== id));
    if (editingId === id) setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 font-sans">
      {/* --- EDITOR UI --- */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-green-400 mb-2">Escape Room Builder</h1>
            <p className="text-gray-400">Configure your room and press Playtest to try it.</p>
          </div>
          <button 
            onClick={() => setIsPlaying(true)}
            className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
          >
            <span>▶</span> PLAYTEST GAME
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List of Objects */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-bold mb-4">Room Objects</h2>
            <div className="space-y-3">
              {puzzles.map(p => (
                <div 
                  key={p.id}
                  onClick={() => setEditingId(p.id)}
                  className={`p-4 rounded cursor-pointer transition-all border ${editingId === p.id ? 'bg-blue-900/50 border-blue-500' : 'bg-slate-700 border-transparent hover:bg-slate-600'}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{p.title}</span>
                    <button onClick={(e) => { e.stopPropagation(); deletePuzzle(p.id); }} className="text-red-400 hover:text-red-200">🗑</button>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Trigger: {p.trigger}</div>
                </div>
              ))}
              <button onClick={addPuzzle} className="w-full py-3 border-2 border-dashed border-gray-600 text-gray-400 rounded hover:border-green-500 hover:text-green-500 transition-colors">
                + Add Object
              </button>
            </div>
          </div>

          {/* Properties Editor */}
          <div className="lg:col-span-2 bg-slate-800 p-6 rounded-lg border border-slate-700">
            {editingId !== null ? (
              <div className="space-y-6">
                <h2 className="text-xl font-bold border-b border-gray-700 pb-2">Editing: {puzzles.find(p => p.id === editingId)?.title}</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Title</label>
                    <input 
                      type="text" 
                      value={puzzles.find(p => p.id === editingId)?.title}
                      onChange={(e) => updatePuzzle(editingId, 'title', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-600 p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Success Message</label>
                    <input 
                      type="text" 
                      value={puzzles.find(p => p.id === editingId)?.successMsg}
                      onChange={(e) => updatePuzzle(editingId, 'successMsg', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-600 p-2 rounded"
                    />
                  </div>
                </div>

                <div>
                   <label className="block text-xs text-gray-400 mb-1">Description (The prompt)</label>
                   <textarea 
                      value={puzzles.find(p => p.id === editingId)?.desc}
                      onChange={(e) => updatePuzzle(editingId, 'desc', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-600 p-2 rounded h-20"
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-xs text-gray-400 mb-1">Position Top (%)</label>
                      <input 
                        type="range" min="0" max="90" 
                        value={puzzles.find(p => p.id === editingId)?.top}
                        onChange={(e) => updatePuzzle(editingId, 'top', parseInt(e.target.value))}
                        className="w-full accent-green-500"
                      />
                   </div>
                   <div>
                      <label className="block text-xs text-gray-400 mb-1">Position Left (%)</label>
                      <input 
                        type="range" min="0" max="90" 
                        value={puzzles.find(p => p.id === editingId)?.left}
                        onChange={(e) => updatePuzzle(editingId, 'left', parseInt(e.target.value))}
                        className="w-full accent-green-500"
                      />
                   </div>
                </div>

                <div>
                   <label className="block text-xs text-gray-400 mb-1">Required Code (Must contain this string to pass)</label>
                   <input 
                      type="text" 
                      value={puzzles.find(p => p.id === editingId)?.requiredString}
                      onChange={(e) => updatePuzzle(editingId, 'requiredString', e.target.value)}
                      className="w-full bg-slate-900 border border-green-900/50 text-green-400 p-2 rounded font-mono"
                   />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 italic">
                Select an object to edit its properties
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- PLAY MODE POPUP --- */}
      {isPlaying && (
        <div className="fixed inset-0 z-50 bg-black animate-fade-in">
          <PlayableEscapeRoom puzzles={puzzles} onExit={() => setIsPlaying(false)} />
        </div>
      )}
    </div>
  );
}

// --- THE ACTUAL GAME COMPONENT ---
function PlayableEscapeRoom({ puzzles, onExit }: { puzzles: PuzzleConfig[], onExit: () => void }) {
  const [currentStage, setCurrentStage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [userCode, setUserCode] = useState('');
  
  // Sort puzzles by ID to ensure sequence
  const sortedPuzzles = [...puzzles].sort((a,b) => a.id - b.id);
  const activePuzzle = sortedPuzzles[currentStage];
  const isWon = currentStage >= sortedPuzzles.length;

  const handleObjectClick = (puzzle: PuzzleConfig) => {
    // In this game mode, you must solve them in order
    if (puzzle.id === activePuzzle.id) {
       setUserCode(puzzle.initialCode);
       setModalOpen(true);
    } else if (puzzle.id > activePuzzle.id) {
       alert("Locked! Solve previous steps first.");
    }
  };

  const checkSolution = () => {
    if (userCode.includes(activePuzzle.requiredString)) {
       alert(activePuzzle.successMsg);
       setModalOpen(false);
       setCurrentStage(prev => prev + 1);
    } else {
       alert(`Incorrect. Hint: Code needs to include "${activePuzzle.requiredString}"`);
    }
  };

  if (isWon) {
     return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-green-900 text-white">
           <h1 className="text-6xl font-bold mb-4">YOU ESCAPED!</h1>
           <button onClick={onExit} className="bg-white text-green-900 px-8 py-3 rounded font-bold">Return to Editor</button>
        </div>
     )
  }

  return (
    <div className="relative w-full h-screen bg-gray-900 text-white overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 opacity-40 bg-[url('https://placehold.co/1920x1080/2a2a2a/FFF?text=Escape+Room')] bg-cover bg-center pointer-events-none" />

        {/* HUD */}
        <div className="absolute top-4 left-4 z-20 flex gap-4">
            <button onClick={onExit} className="bg-red-600 px-4 py-2 rounded font-bold hover:bg-red-500">EXIT TEST</button>
            <div className="bg-black/80 p-2 rounded border border-green-500">
                Objective: Find object at {activePuzzle?.top}% Top, {activePuzzle?.left}% Left
            </div>
        </div>

        {/* Render All Objects */}
        {sortedPuzzles.map(p => (
            <button
               key={p.id}
               onClick={() => handleObjectClick(p)}
               style={{ top: `${p.top}%`, left: `${p.left}%` }}
               className={`absolute w-24 h-24 border-2 border-dashed flex items-center justify-center bg-black/50 transition-all
                  ${currentStage === sortedPuzzles.indexOf(p) ? 'border-green-400 animate-pulse cursor-pointer hover:bg-green-900/50' : 'border-gray-600 opacity-50 cursor-not-allowed'}
               `}
            >
               <span className="text-xs font-bold bg-black px-1">{p.title}</span>
            </button>
        ))}

        {/* Puzzle Modal */}
        {modalOpen && (
           <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50">
               <div className="bg-gray-800 p-8 rounded border border-green-500 w-full max-w-2xl">
                  <h2 className="text-2xl text-green-400 mb-2">{activePuzzle.title}</h2>
                  <p className="mb-4 text-gray-300">{activePuzzle.desc}</p>
                  
                  <textarea 
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    className="w-full h-48 bg-black text-green-400 font-mono p-4 border border-gray-600 mb-4"
                  />
                  
                  <div className="flex justify-end gap-3">
                     <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-400">Cancel</button>
                     <button onClick={checkSolution} className="px-6 py-2 bg-green-600 text-white rounded font-bold">Submit</button>
                  </div>
               </div>
           </div>
        )}
    </div>
  );
}