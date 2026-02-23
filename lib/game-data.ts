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
    description: 'A solitary artist often found sketching in the shadows of the old clock tower. Her eyes are dark and observant, always carrying a silver brush as a hair stick.',
    motive: "Needs the yarn's specific texture for a mixed-media masterpiece.",
    color: 'bg-pink-400',
    avatar: '/suspects/sena.png',
    evidence: [
      "Graphite dust was found in the shadows... Something Dark? 🌑", 
      "A silver brush bristle glinting in the moonlight... Something Shiny? ✨"
    ],
    alibi: "Sena was seen sketching by the fountain, her hands stained with midnight blue paint. 🎨",
  },
  {
    id: 'anlin',
    name: 'Anlin',
    power: 'Tiny Stealth',
    isFictional: false,
    traits: ['Dark', 'Soft', 'Sharp'],
    description: 'Small and swift, she moves silently through the forgotten corridors. Wears a deep emerald cloak and collects soft velvet scraps for her hidden nest.',
    motive: "Building the ultimate winter nest and needs soft insulation.",
    color: 'bg-yellow-400',
    avatar: '/suspects/anlin.png',
    evidence: [
      "A tiny, sharp claw mark was found... Something Sharp? 🗡️", 
      "A dark shadow was seen darting away into the night... Something Dark? 🌑"
    ],
    alibi: "Anlin was discovered trapped in an empty jam jar in the pantry, unable to escape. 🍓",
  },
  {
    id: 'celine',
    name: 'Celine',
    power: 'Cute Charm',
    isFictional: false,
    traits: ['Shiny', 'Soft', 'Sharp'],
    description: 'Always dressed in shimmering midnight blue sequins that catch the faint light. Her laughter echoes a bit too loudly in the empty halls.',
    motive: "The lavender color perfectly matches her new sequin outfit.",
    color: 'bg-purple-400',
    avatar: '/suspects/celine.png',
    evidence: [
      "A loose sequin was found, reflecting the candlelight... Something Shiny? ✨", 
      "A sharp scratch from a high heel on the floorboards... Something Sharp? 👠"
    ],
    alibi: "Celine was livestreaming a makeup tutorial to an audience of 500, visible online. 📹",
  },
  {
    id: 'alex',
    name: 'Alex',
    power: 'Craft Tools',
    isFictional: false,
    traits: ['Shiny', 'Dark', 'Sharp'],
    description: 'A brooding inventor with grease-stained hands and sharp, calculating eyes behind thick, dark-rimmed glasses. Often heard working late into the night.',
    motive: "Needs to test the yarn's tensile strength for a pulley system.",
    color: 'bg-blue-400',
    avatar: '/suspects/alex.png',
    evidence: [
      "Metal shavings were found glinting in the dark... Something Shiny? 🔩", 
      "A grease stain was left on the faded carpet... Something Dark? 🛢️"
    ],
    alibi: "Alex was welding a metal sculpture in the garage, creating sparks and loud noise. 💥",
  },
  {
    id: 'melody',
    name: 'Melody',
    power: 'Fiber Master',
    isFictional: false,
    traits: ['Shiny', 'Soft', 'Dark'],
    description: 'Weaves intricate, dark tapestries by candlelight. Her long dark hair is always perfectly braided, and she guards her yarn with a fierce, quiet intensity.',
    motive: "Believes the yarn is being wasted on non-knitters and must be rescued.",
    color: 'bg-green-400',
    avatar: '/suspects/melody.png',
    evidence: [
      "Soft fuzz was left behind on a velvet chair... Something Soft? 🧶", 
      "A scratch from a silver knitting needle... Something Shiny? 🥢"
    ],
    alibi: "Melody was frantically detangling a massive 'yarn barf' incident by the fire. 😫",
  },
  {
    id: 'maleficent',
    name: 'Maleficent',
    power: 'Dark Fairy Magic',
    isFictional: true,
    traits: ['Dark', 'Shiny', 'Sharp'],
    description: 'Possesses an aura of ancient magic. Her sharp, angular features are framed by a high collar of black feathers. A silver thorn brooch gleams ominously on her chest.',
    motive: "Needs a binding agent for a sleeping spell that is also comfortable.",
    color: 'bg-gray-800 text-white',
    avatar: '/suspects/maleficent.png',
    evidence: [
      "A dark crow feather was found drifting in the air... Something Dark? 🪶", 
      "A sharp thorn was left behind, piercing the floor... Something Sharp? 🌹"
    ],
    alibi: "Maleficent was stuck waiting in line at the DMV, a fate worse than any curse. 🚗",
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
