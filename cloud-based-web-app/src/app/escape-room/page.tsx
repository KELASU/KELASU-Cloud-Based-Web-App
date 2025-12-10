'use client';

import { useState, useRef, DragEvent, useEffect } from 'react';

<<<<<<< Updated upstream
// --- ICONS ---
const LockIcon = () => <span className="text-3xl">🔒</span>;
const UnlockIcon = () => <span className="text-3xl">🔓</span>;
const AIIcon = () => <span className="text-xl">✨</span>;
=======
const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v3H9V7c0-1.654 1.346-3 3-3zm0 10a2 2 0 110-4 2 2 0 010 4z" />
  </svg>
);
const UnlockIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a1 1 0 012 0v3h2V7c0-2.757-2.243-5-5-5zm0 10a2 2 0 110-4 2 2 0 010 4z" />
  </svg>
);
>>>>>>> Stashed changes
const SaveIcon = () => <span className="text-xl">💾</span>;

// --- TYPES ---
type PuzzleConfig = {
    id: number;
    title: string;
    desc: string;
    initialCode: string;
    requiredString: string;
    successMsg: string;
    top: number;
    left: number;
};

type LevelData = {
    id: string;
    name: string;
    author: string;
    bgImage: string;
    puzzles: PuzzleConfig[];
};

<<<<<<< Updated upstream
// --- MOCK DATABASE (For "Load Level" feature) ---
=======
type GameDifficulty = 'Beginner' | 'Intermediate' | 'Expert';

>>>>>>> Stashed changes
const MOCK_DB_LEVELS: LevelData[] = [
    {
        id: '1', name: 'The Dark Server Room', author: 'SysAdmin_99', 
        bgImage: 'https://placehold.co/1920x1080/1a1a1a/FFF?text=Server+Room',
        puzzles: [
            { id: 1, title: 'Firewall', desc: 'Allow port 80', initialCode: 'deny all', requiredString: 'allow', successMsg: 'Port Open', top: 50, left: 50 }
        ]
    },
    {
        id: '2', name: 'JavaScript Jungle', author: 'React_Fan', 
        bgImage: 'https://placehold.co/1920x1080/004400/FFF?text=Jungle',
        puzzles: []
    }
];

export default function EscapeRoomHybrid() {
<<<<<<< Updated upstream
    // Modes: 'menu', 'challenge' (AI), 'custom_select', 'builder', 'playing'
    const [mode, setMode] = useState<string>('menu');
    const [currentLevel, setCurrentLevel] = useState<LevelData | null>(null);
    const [isAIProcessing, setIsAIProcessing] = useState(false);

    // --- AI GENERATION MOCK ---
    const generateAILevel = async () => {
=======

    const [mode, setMode] = useState<string>('menu');
    const [currentLevel, setCurrentLevel] = useState<LevelData | null>(null);
    const [isAIProcessing, setIsAIProcessing] = useState(false);

    const [difficulty, setDifficulty] = useState<GameDifficulty>('Beginner');
    const [challengeLevelNum, setChallengeLevelNum] = useState(1);
    const [challengeTimeLeft, setChallengeTimeLeft] = useState(0);
    const [challengeActive, setChallengeActive] = useState(false);

    const [dbLevels, setDbLevels] = useState<LevelData[]>([]);
    const [isLoadingLevels, setIsLoadingLevels] = useState(false);

    useEffect(() => {
        if (mode === 'custom_select') {
            setIsLoadingLevels(true);
            fetch('/api/levels')
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setDbLevels(data);
                })
                .catch(err => console.error("Failed to load levels", err))
                .finally(() => setIsLoadingLevels(false));
        }
    }, [mode]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (challengeActive && challengeTimeLeft > 0) {
            timer = setInterval(() => {
                setChallengeTimeLeft((prev) => {
                    if (prev <= 1) {
                        setChallengeActive(false);
                        setMode('game_over'); // Time ran out
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [challengeActive, challengeTimeLeft]);

    const startChallenge = (diff: GameDifficulty) => {
        setDifficulty(diff);
        setChallengeLevelNum(1);

        let time = 600; // Beginner: 10 mins
        if (diff === 'Intermediate') time = 420; // 7 mins
        if (diff === 'Expert') time = 180; // 3 mins
        
        setChallengeTimeLeft(time);
        setChallengeActive(true);
        generateAILevel('playing_challenge');
    };

    const generateAILevel = async (targetMode: string) => {
>>>>>>> Stashed changes
        setIsAIProcessing(true);
        
        // SIMULATING GEMINI FLASH CALL...
        // In real app: const data = await generateEscapeLevelAction();
        setTimeout(() => {
            const aiLevel: LevelData = {
                id: 'ai_gen_' + Date.now(),
                name: 'AI Generated Protocol',
                author: 'Gemini Flash',
                bgImage: 'https://placehold.co/1920x1080/220033/FFF?text=AI+Construct',
                puzzles: [
                    {
                        id: 1, title: 'Neural Link', desc: 'Fix the synaptic weights loop.', 
                        initialCode: 'while(false) { learn(); }', requiredString: 'true', 
                        successMsg: 'Link Established', top: 30, left: 40
                    },
                    {
                        id: 2, title: 'Data Stream', desc: 'Filter the noise array.', 
                        initialCode: '// filter code', requiredString: 'filter', 
                        successMsg: 'Stream Clear', top: 60, left: 70
                    }
                ]
            };
            setCurrentLevel(aiLevel);
            setIsAIProcessing(false);
<<<<<<< Updated upstream
            setMode('playing');
        }, 2000);
=======
        }
    };

    const onLevelComplete = () => {
        if (mode === 'playing_custom') {
            alert("Level Complete!");
            setMode('custom_select');
        } else if (mode === 'playing_challenge') {
            if (challengeLevelNum >= 10) {
                setChallengeActive(false);
                setMode('victory');
            } else {
                setChallengeLevelNum(prev => prev + 1);
                generateAILevel('playing_challenge');
            }
        }
>>>>>>> Stashed changes
    };

    const handleLoadLevel = (level: LevelData) => {
        setCurrentLevel(level);
        setMode('playing');
    };

    const handleCreateNew = () => {
        setCurrentLevel({
            id: 'new', name: 'My Custom Level', author: 'You', bgImage: '', puzzles: []
        });
        setMode('builder');
    };

    if (mode === 'menu') {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-8">
                <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">

                    <div 
                        onClick={generateAILevel}
                        className="bg-gradient-to-br from-purple-900 to-indigo-900 p-8 rounded-2xl border border-purple-500 cursor-pointer hover:scale-105 transition-transform flex flex-col items-center text-center group"
                    >
                        {isAIProcessing ? (
                            <div className="animate-spin text-4xl">✨</div>
                        ) : (
                            <>
                                <div className="text-6xl mb-4 group-hover:animate-pulse">🤖</div>
                                <h2 className="text-3xl font-bold mb-2">Challenge Mode</h2>
                                <p className="text-purple-200">
                                    Procedurally generated by AI. <br/>
                                    Infinite replayability.
                                </p>
                            </>
                        )}
                    </div>

                    <div 
                        onClick={() => setMode('custom_select')}
                        className="bg-gradient-to-br from-green-900 to-emerald-900 p-8 rounded-2xl border border-green-500 cursor-pointer hover:scale-105 transition-transform flex flex-col items-center text-center"
                    >
                        <div className="text-6xl mb-4">🛠️</div>
                        <h2 className="text-3xl font-bold mb-2">Custom Mode</h2>
                        <p className="text-green-200">
                            Play community levels or <br/> build your own.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (mode === 'custom_select') {
        return (
            <div className="min-h-screen bg-slate-900 text-white p-8">
                <button onClick={() => setMode('menu')} className="mb-8 text-gray-400 hover:text-white">← Back</button>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Community Levels (SQL DB)</h1>
                    <button 
                        onClick={handleCreateNew}
                        className="bg-blue-600 px-6 py-2 rounded font-bold hover:bg-blue-500"
                    >
                        + Create New Level
                    </button>
                </div>

<<<<<<< Updated upstream
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {MOCK_DB_LEVELS.map(level => (
                        <div key={level.id} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-blue-500 transition-colors">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={level.bgImage} className="w-full h-32 object-cover" alt="preview" />
                            <div className="p-4">
                                <h3 className="font-bold text-lg">{level.name}</h3>
                                <p className="text-sm text-gray-400">by {level.author}</p>
                                <div className="mt-4 flex justify-between items-center">
                                    <span className="text-xs bg-slate-700 px-2 py-1 rounded">{level.puzzles.length} Puzzles</span>
                                    <button 
                                        onClick={() => handleLoadLevel(level)}
                                        className="text-green-400 font-bold hover:underline"
                                    >
                                        PLAY
                                    </button>
=======
                {isLoadingLevels ? (
                    <div className="text-center text-gray-400 mt-20">Loading levels from Database...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {dbLevels.length === 0 && (
                            <div className="col-span-3 text-center text-gray-500 py-10 border-2 border-dashed border-gray-700 rounded-lg">No levels found. Be the first to create one!</div>
                        )}
                        {dbLevels.map(level => (
                            <div key={level.id} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-blue-500 transition-colors">
                                <img src={level.bgImage || 'https://placehold.co/600x400?text=No+Image'} className="w-full h-32 object-cover" alt="preview" />
                                <div className="p-4">
                                    <h3 className="font-bold text-lg">{level.name}</h3>
                                    <p className="text-sm text-gray-400">by {level.author}</p>
                                    <div className="mt-4 flex justify-between items-center">
                                        <span className="text-xs bg-slate-700 px-2 py-1 rounded">{Array.isArray(level.puzzles) ? level.puzzles.length : 0} Puzzles</span>
                                        <button onClick={() => handleLoadLevel(level)} className="text-green-400 font-bold hover:underline">PLAY</button>
                                    </div>
>>>>>>> Stashed changes
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (mode === 'builder' && currentLevel) {
        return <BuilderComponent level={currentLevel} onExit={() => setMode('custom_select')} />;
    }

    if (mode === 'playing' && currentLevel) {
        return <GameComponent level={currentLevel} onExit={() => setMode('menu')} />;
    }

    return null;
}

<<<<<<< Updated upstream
// --- BUILDER COMPONENT (Simplified for integration) ---
=======
>>>>>>> Stashed changes
function BuilderComponent({ level, onExit }: { level: LevelData, onExit: () => void }) {
    const [puzzles, setPuzzles] = useState(level.puzzles);
    const [bgImage, setBgImage] = useState(level.bgImage);
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        // SIMULATE PRISMA SAVE
        setTimeout(() => {
            alert("Level Saved to Database!");
            setSaving(false);
            onExit();
        }, 1000);
    };

    // ... (Reuse logic from previous Builder for drag/drop)
    // Simplified render for brevity in this hybrid view:
    return (
        <div className="min-h-screen bg-slate-900 text-white p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Level Editor: {level.name}</h1>
                <div className="flex gap-2">
                    <button onClick={onExit} className="px-4 py-2 text-gray-400">Cancel</button>
                    <button onClick={handleSave} className="bg-green-600 px-6 py-2 rounded flex items-center gap-2">
                        {saving ? 'Saving...' : <><SaveIcon /> Save to DB</>}
                    </button>
                </div>
            </div>
            
<<<<<<< Updated upstream
            <div className="border-2 border-dashed border-gray-700 h-[600px] rounded flex items-center justify-center relative">
                 <p className="text-gray-500">
                    [Builder Canvas - Reuse code from previous turn here]
                    <br/> Drag & Drop Logic goes here.
                 </p>
                 {/* Visual placeholder for locks */}
                 {puzzles.map(p => (
                     <div key={p.id} className="absolute text-3xl" style={{top: `${p.top}%`, left: `${p.left}%`}}>🔒</div>
                 ))}
=======
            <div className="flex gap-4 h-[80vh]">
                <div ref={containerRef} className="flex-1 bg-black rounded border-2 border-dashed border-gray-600 relative overflow-hidden select-none" onDrop={handleFileDrop} onDragOver={e => e.preventDefault()} onMouseMove={onMouseMove}>
                    {bgImage ? (
                        <img src={bgImage} className="w-full h-full object-cover opacity-50 pointer-events-none" alt="bg" />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500 pointer-events-none">Drag Background Image Here</div>
                    )}
                    {puzzles.map(p => (
                        <div key={p.id} onMouseDown={(e) => startDrag(e, p.id)} style={{ top: `${p.top}%`, left: `${p.left}%` }} className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move ${editingId === p.id ? 'text-green-400 scale-125' : 'text-red-400'}`}>
                            <LockIcon />
                        </div>
                    ))}
                </div>
                <div className="w-80 bg-slate-800 p-4 rounded overflow-y-auto">
                    {editingId ? (
                        <div className="space-y-4">
                            <button onClick={() => setEditingId(null)} className="text-xs text-blue-400">← Back</button>
                            <h3 className="font-bold border-b border-gray-600 pb-2">Edit Lock #{editingId}</h3>
                            <button onClick={() => deletePuzzle(editingId)} className="text-xs text-red-400 w-full text-right">Delete Lock</button>
                            <input className="w-full bg-slate-900 border border-slate-700 p-2 rounded" placeholder="Title" value={puzzles.find(p => p.id === editingId)?.title} onChange={e => updatePuzzle(editingId, 'title', e.target.value)} />
                            <textarea className="w-full bg-slate-900 border border-slate-700 p-2 rounded" placeholder="Description" rows={3} value={puzzles.find(p => p.id === editingId)?.desc} onChange={e => updatePuzzle(editingId, 'desc', e.target.value)} />
                            <input className="w-full bg-slate-900 border border-green-900/50 p-2 rounded text-green-400 font-mono" placeholder="Required String (e.g. 'for')" value={puzzles.find(p => p.id === editingId)?.requiredString} onChange={e => updatePuzzle(editingId, 'requiredString', e.target.value)} />
                        </div>
                    ) : (
                        <div className="text-center">
                            <button onClick={addPuzzle} className="w-full bg-blue-600 py-2 rounded mb-4 font-bold">+ Add Lock</button>
                            <p className="text-gray-500 text-sm">Select a lock to edit properties.</p>
                        </div>
                    )}
                </div>
>>>>>>> Stashed changes
            </div>
        </div>
    );
}

<<<<<<< Updated upstream
// --- GAME COMPONENT (The actual playable part) ---
function GameComponent({ level, onExit }: { level: LevelData, onExit: () => void }) {
=======
function GameComponent({ level, mode, challengeStats, onComplete, onExit }: { level: LevelData, mode: string, challengeStats?: {level: number, timeLeft: number}, onComplete: () => void, onExit: () => void }) {
>>>>>>> Stashed changes
    const [solvedIds, setSolvedIds] = useState<number[]>([]);
    const [activePuzzle, setActivePuzzle] = useState<PuzzleConfig | null>(null);
    const [input, setInput] = useState('');
    const [timer, setTimer] = useState(0);

<<<<<<< Updated upstream
    // Timer
=======
>>>>>>> Stashed changes
    useEffect(() => {
        const i = setInterval(() => setTimer(t => t + 1), 1000);
        return () => clearInterval(i);
    }, []);

    const checkCode = () => {
        if (activePuzzle && input.includes(activePuzzle.requiredString)) {
            setSolvedIds([...solvedIds, activePuzzle.id]);
            setActivePuzzle(null);
            setInput('');
<<<<<<< Updated upstream
=======

            if (newSolved.length === (level.puzzles?.length || 0)) {
                setTimeout(onComplete, 500);
            }
>>>>>>> Stashed changes
        } else {
            alert('Access Denied');
        }
    };

    const isWin = solvedIds.length > 0 && solvedIds.length === level.puzzles.length;

    return (
        <div className="relative min-h-screen bg-black text-white overflow-hidden">
            {level.bgImage ? (

                <img src={level.bgImage} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="bg" />
            ) : (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center text-gray-600">No Image</div>
            )}

<<<<<<< Updated upstream
            {/* HUD */}
            <div className="absolute top-4 left-4 z-10 flex gap-4">
                <button onClick={onExit} className="bg-red-600 px-4 py-2 rounded font-bold">Exit</button>
                <div className="bg-black/80 px-4 py-2 rounded border border-blue-500 font-mono">
                    Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                </div>
            </div>

            {/* WIN SCREEN */}
            {isWin && (
                <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
                    <h1 className="text-6xl font-bold text-green-500 mb-4">ESCAPED!</h1>
                    <p className="text-xl mb-8">Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>
                    
                    <div className="bg-gray-800 p-6 rounded w-96 mb-8">
                        <h3 className="border-b border-gray-600 pb-2 mb-2 font-bold">Global Leaderboard</h3>
                        <div className="flex justify-between py-1 text-yellow-400">
                            <span>1. SpeedRun_Bot</span>
                            <span>0:45</span>
                        </div>
                        <div className="flex justify-between py-1 text-white">
                            <span>2. YOU</span>
                            <span>{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
                        </div>
                    </div>

                    <button onClick={onExit} className="bg-white text-black px-8 py-3 rounded font-bold">Menu</button>
                </div>
            )}

            {/* PUZZLES */}
            {level.puzzles.map(p => (
=======
            <div className="absolute top-4 left-4 z-10 flex gap-4 w-full pr-8 justify-between">
                <div className="flex gap-4">
                    <button onClick={onExit} className="bg-red-600 px-4 py-2 rounded font-bold hover:bg-red-500">Exit</button>
                    {mode === 'playing_challenge' && (
                        <div className="bg-purple-900/80 px-4 py-2 rounded border border-purple-500 font-bold">
                            Level {challengeStats?.level}/10
                        </div>
                    )}
                </div>
                
                <div className={`px-4 py-2 rounded border font-mono text-xl font-bold ${mode === 'playing_challenge' && (challengeStats?.timeLeft || 0) < 60 ? 'bg-red-900 border-red-500 animate-pulse' : 'bg-black/80 border-blue-500'}`}>
                    Time: {mode === 'playing_challenge' ? formatTime(challengeStats?.timeLeft || 0) : formatTime(customTimer)}
                </div>
            </div>

            {level.puzzles?.map(p => (
>>>>>>> Stashed changes
                <button
                    key={p.id}
                    disabled={solvedIds.includes(p.id)}
                    onClick={() => setActivePuzzle(p)}
                    style={{top: `${p.top}%`, left: `${p.left}%`}}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 hover:scale-110 transition-transform ${solvedIds.includes(p.id) ? 'text-green-500' : 'text-red-500'}`}
                >
                    {solvedIds.includes(p.id) ? <UnlockIcon /> : <LockIcon />}
                </button>
            ))}

            {activePuzzle && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
                    <div className="bg-gray-800 p-8 rounded border border-blue-500 w-full max-w-lg">
                        <h2 className="text-2xl font-bold text-blue-400 mb-2">{activePuzzle.title}</h2>
                        <p className="mb-4 text-gray-300">{activePuzzle.desc}</p>
                        <textarea 
                            value={input} onChange={e => setInput(e.target.value)}
                            className="w-full h-32 bg-black text-green-400 font-mono p-4 mb-4 border border-gray-600"
                            placeholder={activePuzzle.initialCode}
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setActivePuzzle(null)} className="px-4 py-2 text-gray-400">Cancel</button>
                            <button onClick={checkCode} className="bg-blue-600 px-6 py-2 rounded">Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
<<<<<<< Updated upstream
=======
}

function LeaderboardRegister({ result, score, difficulty, onExit }: { result: string, score: number, difficulty: string, onExit: () => void }) {
    const [name, setName] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleRegister = async () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
        }, 1000);
    };

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center text-white ${result === 'victory' ? 'bg-green-900' : 'bg-red-900'}`}>
            <h1 className="text-6xl font-bold mb-4">{result === 'victory' ? 'CHALLENGE COMPLETE!' : 'GAME OVER'}</h1>
            <p className="text-2xl mb-8 opacity-80">
                {result === 'victory' 
                    ? `You escaped all 10 levels with ${Math.floor(score / 60)}:${(score % 60).toString().padStart(2, '0')} remaining!` 
                    : `You reached Level ${score} on ${difficulty} difficulty.`}
            </p>

            <div className="bg-black/50 p-8 rounded-xl backdrop-blur-sm border border-white/20 w-full max-w-md">
                {!saved ? (
                    <>
                        <h3 className="text-xl font-bold mb-4">Register for Leaderboard</h3>
                        <input 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter Agent Name"
                            className="w-full p-3 rounded bg-white/10 border border-white/30 text-white mb-4"
                        />
                        <div className="flex gap-4">
                            <button onClick={onExit} className="flex-1 py-3 rounded text-white/70 hover:bg-white/10">Skip</button>
                            <button 
                                onClick={handleRegister} 
                                disabled={!name || saving}
                                className="flex-1 py-3 rounded bg-white text-black font-bold hover:opacity-90 disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Submit Score'}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-green-400 mb-4">Score Registered!</h3>
                        <p className="mb-6">Rank: #42 (Simulated)</p>
                        <button onClick={onExit} className="w-full py-3 rounded bg-white text-black font-bold hover:opacity-90">Return to Menu</button>
                    </div>
                )}
            </div>
        </div>
    );
>>>>>>> Stashed changes
}