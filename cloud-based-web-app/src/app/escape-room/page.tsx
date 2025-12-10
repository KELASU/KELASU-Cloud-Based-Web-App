'use client';

import { useState, useRef, DragEvent, useEffect } from 'react';

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

type PuzzleType = 'code' | 'mcq';

type PuzzleConfig = {
    id: number;
    title: string;
    desc: string;
    type: PuzzleType;
    initialCode: string; 
    options?: string[]; 
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

type LeaderboardEntry = {
    id: string;
    game: string;
    player: string;
    value: number;
    difficulty: string;
    createdAt: string;
};

const generateChallengeBackground = (difficulty: GameDifficulty, levelNum: number) => {
    const seed = levelNum * 9999;
    const rand = (i: number) => {
        const x = Math.sin(seed + i) * 10000;
        return x - Math.floor(x);
    };

    let svgContent = '';
    let baseColor = '';

    if (difficulty === 'Beginner') {
        baseColor = '#87CEEB';

        svgContent += `<circle cx="85" cy="15" r="8" fill="#FDB813" />`;

        for(let i = 0; i < 5; i++) {
            const cx = 10 + rand(i) * 80;
            const cy = 10 + rand(i+10) * 20;
            const rx = 5 + rand(i+20) * 5;
            const ry = rx * 0.6;
            svgContent += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#FFFFFF" fill-opacity="0.8" />`;
        }

        svgContent += `<path d="M0,100 C30,70 70,70 100,100 Z" fill="#22c55e" />`;
        svgContent += `<rect x="0" y="85" width="100" height="15" fill="#16a34a" />`;

    } else if (difficulty === 'Intermediate') {
        baseColor = '#0f172a';

        svgContent += `<circle cx="15" cy="15" r="6" fill="#e2e8f0" fill-opacity="0.2" />`;

        for(let i = 0; i < 60; i++) {
            const x = rand(i) * 100;
            const y = rand(i+100) * 100;
            const len = 5 + rand(i+200) * 10;
            svgContent += `<line x1="${x}" y1="${y}" x2="${x-1}" y2="${y+len}" stroke="#64748b" stroke-width="0.5" opacity="0.6" />`;
        }

        svgContent += `<rect x="0" y="90" width="100" height="10" fill="#1e293b" />`;

    } else {
        baseColor = '#2a0a0a';

        for(let i = 0; i < 15; i++) {
            const cx = rand(i) * 100;
            const cy = rand(i+50) * 60;
            const r = 10 + rand(i+100) * 15;
            svgContent += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#525252" fill-opacity="0.3" />`;
        }
        let pathBack = `M0,100 `;
        for(let i = 0; i <= 10; i++) {
            const x = i * 10;
            const y = 70 + rand(i+200) * 20;
            pathBack += `L${x},${y} `;
        }
        pathBack += `L100,100 Z`;
        svgContent += `<path d="${pathBack}" fill="#b91c1c" />`; 

        let pathFront = `M0,100 `;
        for(let i = 0; i <= 20; i++) {
            const x = i * 5;
            const y = 80 + rand(i+300) * 20;
            pathFront += `L${x},${y} `;
        }
        pathFront += `L100,100 Z`;
        svgContent += `<path d="${pathFront}" fill="#f97316" fill-opacity="0.8" />`;
    }

    const svgString = `<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 100 100' preserveAspectRatio='none' style='background-color:${baseColor}'>${svgContent}</svg>`;

    const encoded = typeof btoa !== 'undefined' ? btoa(svgString) : Buffer.from(svgString).toString('base64');
    return `data:image/svg+xml;base64,${encoded}`;
};

export default function EscapeRoomHybrid() {
    const [mode, setMode] = useState<string>('menu');
    const [currentLevel, setCurrentLevel] = useState<LevelData | null>(null);

    const [difficulty, setDifficulty] = useState<GameDifficulty>('Beginner');
    const [challengeLevelNum, setChallengeLevelNum] = useState(1);
    const [challengeTimeLeft, setChallengeTimeLeft] = useState(0);
    const [challengeActive, setChallengeActive] = useState(false);
    const [isAIProcessing, setIsAIProcessing] = useState(false);

    const challengeActiveRef = useRef(false);

    const [dbLevels, setDbLevels] = useState<LevelData[]>([]);
    const [isLoadingLevels, setIsLoadingLevels] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (challengeActive && challengeTimeLeft > 0) {
            timer = setInterval(() => {
                setChallengeTimeLeft((prev) => {
                    if (prev <= 1) {
                        setChallengeActive(false);
                        challengeActiveRef.current = false; 
                        setMode('game_over');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [challengeActive, challengeTimeLeft]);

    useEffect(() => {
        if (mode === 'custom_select') {
            setIsLoadingLevels(true);
            fetch('/api/levels')
                .then(res => {
                    if (!res.ok) throw new Error("Failed to fetch levels");
                    return res.json();
                })
                .then(data => {
                    if (Array.isArray(data)) setDbLevels(data);
                })
                .catch(err => {
                    console.error("Failed to load levels from DB", err);
                })
                .finally(() => setIsLoadingLevels(false));
        }
    }, [mode]);

    const startChallenge = (diff: GameDifficulty) => {
        setDifficulty(diff);
        setChallengeLevelNum(1);
        let time = 600;
        if (diff === 'Intermediate') time = 420;
        if (diff === 'Expert') time = 180;
        setChallengeTimeLeft(time);
        
        setChallengeActive(true);
        challengeActiveRef.current = true;
        
        generateAILevel(diff, 1, 'playing_challenge');
    };

    const generateAILevel = async (diff: GameDifficulty, levelNum: number, targetMode: string) => {
        setIsAIProcessing(true);
        try {
            const response = await fetch('/api/generate-level', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ difficulty: diff, levelNum: levelNum })
            });

            let aiLevel;
            if (response.ok) {
                aiLevel = await response.json();
            } else {

                console.warn("API failed, using fallback generator");
                aiLevel = {
                    id: `gen_${Date.now()}`,
                    name: `Sector ${levelNum}`,
                    author: 'AI Architect',
                    puzzles: [
                        { id: 1, type: 'code', title: 'Security Bypass', desc: 'Override the security mainframe.', initialCode: 'SYSTEM_LOCKED', requiredString: 'UNLOCK', successMsg: 'Access Granted', top: 50, left: 50 }
                    ]
                };
            }
            
            if (aiLevel) {
                if (targetMode === 'playing_challenge' && !challengeActiveRef.current) {
                    setIsAIProcessing(false);
                    return; 
                }

                if (!aiLevel.bgImage) {
                    aiLevel.bgImage = generateChallengeBackground(diff, levelNum);
                }

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
                throw new Error("Invalid level data");
            }
        } catch (error) {
            console.error(error);
            if (targetMode !== 'playing_challenge' || challengeActiveRef.current) {
                const fallbackBg = generateChallengeBackground(diff, levelNum);
                const fallbackLevel = {
                     id: `fallback_${levelNum}`,
                     name: `Emergency Protocol ${levelNum}`,
                     author: 'System',
                     bgImage: fallbackBg,
                     puzzles: [{ id: 1, type: 'code' as PuzzleType, title: 'Emergency Override', desc: 'Connection lost. Manual override required.', initialCode: 'CONNECT', requiredString: 'OVERRIDE', successMsg: 'OK', top: 50, left: 50 }]
                };
                setCurrentLevel(fallbackLevel);
                setMode(targetMode);
            }
        } finally {
            setIsAIProcessing(false);
        }
    };

    const onLevelComplete = () => {
        if (mode === 'playing_custom') {
            alert("Level Complete!");
            setMode('custom_select');
        } else if (mode === 'playing_challenge') {
            if (!challengeActiveRef.current) return;

            if (challengeLevelNum >= 10) {
                setChallengeActive(false);
                challengeActiveRef.current = false;
                setMode('victory');
            } else {
                setChallengeLevelNum(prev => prev + 1);
                generateAILevel(difficulty, challengeLevelNum + 1, 'playing_challenge');
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


    if (mode === 'menu') {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-8 font-sans">
                <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div 
                        onClick={() => setMode('difficulty_select')}
                        className="bg-gradient-to-br from-purple-900 to-indigo-900 p-8 rounded-2xl border border-purple-500 cursor-pointer hover:scale-105 transition-transform flex flex-col items-center text-center group shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                    >
                        <div className="text-6xl mb-4 group-hover:animate-bounce">🤖</div>
                        <h2 className="text-3xl font-bold mb-2">Challenge Mode</h2>
                        <p className="text-purple-200">
                            10 AI Generated Levels.<br/>
                            Beat the clock & rank up!
                        </p>
                    </div>

                    <div 
                        onClick={() => setMode('custom_select')}
                        className="bg-gradient-to-br from-green-900 to-emerald-900 p-8 rounded-2xl border border-green-500 cursor-pointer hover:scale-105 transition-transform flex flex-col items-center text-center shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                    >
                        <div className="text-6xl mb-4">🛠️</div>
                        <h2 className="text-3xl font-bold mb-2">Custom Mode</h2>
                        <p className="text-green-200">
                            Play community levels or <br/> build your own with MCQs.
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
                             <div className="col-span-3 text-center text-gray-500">No levels found in database.</div>
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
            levelReached={challengeLevelNum}
            timeLeft={challengeTimeLeft}
            difficulty={difficulty}
            onExit={() => setMode('menu')} 
        />;
    }

    return null;
}

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
                body: JSON.stringify({ 
                    name: levelName, 
                    author: "Current User", 
                    bgImage: bgImage, 
                    puzzles: puzzles 
                })
            });
            if (!res.ok) throw new Error('Failed to save');
            alert("Level Saved Successfully!");
            onExit();
        } catch (error) {
            console.error(error);
            alert("Error saving level to DB.");
        } finally {
            setSaving(false);
        }
    };

    const addPuzzle = () => {
        const newId = Math.max(0, ...puzzles.map(p => p.id)) + 1;
        setPuzzles([...puzzles, { 
            id: newId, type: 'code', title: 'New Lock', desc: 'Description...', 
            initialCode: '// Code here', options: ['A', 'B', 'C', 'D'],
            requiredString: 'fix', successMsg: 'Unlocked!', top: 50, left: 50 
        }]);
        setEditingId(newId);
    };

    const updatePuzzle = (id: number, field: keyof PuzzleConfig, value: any) => {
        setPuzzles(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const updateOption = (id: number, index: number, value: string) => {
        const p = puzzles.find(pz => pz.id === id);
        if (p && p.options) {
            const newOpts = [...p.options];
            newOpts[index] = value;
            updatePuzzle(id, 'options', newOpts);
        }
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

    const editingPuzzle = puzzles.find(p => p.id === editingId);

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
                <div className="w-96 bg-slate-800 p-4 rounded overflow-y-auto">
                    {editingPuzzle ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-gray-600 pb-2">
                                <button onClick={() => setEditingId(null)} className="text-sm text-blue-400 font-bold hover:text-blue-300">← Back</button>
                                <h3 className="font-bold">Edit Lock #{editingId}</h3>
                                <button onClick={() => deletePuzzle(editingPuzzle.id)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
                            </div>
                            
                            <label className="block text-xs text-gray-400">Puzzle Type</label>
                            <select 
                                className="w-full bg-slate-900 border border-slate-700 p-2 rounded"
                                value={editingPuzzle.type}
                                onChange={(e) => updatePuzzle(editingPuzzle.id, 'type', e.target.value)}
                            >
                                <option value="code">Code Entry</option>
                                <option value="mcq">Multiple Choice</option>
                            </select>

                            <input className="w-full bg-slate-900 border border-slate-700 p-2 rounded" placeholder="Title" value={editingPuzzle.title} onChange={e => updatePuzzle(editingPuzzle.id, 'title', e.target.value)} />
                            <textarea className="w-full bg-slate-900 border border-slate-700 p-2 rounded" placeholder="Description" rows={3} value={editingPuzzle.desc} onChange={e => updatePuzzle(editingPuzzle.id, 'desc', e.target.value)} />

                            {editingPuzzle.type === 'code' ? (
                                <>
                                    <label className="block text-xs text-gray-400">Initial Code (Pre-filled text)</label>
                                    <textarea className="w-full bg-slate-900 border border-slate-700 p-2 rounded font-mono text-xs text-green-400" rows={3} value={editingPuzzle.initialCode} onChange={e => updatePuzzle(editingPuzzle.id, 'initialCode', e.target.value)} />
                                    
                                    <label className="block text-xs text-gray-400">Required Solution String</label>
                                    <input className="w-full bg-slate-900 border border-green-900/50 p-2 rounded text-green-400 font-mono" placeholder="Solution" value={editingPuzzle.requiredString} onChange={e => updatePuzzle(editingPuzzle.id, 'requiredString', e.target.value)} />
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <label className="block text-xs text-gray-400">Options</label>
                                    {editingPuzzle.options?.map((opt, idx) => (
                                        <input 
                                            key={idx}
                                            className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-sm" 
                                            placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                            value={opt}
                                            onChange={(e) => updateOption(editingPuzzle.id, idx, e.target.value)}
                                        />
                                    ))}
                                    <label className="block text-xs text-gray-400">Correct Answer (Exact Match)</label>
                                    <select 
                                        className="w-full bg-slate-900 border border-green-900/50 p-2 rounded text-green-400"
                                        value={editingPuzzle.requiredString}
                                        onChange={(e) => updatePuzzle(editingPuzzle.id, 'requiredString', e.target.value)}
                                    >
                                        <option value="">Select Correct Answer</option>
                                        {editingPuzzle.options?.map((opt, idx) => (
                                            <option key={idx} value={opt}>{opt || `Option ${idx + 1}`}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center">
                            <button onClick={addPuzzle} className="w-full bg-blue-600 py-2 rounded mb-4 font-bold">+ Add Lock</button>
                            <p className="text-gray-500 text-sm">Select a lock on the canvas to edit properties.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function GameComponent({ level, mode, challengeStats, onComplete, onExit }: { level: LevelData, mode: string, challengeStats?: {level: number, timeLeft: number}, onComplete: () => void, onExit: () => void }) {
    const [solvedIds, setSolvedIds] = useState<number[]>([]);
    const [activePuzzle, setActivePuzzle] = useState<PuzzleConfig | null>(null);
    const [input, setInput] = useState('');
    const [customTimer, setCustomTimer] = useState(0);

    useEffect(() => {
        if (activePuzzle && activePuzzle.type === 'code') {
            setInput(activePuzzle.initialCode || '');
        } else {
            setInput('');
        }
    }, [activePuzzle]);

    useEffect(() => {
        if (mode === 'playing_custom') {
            const i = setInterval(() => setCustomTimer(t => t + 1), 1000);
            return () => clearInterval(i);
        }
    }, [mode]);

    const submitAnswer = (answer: string) => {
        if (activePuzzle && answer.trim() === activePuzzle.requiredString.trim()) {
            const newSolved = [...solvedIds, activePuzzle.id];
            setSolvedIds(newSolved);
            setActivePuzzle(null);
            setInput('');

            if (newSolved.length === (level.puzzles?.length || 0)) {
                setTimeout(onComplete, 500); 
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
            {level.bgImage ? (
                <img src={level.bgImage} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="bg" />
            ) : (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center text-gray-600">No Image</div>
            )}

            <div className="absolute top-4 left-4 z-10 flex gap-4 w-full pr-8 justify-between pointer-events-none">
                <div className="flex gap-4 pointer-events-auto">
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

            {activePuzzle && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20 p-4">
                    <div className="bg-gray-800 p-8 rounded border border-blue-500 w-full max-w-lg shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                        <div className="flex justify-between items-start mb-4">
                             <h2 className="text-2xl font-bold text-blue-400">{activePuzzle.title}</h2>
                             <button onClick={() => setActivePuzzle(null)} className="text-gray-400 hover:text-white">✕</button>
                        </div>
                        
                        <p className="mb-6 text-gray-300 border-l-4 border-blue-500 pl-4 py-2 bg-black/20">{activePuzzle.desc}</p>
                        
                        {activePuzzle.type === 'mcq' ? (
                            <div className="grid grid-cols-1 gap-3">
                                {activePuzzle.options?.map((opt, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => submitAnswer(opt)}
                                        className="bg-slate-700 hover:bg-blue-600 text-left px-4 py-3 rounded transition-colors border border-slate-600 hover:border-blue-400"
                                    >
                                        <span className="font-bold mr-2 text-blue-400">{String.fromCharCode(65 + idx)}.</span>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <>
                                <textarea 
                                    value={input} 
                                    onChange={e => setInput(e.target.value)}
                                    className="w-full h-32 bg-black text-green-400 font-mono p-4 mb-4 border border-gray-600 focus:border-green-500 outline-none rounded"
                                    spellCheck={false}
                                />
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => submitAnswer(input)} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded font-bold transition-all shadow-lg shadow-green-900/50">
                                        EXECUTE
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function LeaderboardRegister({ result, levelReached, timeLeft, difficulty, onExit }: { result: string, levelReached: number, timeLeft: number, difficulty: string, onExit: () => void }) {
    const [name, setName] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loadingLB, setLoadingLB] = useState(true);

    useEffect(() => {
        fetch('/api/scores?game=Escape_Challenge')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setLeaderboard(data);
            })
            .catch(err => console.error("Error fetching leaderboard", err))
            .finally(() => setLoadingLB(false));
    }, []);

    const handleRegister = async () => {
        if (!name.trim()) return;
        setSaving(true);

        const compositeScore = (levelReached * 1000) + timeLeft;

        try {
            const res = await fetch('/api/scores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    game: 'Escape_Challenge',
                    player: name,
                    value: compositeScore,
                    difficulty: difficulty
                })
            });

            if (res.ok) {
                setSaved(true);
                const newEntry = await res.json();
                setLeaderboard(prev => [newEntry, ...prev].sort((a, b) => b.value - a.value).slice(0, 50));
            } else {
                throw new Error("Failed to save");
            }
        } catch (error) {
            console.error("Error saving score:", error);
            alert("Failed to save score. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const finalScoreDisplay = result === 'victory' 
        ? Math.floor(timeLeft / 60) + ':' + (timeLeft % 60).toString().padStart(2, '0') + ' Remaining'
        : `Level ${levelReached}`;

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center text-white p-4 ${result === 'victory' ? 'bg-green-900' : 'bg-red-900'}`}>
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">

                <div className="flex flex-col justify-center items-center text-center">
                    <h1 className="text-6xl font-bold mb-4">{result === 'victory' ? 'ESCAPED!' : 'CAUGHT!'}</h1>
                    <p className="text-2xl mb-8 opacity-80">
                        {result === 'victory' 
                            ? `All levels cleared on ${difficulty}.` 
                            : `You failed at Level ${levelReached} on ${difficulty}.`}
                    </p>
                    <div className="bg-black/30 p-6 rounded-lg mb-8 border border-white/10 w-full">
                        <span className="block text-sm uppercase tracking-widest opacity-50">Final Score</span>
                        <span className="text-4xl font-mono font-bold">{finalScoreDisplay}</span>
                    </div>

                    {!saved ? (
                        <div className="w-full max-w-sm">
                            <input 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter Agent Name"
                                className="w-full p-3 rounded bg-white/10 border border-white/30 text-white mb-4 focus:outline-none focus:border-white"
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
                        </div>
                    ) : (
                        <button onClick={onExit} className="w-full max-w-sm py-3 rounded bg-white text-black font-bold hover:opacity-90 shadow-lg">Return to Menu</button>
                    )}
                </div>

                <div className="bg-black/50 p-6 rounded-xl backdrop-blur-sm border border-white/10 overflow-hidden flex flex-col h-[500px]">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-white/10 pb-4">
                        <span>🏆</span> Global Leaderboard
                    </h3>
                    
                    {loadingLB ? (
                        <div className="flex-1 flex items-center justify-center opacity-50">Connecting to Mainframe...</div>
                    ) : (
                        <div className="overflow-y-auto flex-1 pr-2">
                            <table className="w-full text-left text-sm">
                                <thead className="text-white/50 sticky top-0 bg-black/80">
                                    <tr>
                                        <th className="pb-2">Rank</th>
                                        <th className="pb-2">Agent</th>
                                        <th className="pb-2 text-right">Lvl</th>
                                        <th className="pb-2 text-right">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="font-mono">
                                    {leaderboard.map((entry, i) => {
                                        const lvl = Math.floor(entry.value / 1000);
                                        const time = entry.value % 1000;
                                        
                                        return (
                                            <tr key={entry.id || i} className={`border-b border-white/5 ${saved && entry.player === name ? 'bg-white/20' : ''}`}>
                                                <td className="py-3 pl-2 text-white/50">#{i + 1}</td>
                                                <td className="py-3 font-bold text-blue-200">{entry.player}</td>
                                                <td className="py-3 text-right">{lvl}</td>
                                                <td className="py-3 text-right text-green-400">
                                                    {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}