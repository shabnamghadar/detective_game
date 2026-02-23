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
  // We want a mix of Evidence (pointing TO culprit) and Alibis (ruling OUT others).
  
  const innocentSuspects = SUSPECTS.filter(s => s.id !== culprit.id);
  
  // 1. Gather all possible clues
  const possibleClues: string[] = [];

  // B) Alibis for innocent suspects (Rule them out!)
  innocentSuspects.forEach(innocent => {
    if (innocent.alibi) {
      // subtle: just state the fact, let the player deduce it clears them
      possibleClues.push(`🔎 New Intel: ${innocent.alibi}`);
    }
  });

  // A) Evidence pointing TO the culprit (Specific Clues)
  if (culprit.evidence) {
    possibleClues.push(...culprit.evidence);
  }
  
  // B) Trait Clues (General Profile)
  // "The thief has the trait: X"
  culprit.traits.forEach(trait => {
    possibleClues.push(`Profile Update: The culprit is known to be ${trait}.`);
  });

  // C) Negative Trait Clues (Ruling out traits)
  // Find traits that the culprit does NOT have
  const allPossibleTraits = ['Shiny', 'Dark', 'Soft', 'Sharp'];
  const missingTraits = allPossibleTraits.filter(t => !culprit.traits.includes(t));
  
  if (missingTraits.length > 0) {
      const randomMissing = missingTraits[Math.floor(Math.random() * missingTraits.length)];
      possibleClues.push(`Profile Update: The culprit is definitely NOT ${randomMissing}.`);
  }

  // D) FLAVOR CLUES (Useless/Distraction clues)
  possibleClues.push(...FLAVOR_CLUES);

  // Filter out clues we already have
  const newClues = possibleClues.filter(c => !existingClues.includes(c));
  
  if (newClues.length === 0) return "You've found all the main clues! Review your notebook to solve the case! 📓";
  
  // Pick a random one
  return newClues[Math.floor(Math.random() * newClues.length)];
}
