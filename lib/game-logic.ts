import { Suspect, SUSPECTS, FLAVOR_CLUES } from './game-data';

export type GameState = {
  culpritId: string;
  foundClues: string[];
  eliminatedIds: string[];
  status: 'playing' | 'won' | 'lost';
};

export function pickCulprit(): Suspect {
  const index = Math.floor(Math.random() * SUSPECTS.length);
  return SUSPECTS[index];
}

export function generateClue(culprit: Suspect, existingClues: string[]): string {
  const innocentSuspects = SUSPECTS.filter(s => s.id !== culprit.id);
  
  // 1. Gather all useful clues
  const usefulClues: string[] = [];

  // Alibis (Strong elimination)
  innocentSuspects.forEach(innocent => {
    if (innocent.alibi) usefulClues.push(`🔎 New Intel: ${innocent.alibi}`);
  });

  // Evidence (Specific)
  if (culprit.evidence) usefulClues.push(...culprit.evidence);
  
  // Traits (General)
  culprit.traits.forEach(trait => {
    usefulClues.push(`Profile Update: The culprit is known to be ${trait}.`);
  });

  // Negative Traits (Strong elimination)
  const allPossibleTraits = ['Shiny', 'Dark', 'Soft', 'Sharp'];
  const missingTraits = allPossibleTraits.filter(t => !culprit.traits.includes(t));
  missingTraits.forEach(t => {
      usefulClues.push(`Profile Update: The culprit is definitely NOT ${t}.`);
  });

  // Motive (Unique)
  usefulClues.push(`Motive: The culprit needs the yarn because they ${culprit.motive.replace(/^Needs /, 'need ').replace(/^Wants /, 'want ').replace(/^Thinks /, 'think ').replace(/^Believes /, 'believe ').replace(/^Possesses /, 'possess ')}`); // Simple grammar fix logic or just verify motive strings

  // 2. Filter out already found clues
  const availableUseful = usefulClues.filter(c => !existingClues.includes(c));
  const availableFlavor = FLAVOR_CLUES.filter(c => !existingClues.includes(c));

  // 3. Smart Selection Logic
  // If we have found few clues (< 4), FORCE a useful clue if available.
  // We only show flavor clues if we are doing well or run out of useful ones.
  
  if (availableUseful.length > 0) {
      // 80% chance of useful clue, 20% flavor (if available)
      if (availableFlavor.length > 0 && Math.random() > 0.8) {
          return availableFlavor[Math.floor(Math.random() * availableFlavor.length)];
      }
      return availableUseful[Math.floor(Math.random() * availableUseful.length)];
  }
  
  // Fallback if no useful clues left
  if (availableFlavor.length > 0) {
      return availableFlavor[Math.floor(Math.random() * availableFlavor.length)];
  }

  return "You've found all the clues! Solved it yet? 🕵️‍♀️";
}
