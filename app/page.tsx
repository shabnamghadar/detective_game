'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Suspect, SUSPECTS, GAME_TITLE, GAME_INTRO } from '@/lib/game-data';
import { pickCulprit, generateClue } from '@/lib/game-logic';
import SuspectCard from '@/components/SuspectCard';
import AnimatedBackground from '@/components/AnimatedBackground';
import confetti from 'canvas-confetti';
import { Search, RotateCcw, Award, AlertTriangle, Volume2, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';

// Dynamically import Scanner to avoid SSR issues with html5-qrcode
const Scanner = dynamic(() => import('@/components/Scanner'), { ssr: false });

export default function Home() {
  const [culprit, setCulprit] = useState<Suspect | null>(null);
  const [clues, setClues] = useState<string[]>([]);
  const [eliminatedIds, setEliminatedIds] = useState<string[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [scannedCodes, setScannedCodes] = useState<Set<string>>(new Set());
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (gameStatus === 'won') {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FF69B4', '#FFD700', '#00BFFF', '#32CD32']
      });
      // Second burst
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 120,
          origin: { y: 0.7 },
          colors: ['#FF69B4', '#FFD700', '#00BFFF', '#32CD32']
        });
      }, 500);
    }
  }, [gameStatus]);

  // Initialize game
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const newCulprit = pickCulprit();
    setCulprit(newCulprit);
    setClues([]);
    setEliminatedIds([]);
    setGameStatus('playing');
    setScannedCodes(new Set());
    setLastScannedCode(null);
    console.log("Secret Culprit:", newCulprit.name); // For debugging
  };

  const playIntro = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  };

  const handleScan = (code: string) => {
    if (scannedCodes.has(code)) {
      alert("You've already scanned this clue!");
      setShowScanner(false);
      return;
    }

    if (!culprit) return;

    const newClue = generateClue(culprit, clues);
    
    setClues(prev => [...prev, newClue]);
    setScannedCodes(prev => new Set(prev).add(code));
    setLastScannedCode(code);
    setShowScanner(false);
  };

  const toggleEliminate = (id: string) => {
    setEliminatedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleAccuse = (id: string) => {
    if (!culprit) return;
    if (id === culprit.id) {
      setGameStatus('won');
    } else {
      setGameStatus('lost');
    }
  };

  if (!culprit) return <div className="p-10 text-center">Loading Mystery...</div>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 pb-20 font-sans selection:bg-indigo-200 selection:text-indigo-900 relative overflow-hidden">
      <AnimatedBackground />
      <audio ref={audioRef} src="/intro.mp3" />
      
      {/* Header */}
      <header className="max-w-4xl mx-auto mt-4 rounded-3xl bg-indigo-600/95 backdrop-blur-md text-white p-6 shadow-xl sticky top-4 z-40 border-2 border-indigo-400/50">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">🕵️‍♀️ {GAME_TITLE}</h1>
            <p className="text-indigo-200 text-sm mt-1">{GAME_INTRO}</p>
          </div>
          <div className="flex gap-2">
            <a 
              href="/print_clues.html" 
              target="_blank"
              className="bg-indigo-500 hover:bg-indigo-400 text-white p-2 rounded-full transition-colors flex items-center justify-center"
              title="Print Clues"
            >
              <Printer className="w-5 h-5" />
            </a>
            <button 
              onClick={playIntro}
              className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-full transition-colors flex items-center gap-2 font-medium"
              title="Play Case Intro"
            >
              <Volume2 className="w-5 h-5" /> Listen to Case
            </button>
            <button 
              onClick={startNewGame}
              className="bg-indigo-700 hover:bg-indigo-800 text-white p-2 rounded-full transition-colors"
              title="Restart Game"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8">
        
        {/* Game Over States */}
        {gameStatus === 'won' && (
          <div className="bg-green-100 border-l-4 border-green-500 p-6 rounded-r-lg shadow-md animate-bounce">
            <h2 className="text-2xl font-bold text-green-800 flex items-center gap-2">
              <Award className="w-8 h-8" /> CASE SOLVED!
            </h2>
            <p className="text-green-700 mt-2 text-lg">
              You caught <strong>{culprit.name}</strong>! The {culprit.power} gave it away!
            </p>
            <button onClick={startNewGame} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-green-700">
              New Case
            </button>
          </div>
        )}

        {gameStatus === 'lost' && (
          <div className="bg-red-100 border-l-4 border-red-500 p-6 rounded-r-lg shadow-md">
            <h2 className="text-2xl font-bold text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-8 h-8" /> OH NO!
            </h2>
            <p className="text-red-700 mt-2 text-lg">
              The real culprit was <strong>{culprit.name}</strong>! The yarn is gone forever!
            </p>
            <button onClick={startNewGame} className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-red-700">
              Try Again
            </button>
          </div>
        )}

        {/* Clue Section */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-500" />
              Clues Found ({clues.length})
            </h2>
            <button 
              onClick={() => setShowScanner(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full font-bold shadow-md transition-transform active:scale-95 flex items-center gap-2"
              disabled={gameStatus !== 'playing'}
            >
              📷 Scan Clue
            </button>
          </div>
          
          {clues.length === 0 ? (
            <div className="text-center py-8 text-slate-400 italic bg-slate-50 rounded-lg border border-dashed border-slate-200">
              No clues yet! Scan a QR code to find one.
            </div>
          ) : (
            <ul className="space-y-3">
              {clues.map((clue, index) => (
                <li key={index} className="bg-indigo-50 text-indigo-900 p-3 rounded-lg border border-indigo-100 flex gap-3 animate-in fade-in slide-in-from-bottom-2">
                  <span className="font-bold text-indigo-400">#{index + 1}</span>
                  {clue}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Suspects Grid */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4">Suspects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUSPECTS.map((suspect) => (
              <SuspectCard 
                key={suspect.id}
                suspect={suspect}
                isEliminated={eliminatedIds.includes(suspect.id)}
                isGuilty={culprit?.id === suspect.id}
                gameStatus={gameStatus}
                onToggleEliminate={toggleEliminate}
                onAccuse={(id) => handleAccuse(id)}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Scanner Modal */}
      {showScanner && (
        <Scanner 
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </main>
  );
}