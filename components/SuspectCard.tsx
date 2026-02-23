'use client';

import { Suspect } from '@/lib/game-data';
import { cn } from '@/lib/utils';
import { User, CheckCircle, XCircle, Lock } from 'lucide-react';

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

  return (
    <div 
      className={cn(
        "relative rounded-3xl border-4 p-5 shadow-lg transition-all duration-300 transform perspective-1000 hover:shadow-2xl hover:scale-[1.02] active:scale-95 group overflow-hidden bg-white",
        isEliminated ? "opacity-60 border-dashed border-gray-300 scale-95 grayscale filter blur-[1px]" : "border-white hover:border-indigo-200",
        showJail && "ring-8 ring-red-500 bg-red-50 animate-pulse border-red-600 grayscale-0 opacity-100 scale-100 blur-0",
        "flex flex-col gap-3 animate-in zoom-in duration-500 fill-mode-backwards"
      )}
    >
      {/* Eliminated Stamp */}
      {isEliminated && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none animate-in zoom-in duration-300">
           <div className="border-8 border-red-600 text-red-600 font-black text-4xl px-4 py-2 -rotate-12 opacity-80 uppercase tracking-widest animate-in zoom-in duration-300 transform scale-125 shadow-xl bg-white/50 backdrop-blur-sm">
             ELIMINATED
           </div>
        </div>
      )}

      {/* Jail Bars Overlay */}
      <div 
        className={cn(
            "absolute inset-0 z-30 flex flex-col justify-between pointer-events-none transition-transform duration-500 ease-out",
            showJail ? "translate-y-0" : "-translate-y-full"
        )}
      >
          <div className="w-full h-full border-x-[12px] border-y-[12px] border-gray-800 absolute inset-0 rounded-3xl bg-black/10"></div>
          <div className="flex justify-evenly h-full absolute inset-0">
             {[...Array(5)].map((_, i) => (
               <div key={i} className="w-6 h-full bg-gray-800 shadow-2xl"></div>
             ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center z-40">
             <div className={cn(
                 "bg-red-600 text-white font-black text-4xl px-8 py-4 -rotate-12 border-8 border-double border-white shadow-2xl transition-all duration-500 delay-300",
                 showJail ? "scale-100 opacity-100 rotate-[-12deg]" : "scale-0 opacity-0 rotate-0"
             )}>
               GUILTY!
             </div>
          </div>
      </div>

      <div className="flex justify-between items-start z-10 relative">
        <div className="flex gap-4 items-center w-full">
          <div className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white ring-2 ring-black/5 shrink-0 transition-transform group-hover:scale-110", 
            suspect.color
          )}>
            {suspect.avatar.startsWith('/') || suspect.avatar.startsWith('http') ? (
              <img src={suspect.avatar} alt={suspect.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-5xl filter drop-shadow-md select-none">{suspect.avatar}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-2xl text-slate-800 tracking-tight leading-none mb-1 group-hover:text-indigo-600 transition-colors">{suspect.name}</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider bg-slate-100 inline-block px-2 py-0.5 rounded-md">{suspect.power}</p>
          </div>
        </div>
        
        {isEliminated && <XCircle className="text-red-400 w-8 h-8 shrink-0 animate-in zoom-in duration-300" />}
      </div>

      <p className="text-sm text-slate-600 italic line-clamp-2 px-1 font-medium">
        "{suspect.description}"
      </p>

      <div className="flex flex-wrap gap-1.5 mt-1">
        {suspect.traits.map((trait, i) => (
          <span key={i} className="text-[11px] bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full text-indigo-700 font-bold tracking-wide shadow-sm">
            {trait}
          </span>
        ))}
      </div>

      <div className="mt-4 flex gap-2 z-10">
        {gameStatus === 'playing' && (
          <button
            onClick={() => onToggleEliminate(suspect.id)}
            className={cn(
              "flex-1 py-2 rounded-lg text-sm font-medium transition-colors",
              isEliminated 
                ? "bg-gray-200 text-gray-500 hover:bg-gray-300"
                : "bg-red-50 text-red-600 hover:bg-red-100"
            )}
          >
            {isEliminated ? "Restore" : "Eliminate"}
          </button>
        )}
        
        {gameStatus === 'playing' && !isEliminated && (
          <button
            onClick={() => onAccuse(suspect.id)}
            className="flex-1 py-2 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-medium hover:bg-indigo-100 transition-colors"
          >
            Accuse!
          </button>
        )}
      </div>
    </div>
  );
}
