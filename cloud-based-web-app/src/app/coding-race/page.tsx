'use client';

import { useState, useEffect } from 'react';

const CODE_TO_TYPE = "const race = async () => { await start(); return 'winner'; }";

export default function CodingRacesVisual() {
  const [userInput, setUserInput] = useState('');
  const [progress, setProgress] = useState(0);
  const [botProgress, setBotProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, racing, won, lost

  // Bot Logic (Opponent)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'racing') {
      interval = setInterval(() => {
        setBotProgress(prev => {
          if (prev >= 100) {
            setStatus('lost');
            return 100;
          }
          return prev + 0.8; // Bot speed
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === 'idle') setStatus('racing');
    if (status !== 'racing' && status !== 'idle') return;

    const val = e.target.value;
    setUserInput(val);

    // Calculate progress based on correct characters
    let correctChars = 0;
    for (let i = 0; i < val.length; i++) {
        if (val[i] === CODE_TO_TYPE[i]) correctChars++;
        else break; // Stop counting at first mistake
    }

    const percentage = (correctChars / CODE_TO_TYPE.length) * 100;
    setProgress(percentage);

    if (val === CODE_TO_TYPE) {
        setStatus('won');
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-10 italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600">
            SPEED CODER 3000
        </h1>

        {/* RACE TRACK VISUAL */}
        <div className="w-full max-w-4xl bg-gray-800 rounded-lg p-6 border-4 border-gray-700 relative mb-12 shadow-2xl">
            
            {/* Lane 1: Player */}
            <div className="mb-8 relative">
                <div className="text-xs text-blue-400 mb-1 font-bold">YOU (Developer)</div>
                <div className="h-12 bg-gray-900 rounded-full w-full relative overflow-hidden border border-blue-900/50">
                    <div className="absolute top-0 bottom-0 left-0 bg-blue-600 opacity-20" style={{ width: `${progress}%`, transition: 'width 0.2s' }}></div>
                    {/* The Car Icon */}
                    <div className="absolute top-1 text-3xl transition-all duration-200" style={{ left: `calc(${progress}% - 30px)` }}>
                        🏎️
                    </div>
                </div>
            </div>

            {/* Lane 2: Bot */}
            <div className="relative">
                <div className="text-xs text-red-400 mb-1 font-bold">OPPONENT (AI Copilot)</div>
                <div className="h-12 bg-gray-900 rounded-full w-full relative overflow-hidden border border-red-900/50">
                    <div className="absolute top-0 bottom-0 left-0 bg-red-600 opacity-20" style={{ width: `${botProgress}%`, transition: 'width 0.2s' }}></div>
                    {/* The Car Icon */}
                    <div className="absolute top-1 text-3xl transition-all duration-200" style={{ left: `calc(${botProgress}% - 30px)` }}>
                        🚔
                    </div>
                </div>
            </div>

            {/* Finish Line */}
            <div className="absolute top-0 bottom-0 right-10 w-2 bg-checkered opacity-50 border-l border-white/20"></div>
        </div>

        {/* TYPING AREA */}
        <div className="w-full max-w-2xl text-center">
            <div className="mb-4 bg-black p-4 rounded-lg font-mono text-lg text-left shadow-inner border border-gray-700 select-none">
                {CODE_TO_TYPE.split('').map((char, index) => {
                    let color = 'text-gray-500';
                    if (index < userInput.length) {
                        color = userInput[index] === char ? 'text-green-400' : 'text-red-500 bg-red-900/50';
                    }
                    return <span key={index} className={color}>{char}</span>
                })}
            </div>

            <input 
                autoFocus
                value={userInput}
                onChange={handleInput}
                className="w-full bg-gray-800 text-white font-mono text-xl p-4 rounded-lg border-2 border-blue-500 focus:outline-none focus:ring-4 ring-blue-500/50 placeholder-gray-600"
                placeholder="Type the code above to drive!"
                disabled={status === 'won' || status === 'lost'}
            />

            {/* GAME STATUS OVERLAY */}
            {(status === 'won' || status === 'lost') && (
                <div className="mt-8 animate-fade-in">
                    <h2 className={`text-5xl font-bold ${status === 'won' ? 'text-green-500' : 'text-red-500'}`}>
                        {status === 'won' ? 'VICTORY!' : 'ELIMINATED!'}
                    </h2>
                    <button onClick={() => window.location.reload()} className="mt-4 px-8 py-3 bg-white text-black font-bold rounded hover:scale-110 transition-transform">
                        RACE AGAIN
                    </button>
                </div>
            )}
        </div>
    </main>
  );
}