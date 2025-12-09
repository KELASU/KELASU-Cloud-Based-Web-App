'use client';

import { useState, useRef, DragEvent, useEffect } from 'react';

// --- ICONS (SVG) ---
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

type GameDifficulty = 'Beginner' | 'Intermediate' | 'Expert';

// --- MOCK DATABASE (Simulating loaded levels) ---
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
    // Modes: 'menu', 'difficulty_select', 'custom_select', 'builder', 'playing_custom', 'playing_challenge'
    const [mode, setMode] = useState<string>('menu');
    const [currentLevel, setCurrentLevel] = useState<LevelData | null>(null);
    const [isAIProcessing, setIsAIProcessing] = useState(false);
    
    // Challenge State
    const [difficulty, setDifficulty] = useState<GameDifficulty>('Beginner');
    const [challengeLevelNum, setChallengeLevelNum] = useState(1);
    const [challengeTimeLeft, setChallengeTimeLeft] = useState(0);
    const [challengeActive, setChallengeActive] = useState(false);

    // Database State
    const [dbLevels, setDbLevels] = useState<LevelData[]>([]);
    const [isLoadingLevels, setIsLoadingLevels] = useState(false);

    // --- FETCH LEVELS FROM DATABASE ---
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

    // --- CHALLENGE TIMER ---
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

    // --- START CHALLENGE ---
    const startChallenge = (diff: GameDifficulty) => {
        setDifficulty(diff);
        setChallengeLevelNum(1);
        
        // Set Timer based on Difficulty
        let time = 600; // Beginner: 10 mins
        if (diff === 'Intermediate') time = 420; // 7 mins
        if (diff === 'Expert') time = 180; // 3 mins
        
        setChallengeTimeLeft(time);
        setChallengeActive(true);
        generateAILevel('playing_challenge');
    };

    // --- GENERATE AI LEVEL ---
    const generateAILevel = async (targetMode: string) => {
        setIsAIProcessing(true);
        try {
            const response = await fetch('/api/generate-level', { method: 'POST' });
            if (!response.ok) throw new Error('API request failed');

            const aiLevel = await response.json();
            if (aiLevel) {
                const safeLevel = {
                    ...aiLevel,
                    puzzles: aiLevel.puzzles.map((p: any, index: number) => ({
                        ...p,
                        id: index + 1
                    }))
                };
                setCurrentLevel(safeLevel);
                setMode(targetMode);
            } else {
                alert("AI failed to generate a level.");
                setChallengeActive(false);
                setMode('menu');
            }
        } catch (error) {
            console.error(error);
            alert("Error connecting to AI service.");
            setChallengeActive(false);
            setMode('menu');
        } finally {
            setIsAIProcessing(false);
        }
    };

    // --- HANDLE LEVEL COMPLETE ---
    const onLevelComplete = () => {
        if (mode === 'playing_custom') {
            // Custom mode just wins
            alert("Level Complete!");
            setMode('custom_select');
        } else if (mode === 'playing_challenge') {
            if (challengeLevelNum >= 10) {
                // Victory!
                setChallengeActive(false);
                setMode('victory');
            } else {
                // Next Level
                setChallengeLevelNum(prev => prev + 1);
                generateAILevel('playing_challenge');
            }
        }
    };

    const handleLoadLevel = (level: LevelData) => {
        setCurrentLevel(level);
        setMode('playing_custom');
    };

    const handleCreateNew = () => {
        setCurrentLevel({
            id: 'new', name: 'My Custom Level', author: 'You', bgImage: '', puzzles: []
        });
        setMode('builder');
    };

    // --- RENDER MODES ---

    if (mode === 'menu') {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-8 font-sans">
                <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Challenge Card */}
                    <div 
                        onClick={() => setMode('difficulty_select')}
                        className="bg-gradient-to-br from-purple-900 to-indigo-900 p-8 rounded-2xl border border-purple-500 cursor-pointer hover:scale-105 transition-transform flex flex-col items-center text-center group"
                    >
                        <div className="text-6xl mb-4 group-hover:animate-bounce">🤖</div>
                        <h2 className="text-3xl font-bold mb-2">Challenge Mode</h2>
                        <p className="text-purple-200">
                            10 AI Generated Levels.<br/>
                            Can you beat the clock?
                        </p>
                    </div>

                    {/* Custom Card */}
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

    if (mode === 'difficulty_select') {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8">
                <h1 className="text-4xl font-bold mb-8">Select Difficulty</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                    <button onClick={() => startChallenge('Beginner')} className="p-6 bg-green-800 rounded-xl hover:bg-green-700 transition-all border border-green-500">
                        <h3 className="text-2xl font-bold">Beginner</h3>
                        <p className="mt-2">10 Minutes</p>
                    </button>
                    <button onClick={() => startChallenge('Intermediate')} className="p-6 bg-yellow-800 rounded-xl hover:bg-yellow-700 transition-all border border-yellow-500">
                        <h3 className="text-2xl font-bold">Intermediate</h3>
                        <p className="mt-2">7 Minutes</p>
                    </button>
                    <button onClick={() => startChallenge('Expert')} className="p-6 bg-red-800 rounded-xl hover:bg-red-700 transition-all border border-red-500">
                        <h3 className="text-2xl font-bold">Expert</h3>
                        <p className="mt-2">3 Minutes</p>
                    </button>
                </div>
                <button onClick={() => setMode('menu')} className="mt-8 text-gray-400 hover:text-white">Cancel</button>
            </div>
        );
    }

    if (mode === 'custom_select') {
        return (
            <div className="min-h-screen bg-slate-900 text-white p-8">
                <button onClick={() => setMode('menu')} className="mb-8 text-gray-400 hover:text-white">← Back</button>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Community Levels</h1>
                    <button onClick={handleCreateNew} className="bg-blue-600 px-6 py-2 rounded font-bold hover:bg-blue-500">+ Create New Level</button>
                </div>

                {isLoadingLevels ? (
                    <div className="text-center text-gray-400 mt-20">Loading levels from Database...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {dbLevels.length === 0 && (
                            <div className="col-span-3 text-center text-gray-500 py-10 border-2 border-dashed border-gray-700 rounded-lg">No levels found. Be the first to create one!</div>
                        )}
                        {dbLevels.map(level => (
                            <div key={level.id} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-blue-500 transition-colors">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={level.bgImage || 'https://placehold.co/600x400?text=No+Image'} className="w-full h-32 object-cover" alt="preview" />
                                <div className="p-4">
                                    <h3 className="font-bold text-lg">{level.name}</h3>
                                    <p className="text-sm text-gray-400">by {level.author}</p>
                                    <div className="mt-4 flex justify-between items-center">
                                        <span className="text-xs bg-slate-700 px-2 py-1 rounded">{Array.isArray(level.puzzles) ? level.puzzles.length : 0} Puzzles</span>
                                        <button onClick={() => handleLoadLevel(level)} className="text-green-400 font-bold hover:underline">PLAY</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (mode === 'builder' && currentLevel) {
        return <BuilderComponent level={currentLevel} onExit={() => setMode('custom_select')} />;
    }

    if ((mode === 'playing_custom' || mode === 'playing_challenge') && currentLevel) {
        if (isAIProcessing) {
            return (
                <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center animate-pulse">
                    <h2 className="text-4xl font-bold mb-4">Generating Level {challengeLevelNum}/10...</h2>
                    <p className="text-purple-400">Consulting AI Architect</p>
                </div>
            );
        }
        return (
            <GameComponent 
                level={currentLevel} 
                mode={mode}
                challengeStats={mode === 'playing_challenge' ? { level: challengeLevelNum, timeLeft: challengeTimeLeft } : undefined}
                onComplete={onLevelComplete}
                onExit={() => setMode('menu')} 
            />
        );
    }

    if (mode === 'game_over' || mode === 'victory') {
        return <LeaderboardRegister 
            result={mode} 
            score={mode === 'victory' ? challengeTimeLeft : challengeLevelNum} 
            difficulty={difficulty}
            onExit={() => setMode('menu')} 
        />;
    }

    return null;
}

// --- BUILDER COMPONENT ---
function BuilderComponent({ level, onExit }: { level: LevelData, onExit: () => void }) {
    const [puzzles, setPuzzles] = useState(level.puzzles);
    const [bgImage, setBgImage] = useState(level.bgImage);
    const [levelName, setLevelName] = useState(level.name);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [draggedPuzzleId, setDraggedPuzzleId] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/levels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: levelName, author: "Current User", bgImage: bgImage, puzzles: puzzles })
            });
            if (!res.ok) throw new Error('Failed to save');
            alert("Level Saved Successfully!");
            onExit();
        } catch (error) {
            console.error(error);
            alert("Error saving level.");
        } finally {
            setSaving(false);
        }
    };

    const addPuzzle = () => {
        const newId = Math.max(...puzzles.map(p => p.id), 0) + 1;
        setPuzzles([...puzzles, { id: newId, title: 'New Lock', desc: 'Description...', initialCode: '// Code', requiredString: 'fix', successMsg: 'Unlocked!', top: 50, left: 50 }]);
        setEditingId(newId);
    };

    const updatePuzzle = (id: number, field: keyof PuzzleConfig, value: any) => {
        setPuzzles(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const deletePuzzle = (id: number) => {
        setPuzzles(prev => prev.filter(p => p.id !== id));
        if (editingId === id) setEditingId(null);
    };

    const handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (ev) => { if (ev.target?.result) setBgImage(ev.target.result as string); };
                reader.readAsDataURL(file);
            }
        }
    };

    const startDrag = (e: React.MouseEvent, id: number) => {
        e.stopPropagation(); setDraggedPuzzleId(id); setEditingId(id);
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (draggedPuzzleId !== null && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
            const y = Math.min(Math.max(e.clientY - rect.top, 0), rect.height);
            setPuzzles(prev => prev.map(p => p.id === draggedPuzzleId ? { ...p, left: Number(((x / rect.width) * 100).toFixed(2)), top: Number(((y / rect.height) * 100).toFixed(2)) } : p));
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4" onMouseUp={() => setDraggedPuzzleId(null)}>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">Editing:</h1>
                    <input value={levelName} onChange={(e) => setLevelName(e.target.value)} className="bg-slate-800 border border-slate-600 px-2 py-1 rounded" />
                </div>
                <div className="flex gap-2">
                    <button onClick={onExit} className="px-4 py-2 text-gray-400">Cancel</button>
                    <button onClick={handleSave} disabled={saving} className="bg-green-600 px-6 py-2 rounded flex items-center gap-2 disabled:opacity-50">{saving ? 'Saving...' : <><SaveIcon /> Save</>}</button>
                </div>
            </div>
            
            <div className="flex gap-4 h-[80vh]">
                <div ref={containerRef} className="flex-1 bg-black rounded border-2 border-dashed border-gray-600 relative overflow-hidden select-none" onDrop={handleFileDrop} onDragOver={e => e.preventDefault()} onMouseMove={onMouseMove}>
                    {bgImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
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
            </div>
        </div>
    );
}

// --- GAME COMPONENT ---
function GameComponent({ level, mode, challengeStats, onComplete, onExit }: { level: LevelData, mode: string, challengeStats?: {level: number, timeLeft: number}, onComplete: () => void, onExit: () => void }) {
    const [solvedIds, setSolvedIds] = useState<number[]>([]);
    const [activePuzzle, setActivePuzzle] = useState<PuzzleConfig | null>(null);
    const [input, setInput] = useState('');
    const [customTimer, setCustomTimer] = useState(0);

    // Custom Mode Timer
    useEffect(() => {
        if (mode === 'playing_custom') {
            const i = setInterval(() => setCustomTimer(t => t + 1), 1000);
            return () => clearInterval(i);
        }
    }, [mode]);

    const checkCode = () => {
        if (activePuzzle && input.includes(activePuzzle.requiredString)) {
            const newSolved = [...solvedIds, activePuzzle.id];
            setSolvedIds(newSolved);
            setActivePuzzle(null);
            setInput('');
            
            // Check Win
            if (newSolved.length === (level.puzzles?.length || 0)) {
                setTimeout(onComplete, 500); // Slight delay for effect
            }
        } else {
            alert('Access Denied');
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="relative min-h-screen bg-black text-white overflow-hidden">
            {/* BG */}
            {level.bgImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={level.bgImage} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="bg" />
            ) : (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center text-gray-600">No Image</div>
            )}

            {/* HUD */}
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

            {/* PUZZLES */}
            {level.puzzles?.map(p => (
                <button
                    key={p.id}
                    disabled={solvedIds.includes(p.id)}
                    onClick={() => setActivePuzzle(p)}
                    style={{top: `${p.top}%`, left: `${p.left}%`}}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 hover:scale-110 transition-transform ${solvedIds.includes(p.id) ? 'text-green-500' : 'text-red-500 animate-pulse'}`}
                >
                    {solvedIds.includes(p.id) ? <UnlockIcon /> : <LockIcon />}
                </button>
            ))}

            {/* MODAL */}
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
}

// --- LEADERBOARD REGISTER COMPONENT ---
function LeaderboardRegister({ result, score, difficulty, onExit }: { result: string, score: number, difficulty: string, onExit: () => void }) {
    const [name, setName] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleRegister = async () => {
        setSaving(true);
        // Simulate API call to save score
        // await fetch('/api/scores', { method: 'POST', body: JSON.stringify({ name, score, difficulty }) })
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
}