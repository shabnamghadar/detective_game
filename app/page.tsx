'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Suspect, SUSPECTS, GAME_TITLE, GAME_INTROS } from '@/lib/game-data';
import { pickCulprit, generateClue } from '@/lib/game-logic';
import SuspectCard from '@/components/SuspectCard';
import AnimatedBackground from '@/components/AnimatedBackground';
import TraitTracker from '@/components/TraitTracker';
import confetti from 'canvas-confetti';
import { sounds } from '@/lib/sounds';
import { Search, RotateCcw, Award, AlertTriangle, Volume2, Printer, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Dynamically import Scanner to avoid SSR issues with html5-qrcode
const Scanner = dynamic(() => import('@/components/Scanner'), { ssr: false });

export default function Home() {
  const [culprit, setCulprit] = useState<Suspect | null>(null);
  const [clues, setClues] = useState<string[]>([]);
  const [eliminatedIds, setEliminatedIds] = useState<string[]>([]);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [currentIntro, setCurrentIntro] = useState<string>("");
  const [currentIntroIndex, setCurrentIntroIndex] = useState<number>(0);
  const [showScanner, setShowScanner] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [scannedCodes, setScannedCodes] = useState<Set<string>>(new Set());
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (gameStatus === 'won') {
      sounds?.playWin();
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
    setSelectedTraits([]);
    setGameStatus('playing');
    setShowVideo(false);
    setScannedCodes(new Set());
    setLastScannedCode(null);
    
    // Pick a random intro
    const randomIndex = Math.floor(Math.random() * GAME_INTROS.length);
    setCurrentIntroIndex(randomIndex);
    setCurrentIntro(GAME_INTROS[randomIndex]);
    
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

    sounds?.playScan();
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
      setShowVideo(true);
    } else {
      setGameStatus('lost');
    }
  };

  const handleToggleTrait = (trait: string) => {
    setSelectedTraits(prev => 
      prev.includes(trait) ? prev.filter(t => t !== trait) : [...prev, trait]
    );
  };

  if (!culprit) return <div className="p-10 text-center">Loading Mystery...</div>;

  return (
    <main className="min-h-screen bg-[url('/background.png')] bg-cover bg-center bg-fixed font-sans selection:bg-amber-200 selection:text-slate-900 relative overflow-hidden">
      {/* Moody Overlay */}
      <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply pointer-events-none z-0"></div>
      
      <AnimatedBackground />
      <audio ref={audioRef} src={`/intro_${currentIntroIndex}.mp3`} key={currentIntroIndex} />
      
      {/* Header */}
      <header className="max-w-4xl mx-auto mt-6 rounded-2xl bg-slate-900/80 backdrop-blur-md text-amber-50 p-6 shadow-2xl sticky top-4 z-40 border border-amber-500/30">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-amber-400 font-[family-name:var(--font-special-elite)] drop-shadow-md">🕵️‍♀️ {GAME_TITLE}</h1>
            <p className="text-slate-300 text-sm mt-2 font-mono leading-relaxed max-w-2xl">{currentIntro}</p>
          </div>
          <div className="flex gap-3">
            <a 
              href="/print_clues.html" 
              target="_blank"
              className="bg-slate-800 hover:bg-slate-700 text-amber-400 p-3 rounded-full transition-colors flex items-center justify-center border border-amber-500/30 shadow-lg hover:scale-105"
              title="Print Clues"
            >
              <Printer className="w-5 h-5" />
            </a>
            <button 
              onClick={playIntro}
              className="bg-amber-600 hover:bg-amber-500 text-slate-900 px-5 py-3 rounded-full transition-colors flex items-center gap-2 font-bold shadow-lg hover:scale-105 font-mono"
              title="Play Case Intro"
            >
              <Volume2 className="w-5 h-5" /> Listen
            </button>
            <button 
              onClick={startNewGame}
              className="bg-slate-800 hover:bg-slate-700 text-amber-400 p-3 rounded-full transition-colors border border-amber-500/30 shadow-lg hover:scale-105"
              title="Restart Game"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 relative z-10">
        
        {/* Game Over States */}
        {gameStatus === 'won' && (
          <div className="bg-amber-100 border-l-8 border-amber-500 p-6 rounded-r-xl shadow-2xl animate-bounce">
            <h2 className="text-3xl font-black text-amber-800 flex items-center gap-2 font-[family-name:var(--font-permanent-marker)]">
              <Award className="w-10 h-10" /> CASE SOLVED!
            </h2>
            <p className="text-amber-900 mt-2 text-lg font-mono">
              You caught <strong>{culprit.name}</strong>! The {culprit.power} gave it away!
            </p>
            <button onClick={startNewGame} className="mt-4 bg-amber-600 text-slate-900 px-6 py-2 rounded font-bold shadow hover:bg-amber-500 uppercase tracking-widest border-2 border-amber-800">
              New Case
            </button>
          </div>
        )}

        {gameStatus === 'lost' && (
          <div className="bg-red-900/90 backdrop-blur-md border-l-8 border-red-500 p-6 rounded-r-xl shadow-2xl text-red-50">
            <h2 className="text-3xl font-black text-red-400 flex items-center gap-2 font-[family-name:var(--font-permanent-marker)]">
              <AlertTriangle className="w-10 h-10" /> OH NO!
            </h2>
            <p className="text-red-200 mt-2 text-lg font-mono">
              The real culprit was <strong>{culprit.name}</strong>! The yarn is gone forever!
            </p>
            <button onClick={startNewGame} className="mt-4 bg-red-600 text-white px-6 py-2 rounded font-bold shadow hover:bg-red-500 uppercase tracking-widest border-2 border-red-800">
              Try Again
            </button>
          </div>
        )}

        {/* Trait Tracker */}
        <TraitTracker activeTraits={selectedTraits} onToggleTrait={handleToggleTrait} />

        {/* Clue Section */}
        <section className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-amber-500/30">
          <div className="flex justify-between items-center mb-6 border-b border-amber-500/20 pb-4">
            <h2 className="text-2xl font-bold text-amber-400 flex items-center gap-3 font-[family-name:var(--font-special-elite)] tracking-wide">
              <Search className="w-6 h-6 text-amber-500" />
              Evidence Log ({clues.length})
            </h2>
            <button 
              onClick={() => setShowScanner(true)}
              className="bg-amber-600 hover:bg-amber-500 text-slate-900 px-6 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 uppercase tracking-widest font-mono"
              disabled={gameStatus !== 'playing'}
            >
              📷 Scan Evidence
            </button>
          </div>
          
          {clues.length === 0 ? (
            <div className="text-center py-12 text-amber-200/50 italic bg-slate-800/50 rounded-xl border-2 border-dashed border-amber-500/20 font-mono">
              The evidence log is empty. Scan a code to begin.
            </div>
          ) : (
            <ul className="space-y-4">
              {clues.map((clue, index) => (
                <li key={index} className="bg-slate-800 text-amber-50 p-4 rounded-xl border-l-4 border-amber-500 shadow-md flex gap-4 animate-in fade-in slide-in-from-left-4 font-mono items-center">
                  <span className="font-black text-amber-500 text-xl bg-slate-900 w-8 h-8 flex items-center justify-center rounded-full shrink-0">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{clue}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Suspects Grid */}
        <section>
          <h2 className="text-2xl font-bold text-amber-400 mb-6 drop-shadow-md font-[family-name:var(--font-special-elite)] border-b border-amber-500/30 pb-2 inline-block">The Suspects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Video Overlay for Busted Culprit */}
      {showVideo && culprit && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 p-4 animate-in fade-in duration-500 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-800 flex flex-col items-center justify-center">
            
            {/* Header */}
            <div className="w-full flex justify-between items-center p-4 bg-gray-900 border-b border-gray-800 absolute top-0 left-0 right-0 z-10 shadow-md">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-white uppercase tracking-widest font-[family-name:var(--font-permanent-marker)] text-red-500">
                <Award className="w-8 h-8 text-red-500" /> 
                {culprit.name} BUSTED!
              </h2>
              <button 
                onClick={() => setShowVideo(false)}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors bg-gray-800"
              >
                <X className="w-6 h-6 text-gray-300" />
              </button>
            </div>
            
            {/* Video Player */}
            <div className="w-full relative pt-[72px] pb-4 px-4 flex items-center justify-center min-h-[50vh] bg-black">
              <video 
                src={`/suspects/${culprit.id}.mp4`}
                autoPlay 
                playsInline
                controls
                className="w-full h-auto max-h-[75vh] object-contain rounded-xl shadow-2xl"
                onError={(e) => {
                  console.error("Video not found for", culprit.id);
                  // Hide video modal automatically if the file does not exist
                  setShowVideo(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}