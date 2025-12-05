'use client';

import { useState, useEffect } from 'react';

// Configuration Types
type NotificationConfig = {
    id: number;
    sender: string;
    message: string;
    isUrgent: boolean;
};

type ScenarioConfig = {
    initialHealth: number;
    brokenCode: string;
    fixedCodeRequire: string; // The code snippet that fixes the bug
    bgOffice: string;
    bgCourt: string;
};

const DEFAULT_MESSAGES: NotificationConfig[] = [
    { id: 1, sender: 'BOSS', message: 'Where is the sprint report?', isUrgent: false },
    { id: 2, sender: 'AGILE', message: 'URGENT: Fix Alt Text Compliance!', isUrgent: true },
    { id: 3, sender: 'FAMILY', message: 'Pick up dinner on way home.', isUrgent: false },
];

export default function CourtRoomBuilder() {
    const [messages, setMessages] = useState<NotificationConfig[]>(DEFAULT_MESSAGES);
    const [scenario, setScenario] = useState<ScenarioConfig>({
        initialHealth: 100,
        brokenCode: '<img src="cat.jpg" />',
        fixedCodeRequire: 'alt=',
        bgOffice: 'Office View',
        bgCourt: 'COURT ROOM'
    });
    const [isPlaying, setIsPlaying] = useState(false);

    // Message Editor Handlers
    const addMessage = () => {
        setMessages([...messages, { id: Date.now(), sender: 'NEW', message: 'Text here', isUrgent: false }]);
    };
    
    const updateMessage = (id: number, field: keyof NotificationConfig, value: any) => {
        setMessages(messages.map(m => m.id === id ? { ...m, [field]: value } : m));
    };

    const deleteMessage = (id: number) => {
        setMessages(messages.filter(m => m.id !== id));
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            {/* --- BUILDER INTERFACE --- */}
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-end mb-8 border-b border-gray-700 pb-4">
                    <div>
                        <h1 className="text-4xl font-bold text-red-400">Court Room Simulator Builder</h1>
                        <p className="text-gray-400">Define the pressure, the bug, and the consequences.</p>
                    </div>
                    <button 
                        onClick={() => setIsPlaying(true)}
                        className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded shadow-lg flex items-center gap-2"
                    >
                        <span>⚖️</span> START SIMULATION
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Message Scripting */}
                    <div className="bg-slate-800 p-6 rounded border border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Incoming Messages</h2>
                            <button onClick={addMessage} className="text-xs bg-blue-600 px-2 py-1 rounded">+ Add</button>
                        </div>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                            {messages.map((msg) => (
                                <div key={msg.id} className="bg-slate-900 p-3 rounded border border-gray-700">
                                    <div className="flex gap-2 mb-2">
                                        <input 
                                            value={msg.sender} 
                                            onChange={(e) => updateMessage(msg.id, 'sender', e.target.value)}
                                            className="bg-slate-800 w-1/3 p-1 text-xs border border-gray-600 rounded"
                                            placeholder="Sender"
                                        />
                                        <label className="flex items-center gap-2 text-xs cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={msg.isUrgent}
                                                onChange={(e) => updateMessage(msg.id, 'isUrgent', e.target.checked)}
                                            />
                                            Urgent?
                                        </label>
                                        <button onClick={() => deleteMessage(msg.id)} className="ml-auto text-red-400 text-xs">X</button>
                                    </div>
                                    <textarea 
                                        value={msg.message}
                                        onChange={(e) => updateMessage(msg.id, 'message', e.target.value)}
                                        className="w-full bg-slate-800 p-2 text-sm border border-gray-600 rounded"
                                        rows={2}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Scenario Settings */}
                    <div className="bg-slate-800 p-6 rounded border border-slate-700">
                        <h2 className="text-xl font-bold mb-4">Scenario Config</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Broken Code (Initial State)</label>
                                <textarea 
                                    value={scenario.brokenCode}
                                    onChange={(e) => setScenario({...scenario, brokenCode: e.target.value})}
                                    className="w-full bg-black text-green-400 font-mono p-2 rounded h-24 border border-gray-600"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Required Fix (Must include string)</label>
                                <input 
                                    value={scenario.fixedCodeRequire}
                                    onChange={(e) => setScenario({...scenario, fixedCodeRequire: e.target.value})}
                                    className="w-full bg-slate-900 p-2 rounded border border-gray-600 font-mono text-yellow-400"
                                />
                                <p className="text-xs text-gray-500 mt-1">If user adds this text, the bug is fixed.</p>
                            </div>

                            <div className="pt-4 border-t border-gray-700">
                                <label className="block text-sm text-gray-400 mb-1">Background Text</label>
                                <input 
                                    value={scenario.bgOffice}
                                    onChange={(e) => setScenario({...scenario, bgOffice: e.target.value})}
                                    className="w-full bg-slate-900 p-2 rounded border border-gray-600 mb-2"
                                    placeholder="e.g. Office View"
                                />
                                <input 
                                    value={scenario.bgCourt}
                                    onChange={(e) => setScenario({...scenario, bgCourt: e.target.value})}
                                    className="w-full bg-slate-900 p-2 rounded border border-gray-600"
                                    placeholder="e.g. COURT ROOM"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- GAME POPUP --- */}
            {isPlaying && (
                <div className="fixed inset-0 z-50 bg-black">
                    <CourtRoomGame 
                        config={scenario} 
                        messagesPool={messages} 
                        onExit={() => setIsPlaying(false)} 
                    />
                </div>
            )}
        </div>
    );
}

// --- THE ACTUAL GAME COMPONENT ---
function CourtRoomGame({ config, messagesPool, onExit }: { config: ScenarioConfig, messagesPool: NotificationConfig[], onExit: () => void }) {
    const [health, setHealth] = useState(config.initialHealth);
    const [activeNotes, setActiveNotes] = useState<NotificationConfig[]>([]);
    const [code, setCode] = useState(config.brokenCode);
    const [gameState, setGameState] = useState<'working' | 'court'>('working');

    // Game Loop
    useEffect(() => {
        if (gameState === 'court') return;

        const interval = setInterval(() => {
            // Pick random message
            const randomMsg = messagesPool[Math.floor(Math.random() * messagesPool.length)];
            const newNote = { ...randomMsg, id: Date.now() + Math.random() };
            
            setActiveNotes(prev => [...prev, newNote]);

            // If urgent ignored, hurt health
            if (activeNotes.filter(n => n.isUrgent).length > 0) {
                setHealth(h => h - 5);
            }
        }, 3000); // Fast paced!

        if (health <= 0) setGameState('court');

        return () => clearInterval(interval);
    }, [activeNotes, health, gameState, messagesPool]);

    const fixCode = () => {
        if (!code.includes(config.fixedCodeRequire)) {
            const fixed = code.replace('/>', ` ${config.fixedCodeRequire}"fixed" />`);
            setCode(fixed);
            // Clear urgent messages
            setActiveNotes(prev => prev.filter(n => !n.isUrgent));
            setHealth(100);
        }
    };

    if (gameState === 'court') {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-red-900 text-white bg-[url('https://placehold.co/1920x1080/4a0000/FFF?text=COURT+ROOM')] bg-cover">
                <div className="bg-black/80 p-10 rounded border-4 border-white text-center">
                    <h1 className="text-5xl font-bold mb-4">GUILTY!</h1>
                    <p className="text-xl">You ignored the legal requirements.</p>
                    <button onClick={onExit} className="mt-8 bg-white text-red-900 px-6 py-2 rounded font-bold">Back to Builder</button>
                </div>
            </div>
        )
    }

    return (
        <div className="relative h-full w-full bg-gray-200 overflow-hidden flex flex-col">
            {/* Top Bar */}
            <div className="bg-gray-800 text-white p-2 flex justify-between items-center z-10 shadow">
                 <span className="font-mono">DevOS v2.0 - {config.bgOffice}</span>
                 <div className="flex items-center gap-4">
                     <div className="w-48 h-4 bg-gray-600 rounded">
                         <div className={`h-full transition-all ${health > 50 ? 'bg-green-500' : 'bg-red-600'}`} style={{width: `${health}%`}} />
                     </div>
                     <button onClick={onExit} className="text-xs bg-red-500 px-2 py-1 rounded">QUIT</button>
                 </div>
            </div>

            {/* Desktop */}
            <div className="flex-1 relative p-8">
                 {/* IDE WINDOW */}
                 <div className="absolute top-10 left-10 w-1/2 bg-gray-900 rounded shadow-2xl border border-gray-700 overflow-hidden">
                     <div className="bg-gray-800 p-2 text-xs text-gray-400">VS Code</div>
                     <textarea 
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-40 bg-black text-green-400 p-4 font-mono text-sm outline-none resize-none"
                     />
                     <div className="p-2 bg-gray-800 text-right">
                         <button onClick={fixCode} className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-500">Auto-Fix Lint</button>
                     </div>
                 </div>

                 {/* NOTIFICATIONS */}
                 <div className="absolute bottom-10 right-10 w-80 flex flex-col-reverse gap-2 pointer-events-none">
                     {activeNotes.slice(-5).map(note => (
                         <div key={note.id} className={`p-4 rounded shadow-lg animate-slide-in pointer-events-auto ${note.isUrgent ? 'bg-red-600 text-white' : 'bg-white text-gray-800'}`}>
                             <div className="flex justify-between">
                                 <span className="font-bold text-xs">{note.sender}</span>
                                 <button onClick={() => setActiveNotes(prev => prev.filter(n => n.id !== note.id))} className="text-xs">X</button>
                             </div>
                             <p className="text-sm mt-1">{note.message}</p>
                         </div>
                     ))}
                 </div>
            </div>
        </div>
    );
}