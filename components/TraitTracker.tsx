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
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-indigo-100 mb-6">
      <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-widest mb-3 flex items-center gap-2">
        <span className="text-lg">🕵️‍♀️</span> Detective's Notebook: Filter Suspects
      </h3>
      <div className="flex flex-wrap gap-2">
        {ALL_TRAITS.map((trait) => {
          const isActive = activeTraits.includes(trait);
          return (
            <button
              key={trait}
              onClick={() => onToggleTrait(trait)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-bold border-2 transition-all duration-200",
                isActive 
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md scale-105" 
                  : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
              )}
            >
              {isActive ? '✓ ' : '+ '} {trait}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 mt-2 italic">
        Click tags to highlight suspects who match the evidence you found.
      </p>
    </div>
  );
}
