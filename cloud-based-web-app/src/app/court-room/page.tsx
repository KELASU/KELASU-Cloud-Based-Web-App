'use client';

import { useState, useEffect } from 'react';

// --- DATA BANKS FOR PROCEDURAL GENERATION ---
const BUGS = [
    { code: '<img src="logo.png" />', fix: 'alt=', desc: 'Missing Alt Text' },
    { code: '<input type="text" />', fix: 'aria-label=', desc: 'Missing ARIA Label' },
    { code: 'div { color: #555; bg: #545; }', fix: 'contrast', desc: 'Low Contrast Ratio' },
    { code: 'button { outline: none; }', fix: 'focus', desc: 'Removed Focus Ring' }
];

const SENDERS = ['BOSS', 'AGILE COACH', 'HR DEPT', 'CLIENT', 'JUNIOR DEV', 'MOM'];
const URGENT_PHRASES = [
    "URGENT: Accessibility audit failed!",
    "LAWSUIT INCOMING: Fix the site now!",
    "CRITICAL: The screen reader is crashing.",
    "STOP DEPLOY: Compliance issues found."
];
const CASUAL_PHRASES = [
    "Did you see the game last night?",
    "Don't forget the potluck lunch.",
    "Can you review my PR when free?",
    "Where is the coffee?"
];

// --- ICONS ---
const GavelIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M2 13.376l3.624-3.623 8.162 8.163-3.624 3.623L2 13.376zm13.662-6.52l3.624-3.624 3.033 3.033-3.624 3.624-3.033-3.033z" />
        <path d="M11.586 11.586L4.515 4.515 5.929 3.1 13 10.172l-1.414 1.414z" />
    </svg>
);

const ScaleIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2l-9.6 5h19.2L12 2zm0 2.2l4.8 2.5H7.2L12 4.2zM3.4 8l-1.6 9h7.4l-1.6-9H3.4zm13.2 0l-1.6 9h7.4l-1.6-9h-4.2z" />
    </svg>
);

export default function ProceduralCourtRoom() {
    // Game State
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'won' | 'lost'>('intro');
    const [health, setHealth] = useState(100);
    const [timer, setTimer] = useState(60);
    const [activeNotes, setActiveNotes] = useState<any[]>([]);
    const [currentBug, setCurrentBug] = useState<any>(null);
    const [userCode, setUserCode] = useState('');
    const [shiftDifficulty, setShiftDifficulty] = useState<'Intern' | 'Senior' | 'Lead'>('Intern');
    
    // Leaderboard State (Mock)
    const [leaderboard, setLeaderboard] = useState([
        { name: "Dev_X", score: 950 },
        { name: "CodeLawyer", score: 820 },
    ]);

    // --- PROCEDURAL GENERATOR ---
    const startNewShift = (difficulty: string) => {
        // 1. Pick a random bug
        const randomBug = BUGS[Math.floor(Math.random() * BUGS.length)];
        setCurrentBug(randomBug);
        setUserCode(randomBug.code);
        
        // 2. Set Stats based on difficulty
        const time = difficulty === 'Intern' ? 45 : difficulty === 'Senior' ? 60 : 90;
        setTimer(time);
        setHealth(100);
        setActiveNotes([]);
        setShiftDifficulty(difficulty as any);
        setGameState('playing');
    };

    // --- GAME LOOP ---
    useEffect(() => {
        if (gameState !== 'playing') return;

        const loop = setInterval(() => {
            // 1. Timer
            setTimer(prev => {
                if (prev <= 0) {
                    setGameState('won');
                    return 0;
                }
                return prev - 1;
            });

            // 2. Health Decay from Urgent Messages
            const urgentCount = activeNotes.filter(n => n.isUrgent).length;
            if (urgentCount > 0) {
                setHealth(prev => {
                    const decay = urgentCount * (shiftDifficulty === 'Lead' ? 1.5 : 0.5); 
                    if (prev - decay <= 0) {
                        setGameState('lost');
                        return 0;
                    }
                    return prev - decay;
                });
            }

            // 3. Procedural Message Spawning
            const spawnChance = shiftDifficulty === 'Intern' ? 0.3 : 0.6;
            if (Math.random() < spawnChance) {
                const isUrgent = Math.random() > 0.7; // 30% chance of urgent
                const pool = isUrgent ? URGENT_PHRASES : CASUAL_PHRASES;
                const text = pool[Math.floor(Math.random() * pool.length)];
                const sender = SENDERS[Math.floor(Math.random() * SENDERS.length)];
                
                const newMsg = {
                    id: Date.now(),
                    sender,
                    message: text,
                    isUrgent
                };
                setActiveNotes(prev => [...prev.slice(-4), newMsg]); // Keep max 5 messages
            }

        }, 1000);

        return () => clearInterval(loop);
    }, [gameState, activeNotes, shiftDifficulty]);

    const fixCode = () => {
        if (!userCode.includes(currentBug.fix)) {
            // Auto-Fix Simulation
            setUserCode(`${userCode} <!-- ${currentBug.fix} applied -->`);
            // Reward
            setHealth(h => Math.min(100, h + 15));
            setActiveNotes(prev => prev.filter(n => !n.isUrgent)); // Clear urgent messages
        }
    };

    // --- SCREENS ---

    if (gameState === 'intro') {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8">
                <div className="max-w-2xl w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 text-center">
                    <ScaleIcon />
                    <h1 className="text-4xl font-bold mt-4 mb-2 text-blue-400">COURT ROOM SIMULATOR</h1>
                    <p className="text-gray-400 mb-8">
                        Every shift is different. Procedurally generated bugs and harassment. 
                        Survive until the timer runs out without getting sued.
                    </p>
                    
                    <h3 className="text-xl font-bold mb-4">Select Shift Difficulty:</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {['Intern', 'Senior', 'Lead'].map((diff) => (
                            <button
                                key={diff}
                                onClick={() => startNewShift(diff)}
                                className="p-4 rounded border border-blue-500 hover:bg-blue-600 transition-colors font-bold"
                            >
                                {diff}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (gameState === 'lost') {
        return (
            <div className="min-h-screen bg-red-950 text-white flex flex-col items-center justify-center">
                <div className="text-center animate-bounce">
                    <GavelIcon />
                </div>
                <h1 className="text-6xl font-bold mt-4 text-red-500">GUILTY</h1>
                <p className="text-2xl mt-2">You were sued for non-compliance.</p>
                <button 
                    onClick={() => setGameState('intro')}
                    className="mt-8 px-8 py-3 bg-white text-red-900 font-bold rounded hover:scale-105 transition-transform"
                >
                    Appeal (Retry)
                </button>
            </div>
        );
    }

    if (gameState === 'won') {
        return (
            <div className="min-h-screen bg-green-950 text-white flex flex-col items-center justify-center p-8">
                <h1 className="text-5xl font-bold text-green-400">SHIFT COMPLETE</h1>
                <p className="text-xl mt-2">Legal Status maintained.</p>
                
                <div className="mt-8 bg-black/50 p-6 rounded-lg w-full max-w-md backdrop-blur">
                    <h3 className="text-2xl font-bold border-b border-gray-600 pb-2 mb-4">Daily Leaderboard</h3>
                    {leaderboard.map((entry, i) => (
                        <div key={i} className="flex justify-between py-2">
                            <span>{i+1}. {entry.name}</span>
                            <span className="font-mono text-green-300">{entry.score} pts</span>
                        </div>
                    ))}
                    <div className="flex justify-between py-2 border-t border-gray-600 mt-2 bg-white/10 px-2 rounded">
                        <span>YOU</span>
                        <span className="font-mono text-green-300">{Math.floor(health * 10)} pts</span>
                    </div>
                </div>

                <button 
                    onClick={() => setGameState('intro')}
                    className="mt-8 px-8 py-3 bg-white text-green-900 font-bold rounded"
                >
                    Next Shift
                </button>
            </div>
        );
    }

    // --- PLAYING UI ---
    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col overflow-hidden font-sans">
            {/* HUD */}
            <div className="bg-gray-800 p-4 shadow-lg z-10 flex justify-between items-center border-b border-gray-700">
                <div className="flex items-center gap-4">
                    <div className="bg-black px-4 py-2 rounded font-mono text-xl border border-blue-500">
                        {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                    </div>
                    <span className="text-sm text-gray-400">Shift: {shiftDifficulty}</span>
                </div>
                
                <div className="flex items-center gap-2 w-1/3">
                    <ScaleIcon />
                    <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-300 ${health > 50 ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${health}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 relative p-8">
                {/* IDE */}
                <div className="w-2/3 h-96 bg-gray-800 rounded-lg border border-gray-600 shadow-2xl overflow-hidden flex flex-col">
                    <div className="bg-gray-900 p-2 text-xs flex gap-2 border-b border-gray-700">
                        <div className="w-3 h-3 rounded-full bg-red-500"/>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                        <div className="w-3 h-3 rounded-full bg-green-500"/>
                        <span className="ml-2 text-gray-400">VS Code - {currentBug?.desc}</span>
                    </div>
                    <textarea 
                        value={userCode}
                        onChange={(e) => setUserCode(e.target.value)}
                        className="flex-1 bg-black text-green-400 p-4 font-mono text-sm resize-none outline-none"
                    />
                    <div className="p-2 bg-gray-900 flex justify-end">
                        <button 
                            onClick={fixCode}
                            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm font-bold transition-colors"
                        >
                            Run Auto-Fixer
                        </button>
                    </div>
                </div>

                {/* NOTIFICATIONS */}
                <div className="absolute top-8 right-8 w-80 space-y-3">
                    {activeNotes.map((note) => (
                        <div 
                            key={note.id}
                            className={`p-4 rounded shadow-lg transform transition-all animate-slide-in border-l-4 cursor-pointer hover:scale-105
                                ${note.isUrgent ? 'bg-red-900/90 border-red-500' : 'bg-gray-800 border-blue-500'}
                            `}
                            onClick={() => setActiveNotes(prev => prev.filter(n => n.id !== note.id))}
                        >
                            <div className="flex justify-between text-xs font-bold mb-1 opacity-75">
                                <span>{note.sender}</span>
                                <span>NOW</span>
                            </div>
                            <p className="text-sm">{note.message}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}