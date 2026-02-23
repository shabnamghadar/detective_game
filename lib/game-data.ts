export type Suspect = {
  id: string;
  name: string;
  power: string;
  isFictional: boolean;
  traits: string[];
  description: string;
  motive: string;
  color: string;
  avatar: string; // Emoji or image URL
  evidence: string[]; // Clues that point TO this suspect
  alibi: string;      // Clue that clears this suspect
};

export const SUSPECTS: Suspect[] = [
  {
    id: 'sena',
    name: 'Sena',
    power: 'Super Drawing',
    isFictional: false,
    traits: ['Shiny', 'Dark', 'Soft'],
    description: 'A quiet artist who is often covered in graphite and paint.',
    motive: "Needs the yarn's specific texture for a mixed-media masterpiece.",
    color: 'bg-pink-400',
    avatar: '🎨',
    evidence: [
      "Graphite dust was found... Something Dark? 🌑", 
      "A silver brush bristle was left behind... Something Shiny? ✨"
    ],
    alibi: "Sena was seen sketching by the fountain with wet paint on her hands. 🎨",
  },
  {
    id: 'anlin',
    name: 'Anlin',
    power: 'Tiny Stealth',
    isFictional: false,
    traits: ['Dark', 'Soft', 'Sharp'],
    description: 'A tiny, stealthy observer who collects soft things.',
    motive: "Building the ultimate winter nest and needs soft insulation.",
    color: 'bg-yellow-400',
    avatar: '🐭',
    evidence: [
      "A tiny claw mark was found on the table... Something Sharp? 🗡️", 
      "A dark shadow was seen darting away... Something Dark? 🌑"
    ],
    alibi: "Anlin was stuck in an empty jam jar in the pantry! 🍓",
  },
  {
    id: 'celine',
    name: 'Celine',
    power: 'Cute Charm',
    isFictional: false,
    traits: ['Shiny', 'Soft', 'Sharp'],
    description: 'Loves everything sparkly, cute, and slightly dangerous.',
    motive: "The lavender color perfectly matches her new sequin outfit.",
    color: 'bg-purple-400',
    avatar: '✨',
    evidence: [
      "A loose sequin was found... Something Shiny? ✨", 
      "A scratch from a high heel? ...Something Sharp? 👠"
    ],
    alibi: "Celine was livestreaming a makeup tutorial to 500 followers. 📹",
  },
  {
    id: 'alex',
    name: 'Alex',
    power: 'Craft Tools',
    isFictional: false,
    traits: ['Shiny', 'Dark', 'Sharp'],
    description: 'Always building, fixing, or taking things apart.',
    motive: "Needs to test the yarn's tensile strength for a pulley system.",
    color: 'bg-blue-400',
    avatar: '🛠️',
    evidence: [
      "Metal shavings were found... Something Shiny? 🔩", 
      "A grease stain was left on the carpet... Something Dark? 🛢️"
    ],
    alibi: "Alex was welding a metal sculpture in the garage (loudly). 💥",
  },
  {
    id: 'melody',
    name: 'Melody',
    power: 'Fiber Master',
    isFictional: false,
    traits: ['Shiny', 'Soft', 'Dark'],
    description: 'Takes knitting very seriously. Maybe too seriously.',
    motive: "Believes the yarn is being wasted on non-knitters and must be rescued.",
    color: 'bg-green-400',
    avatar: '🧶',
    evidence: [
      "Soft fuzz was left behind... Something Soft? 🧶", 
      "A scratch from a knitting needle... Something Shiny? 🥢"
    ],
    alibi: "Melody was frantically detangling a massive 'yarn barf' incident. 😫",
  },
  {
    id: 'maleficent',
    name: 'Maleficent',
    power: 'Dark Fairy Magic',
    isFictional: true,
    traits: ['Dark', 'Shiny', 'Sharp'],
    description: 'The Mistress of All Evil. Has a flair for the dramatic.',
    motive: "Needs a binding agent for a sleeping spell that is also comfortable.",
    color: 'bg-gray-800 text-white',
    avatar: '🐉',
    evidence: [
      "A dark crow feather was found... Something Dark? 🪶", 
      "A sharp thorn was left behind... Something Sharp? 🌹"
    ],
    alibi: "Maleficent was stuck waiting in line at the DMV. The true horror. 🚗",
  },
];

export const FLAVOR_CLUES = [
  "You found a footprint! ...Wait, that's just your own footprint. 👣",
  "The scanner picked up a signal... but it was just the microwave. 📡",
  "You found a piece of yarn! Oh, never mind, it's just a loose thread from the carpet. 🧵",
  "A witness saw something! ...It was just the neighbor's cat. 🐈",
  "You found a crumb. It looks like... a regular cracker crumb. Not helpful. 🍪",
  "The trail seems to have gone cold here. Try scanning another code! ❄️",
  "You found a shiny object! ...It's just a gum wrapper. 🍬",
  "This QR code was a decoy! The thief is tricky. 🎭",
  "You scanned a clue... but the ink is smudged and unreadable. 💧",
  "Nothing to see here. Just a dust bunny. 🐰"
];

export const GAME_TITLE = "The Case of the Stolen Lavender Chunky Yarn";
export const GAME_INTRO = "Detective! We have a crisis! The ultra-rare, super-soft Lavender Chunky Yarn has been stolen from the craft room! It was last seen sitting on the table, ready for a scarf. Now, it's gone! We have six suspects. Sena, Anlin, Celine, Alex, Melody, and even Maleficent were seen nearby. Scan the clues found at the scene to eliminate the innocent and catch the yarn thief! Good luck, Detective!";
