'use client';

import { useState, useEffect } from 'react';
import { Suspect } from '@/lib/game-data';
import { cn } from '@/lib/utils';
import { XCircle } from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface SuspectCardProps {
  suspect: Suspect;
  isEliminated: boolean;
  isGuilty: boolean;
  gameStatus: 'playing' | 'won' | 'lost';
  onToggleEliminate: (id: string) => void;
  onAccuse: (id: string) => void;
}

export default function SuspectCard({ suspect, isEliminated, isGuilty, gameStatus, onToggleEliminate, onAccuse }: SuspectCardProps) {
  const showJail = gameStatus === 'won' && isGuilty;
  const [imgError, setImgError] = useState(false);

  // Play stamp sound on state changes
  useEffect(() => {
    if (isEliminated || showJail) {
      sounds?.playStamp();
    }
  }, [isEliminated, showJail]);

  const handleToggle = () => {
    onToggleEliminate(suspect.id);
  };

  return (
    <div className="relative group mt-6 h-full">
      {/* Folder Tab */}
      <div className={cn(
        "absolute -top-6 left-0 w-1/3 h-8 bg-[#f8f5e6] border-t-2 border-l-2 border-r-2 border-[#d1ccb6] rounded-t-xl z-0 transition-colors duration-300",
        isEliminated && "bg-gray-200 border-gray-300"
      )}></div>

      {/* Main Folder Card */}
      <div 
        className={cn(
          "relative z-10 h-full rounded-b-xl rounded-tr-xl border-2 p-5 shadow-md transition-all duration-300 transform perspective-1000 bg-[#f8f5e6] border-[#d1ccb6] flex flex-col gap-3 overflow-hidden",
          !isEliminated && "hover:shadow-xl hover:-translate-y-1 hover:rotate-1",
          isEliminated ? "bg-gray-100 opacity-90 grayscale border-dashed border-gray-300" : "bg-[#f8f5e6]",
          showJail && "ring-8 ring-red-800 bg-red-50 border-red-900 grayscale-0 opacity-100 scale-100"
        )}
      >
        {/* Paper Texture Overlay (Subtle noise) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply rounded-xl"></div>

        {/* Eliminated Stamp */}
        {isEliminated && (
          <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none animate-in zoom-in duration-200 fill-mode-forwards">
             <div className="border-[6px] border-red-700 text-red-700 text-5xl px-6 py-2 -rotate-[15deg] opacity-90 uppercase tracking-widest font-[family-name:var(--font-permanent-marker)] shadow-sm mask-image:linear-gradient(45deg, transparent 5%, black 5%, black 95%, transparent 95%)">
               ELIMINATED
             </div>
          </div>
        )}

        {/* Jail Bars Overlay */}
        <div 
          className={cn(
              "absolute inset-0 z-30 flex flex-col justify-between pointer-events-none transition-transform duration-500 ease-out rounded-xl overflow-hidden backdrop-blur-[2px]",
              showJail ? "translate-y-0" : "-translate-y-full"
          )}
        >
            <div className="w-full h-full border-x-[12px] border-y-[12px] border-gray-900 absolute inset-0 rounded-xl bg-black/30 backdrop-blur-sm"></div>
            <div className="flex justify-evenly h-full absolute inset-0">
               {[...Array(5)].map((_, i) => (
                 <div key={i} className="w-6 h-full bg-gray-800 shadow-2xl border-l border-gray-600"></div>
               ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center z-40">
               <div className={cn(
                   "bg-red-700 text-white text-5xl px-8 py-4 -rotate-12 border-4 border-double border-white shadow-2xl transition-all duration-500 delay-300 font-[family-name:var(--font-permanent-marker)]",
                   showJail ? "scale-100 opacity-100 rotate-[-12deg]" : "scale-0 opacity-0 rotate-0"
               )}>
                 GUILTY!
               </div>
            </div>
        </div>

        {/* Header: Avatar + Name */}
        <div className="flex justify-between items-start z-20 relative">
          <div className="flex gap-4 items-center w-full">
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center text-white shadow-md border-4 border-white ring-1 ring-black/10 shrink-0 transition-transform group-hover:scale-105 overflow-hidden bg-gray-200", 
              !imgError && "bg-white"
            )}>
              {(suspect.avatar.startsWith('/') || suspect.avatar.startsWith('http')) && !imgError ? (
                <img 
                  src={suspect.avatar} 
                  alt={suspect.name} 
                  className="w-full h-full object-cover" 
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-4xl font-bold select-none text-gray-400 font-[family-name:var(--font-permanent-marker)]">{suspect.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-3xl text-gray-800 tracking-tighter leading-none mb-1 font-[family-name:var(--font-permanent-marker)]">{suspect.name}</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest bg-white/50 inline-block px-2 py-1 rounded-sm border border-gray-200 font-mono">{suspect.power}</p>
            </div>
          </div>
          
          {isEliminated && <XCircle className="text-red-800/50 w-8 h-8 shrink-0 animate-in zoom-in duration-300" />}
        </div>

        {/* Description (Typewriter effect / Redacted) */}
        <div className="relative mt-2">
            <p className={cn(
                "text-sm italic leading-relaxed font-[family-name:var(--font-special-elite)] p-2 transition-all duration-300 rounded",
                isEliminated 
                    ? "bg-black text-transparent select-none shadow-inner" 
                    : "text-gray-800 bg-white/40 shadow-sm"
            )}>
                "{suspect.description}"
            </p>
            {isEliminated && (
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50 font-bold text-xs uppercase tracking-widest pointer-events-none font-mono">
                    [REDACTED]
                </span>
            )}
        </div>

        {/* Traits Tags */}
        <div className="flex flex-wrap gap-2 mt-auto z-20">
          {suspect.traits.map((trait, i) => (
            <span key={i} className={cn(
                "text-[10px] px-2 py-1 border font-bold tracking-wide shadow-sm uppercase font-mono transition-opacity",
                isEliminated 
                    ? "bg-gray-300 text-gray-500 border-gray-400 opacity-50" 
                    : "bg-white text-gray-700 border-gray-300"
            )}>
              {trait}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2 z-20">
          {gameStatus === 'playing' && (
            <button
              onClick={handleToggle}
              className={cn(
                "flex-1 py-2 rounded text-sm font-bold uppercase tracking-wider transition-all font-mono border-2 shadow-sm active:translate-y-0.5",
                isEliminated 
                  ? "bg-gray-200 text-gray-500 border-gray-300 hover:bg-gray-300"
                  : "bg-[#f0f0f0] text-red-700 border-red-200 hover:bg-red-50 hover:border-red-300"
              )}
            >
              {isEliminated ? "Restore File" : "Archive File"}
            </button>
          )}
          
          {gameStatus === 'playing' && !isEliminated && (
            <button
              onClick={() => onAccuse(suspect.id)}
              className="flex-1 py-2 rounded text-sm font-bold uppercase tracking-wider bg-gray-800 text-white border-2 border-gray-900 hover:bg-gray-700 hover:border-gray-800 transition-all font-mono shadow-sm active:translate-y-0.5"
            >
              Issue Warrant
            </button>
          )}
        </div>
      </div>
    </div>
  );
}