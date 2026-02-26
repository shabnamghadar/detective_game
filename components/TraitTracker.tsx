'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const ALL_TRAITS = ['Shiny', 'Dark', 'Soft', 'Sharp'];

interface TraitTrackerProps {
  activeTraits: string[];
  onToggleTrait: (trait: string) => void;
}

export default function TraitTracker({ activeTraits, onToggleTrait }: TraitTrackerProps) {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-amber-500/30 mb-6">
      <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2 font-[family-name:var(--font-special-elite)]">
        <span className="text-lg">🕵️‍♀️</span> Detective's Notebook: Filter Suspects
      </h3>
      <div className="flex flex-wrap gap-3">
        {ALL_TRAITS.map((trait) => {
          const isActive = activeTraits.includes(trait);
          return (
            <button
              key={trait}
              onClick={() => onToggleTrait(trait)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-bold border-2 transition-all duration-300 font-mono uppercase tracking-wider",
                isActive 
                  ? "bg-amber-600 text-slate-900 border-amber-500 shadow-lg scale-105 shadow-amber-500/20" 
                  : "bg-slate-800 text-slate-300 border-slate-600 hover:border-amber-500/50 hover:text-amber-400 hover:bg-slate-700"
              )}
            >
              {isActive ? '✓ ' : '+ '} {trait}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-amber-200/50 mt-3 font-mono">
        Click tags to highlight suspects who match the evidence you found.
      </p>
    </div>
  );
}
