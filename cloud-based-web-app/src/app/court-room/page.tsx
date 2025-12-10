'use client';

import React, { useState, useEffect } from 'react';
import { LucideGavel, LucideScale, LucideAlertTriangle, LucideCheckCircle, LucideClock } from 'lucide-react';

const OfficeBackground = () => (
  <svg viewBox="0 0 800 600" className="w-full h-full object-cover select-none pointer-events-none" preserveAspectRatio="none">
    {/* Wall */}
    <rect x="0" y="0" width="800" height="400" fill="#1e293b" /> 

    <rect x="500" y="50" width="200" height="150" fill="#0f172a" stroke="#334155" strokeWidth="8" />
    <circle cx="650" cy="90" r="20" fill="#facc15" opacity="0.8" /> 
    <rect x="580" y="80" width="10" height="10" fill="white" opacity="0.5" />
    <rect x="520" y="120" width="10" height="10" fill="white" opacity="0.3" />

    {/* Desk Surface */}
    <path d="M0 400 L800 400 L800 600 L0 600 Z" fill="#475569" />

    {/* Monitor Stand */}
    <rect x="350" y="350" width="100" height="60" fill="#0f172a" />
    <path d="M320 410 L480 410 L500 430 L300 430 Z" fill="#0f172a" />

    {/* Monitor Screen Frame */}
    <rect x="150" y="100" width="500" height="300" rx="10" fill="#020617" stroke="#334155" strokeWidth="4" />
    
    {/* Screen Black Background (The editor sits on top of this) */}
    <rect x="160" y="110" width="480" height="280" fill="#000" />

    {/* Coffee Mug */}
    <path d="M680 450 L720 450 L715 520 L685 520 Z" fill="#ef4444" />
    <path d="M720 460 C 740 460, 740 490, 720 490" fill="none" stroke="#ef4444" strokeWidth="8" />
    
    {/* Steam Animation */}
    <g>
        <path d="M690 430 Q 700 420, 690 410" stroke="#fff" strokeWidth="2" opacity="0.3">
            <animate attributeName="d" values="M690 430 Q 700 420, 690 410; M690 420 Q 680 410, 690 400" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
        </path>
    </g>

    {/* Keyboard Silhouette */}
    <path d="M200 480 L600 480 L620 550 L180 550 Z" fill="#1e293b" />
  </svg>
);

const CourtroomBackground = () => (
  <svg viewBox="0 0 800 600" className="w-full h-full object-cover select-none pointer-events-none" preserveAspectRatio="none">
    <rect x="0" y="0" width="800" height="600" fill="#451a03" />
    <rect x="100" y="0" width="50" height="400" fill="#78350f" />
    <rect x="650" y="0" width="50" height="400" fill="#78350f" />
    <path d="M100 600 L150 350 L650 350 L700 600 Z" fill="#713f12" />
    <rect x="150" y="350" width="500" height="20" fill="#92400e" />
    <g transform="translate(400, 340) rotate(-15)">
        <rect x="-60" y="-30" width="120" height="60" rx="5" fill="#5f370e" stroke="#3f2305" strokeWidth="2" />
        <rect x="-65" y="-35" width="10" height="70" fill="#b45309" />
        <rect x="55" y="-35" width="10" height="70" fill="#b45309" />
        <rect x="-10" y="30" width="20" height="150" fill="#5f370e" />
    </g>
    <path d="M350 420 L450 420 L470 450 L330 450 Z" fill="#3f2305" />
    <defs>
      <radialGradient id="vignette" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="60%" stopColor="black" stopOpacity="0" />
        <stop offset="100%" stopColor="black" stopOpacity="0.7" />
      </radialGradient>
    </defs>
    <rect x="0" y="0" width="800" height="600" fill="url(#vignette)" />
  </svg>
);


const BUGS = [
    { code: '<img src="logo.png" />', fix: 'alt=', desc: 'Missing Alt Text' },
    { code: '<input type="text" />', fix: 'aria-label=', desc: 'Missing ARIA Label' },
    { code: 'div { color: #555; bg: #545; }', fix: 'contrast', desc: 'Low Contrast Ratio' },
    { code: 'button { outline: none; }', fix: 'focus', desc: 'Removed Focus Ring' },
    { code: '<a href="#">Click here</a>', fix: 'descriptive', desc: 'Vague Link Text' },
    { code: '<div onClick={...}>Button</div>', fix: 'role="button"', desc: 'Non-interactive element' },
    { code: '<button></button>', fix: 'aria-label', desc: 'Empty Button' },
    { code: '<div role="button">Submit</div>', fix: 'tabIndex', desc: 'Not Focusable' },
    { code: '<html lang="">', fix: 'en', desc: 'Missing Language Attribute' },
    { code: '<video src="vid.mp4" />', fix: 'track', desc: 'Missing Captions' }
];

const SENDERS = [
    'BOSS', 'AGILE COACH', 'HR DEPT', 'CLIENT', 'JUNIOR DEV', 'MOM', 
    'CEO', 'DESIGNER', 'QA TEAM', 'UNKNOWN', 'SERVER'
];

const URGENT_PHRASES = [
    "URGENT: Accessibility audit failed!",
    "LAWSUIT INCOMING: Fix the site now!",
    "CRITICAL: The screen reader is crashing.",
    "STOP DEPLOY: Compliance issues found.",
    "WHY IS THIS NOT DONE???",
    "Client is on the phone SCREAMING.",
    "Did you break production??",
    "ACCESSIBILITY VIOLATION DETECTED"
];

const CASUAL_PHRASES = [
    "Did you see the game last night?",
    "Don't forget the potluck lunch.",
    "Can you review my PR when free?",
    "Where is the coffee?",
    "Check out this cat video.",
    "Team building event next week!",
    "Anyone want boba?",
    "Is the wifi slow for you too?",
    "Meeting in 5 mins (Optional)",
    "Happy Birthday to Dave!"
];


export default function App() {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'won' | 'lost'>('intro');
    const [health, setHealth] = useState(100);
    const [timer, setTimer] = useState(60);
    const [activeNotes, setActiveNotes] = useState<any[]>([]);
    const [currentBug, setCurrentBug] = useState<any>(null);
    const [userCode, setUserCode] = useState('');
    const [shiftDifficulty, setShiftDifficulty] = useState<'Intern' | 'Senior' | 'Lead'>('Intern');
    
    const [leaderboard] = useState([
        { name: "Dev_X", score: 950 },
        { name: "CodeLawyer", score: 820 },
    ]);

    const startNewShift = (difficulty: string) => {
        spawnBug();
        const time = difficulty === 'Intern' ? 45 : difficulty === 'Senior' ? 40 : 30;
        setTimer(time);
        setHealth(100);
        setActiveNotes([]);
        setShiftDifficulty(difficulty as any);
        setGameState('playing');
    };

    const spawnBug = () => {
        const randomBug = BUGS[Math.floor(Math.random() * BUGS.length)];
        setCurrentBug(randomBug);
        setUserCode(randomBug.code);
    };

    useEffect(() => {
        if (gameState !== 'playing') return;

        const loop = setInterval(() => {
            setTimer(prev => {
                if (prev <= 0) {
                    setGameState('won');
                    return 0;
                }
                return prev - 1;
            });

            const urgentCount = activeNotes.filter(n => n.isUrgent).length;
            if (urgentCount > 0) {
                setHealth(prev => {
                    const decay = urgentCount * (shiftDifficulty === 'Lead' ? 2.5 : shiftDifficulty === 'Senior' ? 1.5 : 0.8); 
                    if (prev - decay <= 0) {
                        setGameState('lost');
                        return 0;
                    }
                    return prev - decay;
                });
            }

            const baseChance = shiftDifficulty === 'Intern' ? 0.3 : shiftDifficulty === 'Senior' ? 0.6 : 0.85;
            
            if (Math.random() < baseChance) {
                const isUrgent = Math.random() > (shiftDifficulty === 'Intern' ? 0.8 : 0.6);
                const pool = isUrgent ? URGENT_PHRASES : CASUAL_PHRASES;
                const text = pool[Math.floor(Math.random() * pool.length)];
                const sender = SENDERS[Math.floor(Math.random() * SENDERS.length)];

                const randomTop = Math.floor(Math.random() * 80); // 0-80%
                const randomLeft = Math.floor(Math.random() * 80); // 0-80%
                const randomRotation = Math.floor(Math.random() * 20) - 10; // -10 to 10 deg

                const newMsg = {
                    id: Date.now(),
                    sender,
                    message: text,
                    isUrgent,
                    top: randomTop,
                    left: randomLeft,
                    rotation: randomRotation
                };
                setActiveNotes(prev => [...prev.slice(-12), newMsg]); 
            }

        }, 1000);

        return () => clearInterval(loop);
    }, [gameState, activeNotes, shiftDifficulty]);

    const fixCode = () => {
        if (!userCode.includes(currentBug.fix)) {
            setUserCode(`${userCode.split('}')[0].split('>')[0]} ${currentBug.fix} ...`);
        }

        setHealth(h => Math.min(100, h + 15));
    
        const firstUrgent = activeNotes.find(n => n.isUrgent);
        if (firstUrgent) {
            setActiveNotes(prev => prev.filter(n => n.id !== firstUrgent.id));
        }
        
        setTimeout(spawnBug, 500);
    };


    if (gameState === 'intro') {
        return (
            <div className="relative w-full h-screen bg-slate-900 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-40 blur-sm">
                    <CourtroomBackground />
                </div>
                
                <div className="relative z-10 max-w-2xl w-full bg-slate-800/90 backdrop-blur p-8 rounded-2xl shadow-2xl border border-slate-700 text-center">
                    <LucideScale className="w-16 h-16 mx-auto text-blue-400 mb-4" />
                    <h1 className="text-4xl font-bold mt-4 mb-2 text-white">COURT ROOM SIMULATOR</h1>
                    <p className="text-gray-300 mb-8 text-lg">
                        You are a Junior Dev on trial. Your code has violated accessibility laws.<br/>
                        Fix the bugs live in production. 
                        <br/><span className="text-red-400 font-bold">WARNING: Management is very chaotic today.</span>
                    </p>
                    
                    <h3 className="text-xl font-bold mb-4 text-white">Select Shift Difficulty:</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {['Intern', 'Senior', 'Lead'].map((diff) => (
                            <button
                                key={diff}
                                onClick={() => startNewShift(diff)}
                                className="p-4 rounded border-2 border-blue-500 hover:bg-blue-600 hover:border-blue-400 text-white transition-all font-bold shadow-lg hover:shadow-blue-500/50"
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
            <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0">
                    <CourtroomBackground />
                </div>
                <div className="relative z-10 text-center p-12 bg-black/80 backdrop-blur-md rounded-xl border-2 border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.5)]">
                    <LucideGavel className="w-24 h-24 mx-auto text-red-500 mb-6" />
                    <h1 className="text-8xl font-black mt-4 text-red-500 tracking-tighter drop-shadow-lg uppercase">Guilty</h1>
                    <p className="text-3xl mt-6 text-white font-serif italic border-t border-red-900 pt-6">"Gross Negligence of WCAG 2.1"</p>
                    <p className="text-lg text-red-400 mt-2">You ignored too many urgent alerts.</p>
                    <button 
                        onClick={() => setGameState('intro')}
                        className="mt-8 px-12 py-4 bg-red-700 text-white font-bold rounded hover:bg-red-600 transition-all shadow-lg hover:shadow-red-500/50"
                    >
                        APPEAL (RETRY)
                    </button>
                </div>
            </div>
        );
    }

    if (gameState === 'won') {
        return (
            <div className="relative w-full h-screen bg-green-950 text-white flex flex-col items-center justify-center p-8 overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                     <OfficeBackground />
                </div>
                
                <div className="relative z-10 flex flex-col items-center">
                    <LucideCheckCircle className="w-24 h-24 text-green-400 mb-4" />
                    <h1 className="text-6xl font-bold text-green-400">SHIFT COMPLETE</h1>
                    <p className="text-2xl mt-2 text-green-100">Legal Status: <span className="font-bold text-white">COMPLIANT</span></p>
                    
                    <div className="mt-8 bg-black/60 p-6 rounded-lg w-full max-w-md backdrop-blur border border-green-500/30">
                        <h3 className="text-2xl font-bold border-b border-gray-600 pb-2 mb-4 text-green-200">Daily Leaderboard</h3>
                        {leaderboard.map((entry, i) => (
                            <div key={i} className="flex justify-between py-2 border-b border-gray-700/50">
                                <span>{i+1}. {entry.name}</span>
                                <span className="font-mono text-green-300">{entry.score} pts</span>
                            </div>
                        ))}
                        <div className="flex justify-between py-3 border-t-2 border-green-500 mt-2 bg-green-500/10 px-2 rounded font-bold">
                            <span>YOU</span>
                            <span className="font-mono text-green-300">{Math.floor(health * 10)} pts</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => setGameState('intro')}
                        className="mt-8 px-8 py-3 bg-white text-green-900 font-bold rounded hover:bg-green-100 transition-colors shadow-lg"
                    >
                        Next Shift
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-screen bg-black flex items-center justify-center overflow-hidden font-sans relative">
            
            <div className="relative w-full max-w-[1200px] aspect-[4/3] shadow-2xl overflow-hidden bg-[#1e293b]">
                <div className="absolute inset-0 z-0">
                    <OfficeBackground />
                </div>
                <div 
                    className="absolute z-10 flex flex-col overflow-hidden"
                    style={{
                        left: '20%',
                        top: '18.33%',
                        width: '60%',
                        height: '46.66%',
                        backgroundColor: '#0d1117',
                    }}
                >
                    <div className="bg-[#161b22] px-3 py-1 flex justify-between items-center border-b border-[#30363d]">
                        <span className="text-[10px] text-gray-400 flex items-center gap-2">
                             <LucideAlertTriangle className="w-3 h-3 text-yellow-500" />
                             bug_report.tsx
                        </span>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500 opacity-50"/>
                            <div className="w-2 h-2 rounded-full bg-yellow-500 opacity-50"/>
                            <div className="w-2 h-2 rounded-full bg-green-500 opacity-50"/>
                        </div>
                    </div>
                    <div className="flex-1 relative font-mono text-sm p-4 text-gray-300 leading-relaxed overflow-hidden">
                        <div className="absolute top-0 left-0 bottom-0 w-8 bg-[#161b22] border-r border-[#30363d] text-gray-600 text-[10px] flex flex-col items-end pr-2 pt-4 select-none">
                            {Array.from({length: 10}).map((_, i) => <div key={i}>{i+1}</div>)}
                        </div>
                        <div className="ml-10">
                            <div className="text-gray-500 text-xs mb-2">// TODO: {currentBug?.desc}</div>
                            <textarea 
                                value={userCode}
                                onChange={(e) => setUserCode(e.target.value)}
                                className="w-full h-full bg-transparent outline-none resize-none text-green-400 placeholder-green-900/50"
                                spellCheck="false"
                            />
                        </div>
                    </div>
                </div>

                <div className="absolute inset-0 z-20 pointer-events-none">
                    {activeNotes.map((note) => (
                        <div 
                            key={note.id}
                            className={`
                                absolute w-48 p-3 shadow-md transform transition-all animate-slide-in cursor-pointer hover:scale-105 font-handwriting text-sm pointer-events-auto
                                ${note.isUrgent ? 'bg-yellow-200 text-red-800 border-t-4 border-red-500/50 z-50' : 'bg-yellow-100 text-gray-800 z-40'}
                            `}
                            style={{ 
                                fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
                                top: `${note.top}%`,
                                left: `${note.left}%`,
                                transform: `rotate(${note.rotation}deg)`
                            }}
                            onClick={() => setActiveNotes(prev => prev.filter(n => n.id !== note.id))}
                        >
                            <div className="flex justify-between text-[10px] font-bold opacity-50 uppercase tracking-wider mb-1 border-b border-black/10 pb-1">
                                <span>{note.sender}</span>
                                <span>NOW</span>
                            </div>
                            <p className="leading-tight font-medium">{note.message}</p>
                        </div>
                    ))}
                </div>
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-50 pointer-events-none">
                    {/* Timer Widget */}
                    <div className="bg-slate-900/90 text-white px-4 py-2 rounded-lg border border-slate-700 shadow-xl backdrop-blur flex items-center gap-3">
                        <LucideClock className={`w-5 h-5 ${timer < 10 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`} />
                        <span className="font-mono text-2xl font-bold tracking-widest">
                            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                        </span>
                    </div>

                    <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-700 shadow-xl backdrop-blur w-64">
                        <div className="flex justify-between text-xs text-gray-400 mb-1 uppercase font-bold tracking-wider">
                            <span>Compliance</span>
                            <span>{Math.floor(health)}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-300 ${health > 50 ? 'bg-gradient-to-r from-blue-500 to-green-400' : 'bg-gradient-to-r from-red-600 to-orange-500 animate-pulse'}`}
                                style={{ width: `${health}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-[5%] right-[5%] z-50">
                     <button 
                        onClick={fixCode}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-blue-900/50 border border-blue-400 transition-all active:scale-95 flex items-center gap-2 group"
                    >
                        <LucideCheckCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        DEPLOY FIX
                    </button>
                </div>

            </div>
        </div>
    );
}