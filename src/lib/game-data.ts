import aliemAsset from "@/assets/aliem.jpg.asset.json";
import waqasAsset from "@/assets/waqas.png.asset.json";
import zoelenaAsset from "@/assets/zoelena.jpg.asset.json";
import yumnaAsset from "@/assets/yumna.jpg.asset.json";
import sahamAsset from "@/assets/saham.jpg.asset.json";

export type CrewId = "aliem" | "waqas";
export type CharacterId = "aliem" | "waqas" | "zoelena" | "yumna" | "saham";

export interface Character {
  id: CharacterId;
  name: string;
  title: string;
  crew: CrewId;
  leader?: boolean;
  image: string;
  tagline: string;
  bio: string;
  personality: string;
  speaks: string;
  skills: { label: string; value: number }[];
  equipment: string[];
  ship: string;
}

export const CREWS: Record<
  CrewId,
  { id: CrewId; name: string; badge: string; motto: string; color: string }
> = {
  aliem: {
    id: "aliem",
    name: "The Neon Voyager Crew",
    badge: "🏴‍☠️",
    motto: "Light up the dark sea. Bring everyone home safe.",
    color: "var(--neon)",
  },
  waqas: {
    id: "waqas",
    name: "The Seven Seas Crew",
    badge: "⚔️",
    motto: "Sail through the storm. Find new land.",
    color: "var(--gold)",
  },
};

export const CHARACTERS: Character[] = [
  {
    id: "aliem",
    name: "Pirate Aliem",
    title: "Captain of the Neon Voyager",
    crew: "aliem",
    leader: true,
   image: "https://i.ibb.co/XfrTZFkV/CAPTAIN-ALIEM-NO-BG.png",
    tagline: "Strategist, coder, and builder.",
    bio: "Aliem is the captain of the Neon Voyager. He is precise, logical, and innovative. He believes knowledge and ideas can change the future. When a situation seems impossible, Aliem uses technology, smart planning, and calm decisions to create solutions.",
    personality:
      "Precise, logical, innovative, and strategic. Believes every problem has a solution.",
    speaks: "Clear, calm, and thoughtful.",
    skills: [
      { label: "Tech & Coding", value: 98 },
      { label: "Smart Planning", value: 95 },
      { label: "Leadership", value: 92 },
      { label: "Sailing", value: 85 },
    ],
    equipment: ["Electric Gloves", "Holo-Compass", "Neon Lantern", "Coder Notebook"],
    ship: "The Neon Voyager",
  },
  {
    id: "zoelena",
    name: "Zoëlena",
    title: "Digital Sentinel & Yumna's Best Friend",
    crew: "aliem",
    image: "https://i.ibb.co/q3gkkbcF/1000035583-removebg-preview.png",
    tagline: "Elegant, fearless, and protective.",
    bio: "Zoëlena is the Digital Sentinel of the Neon Voyager and Yumna's best friend. She is smart, mysterious, and fearless. She understands hidden code and ocean secrets. She protects her team, finds secret clues, and works closely with Saham through strategy and trust.",
    personality: "Elegant, fearless, smart, and deeply protective of her friends.",
    speaks: "Clever, quick, and confident.",
    skills: [
      { label: "Secret Code", value: 98 },
      { label: "Finding Clues", value: 94 },
      { label: "Protection", value: 90 },
      { label: "Team Strategy", value: 88 },
    ],
    equipment: ["Holo-Shield", "Pearl Code Key", "Signal Lantern"],
    ship: "The Neon Voyager",
  },
  {
    id: "waqas",
    name: "Pirate Waqas",
    title: "Captain of the Seven Seas",
    crew: "waqas",
    leader: true,
    image: "https://i.ibb.co/BH7hgQHt/PIRATE-WAQAS-NEW.png",
    tagline: "Creative, curious, and full of imagination.",
    bio: "Waqas is the captain of the Seven Seas. He is a dreamer who turns big ideas into amazing adventures! He is kind-hearted, loyal, and believes everyone has potential. Waqas solves problems with creativity, courage, and teamwork, and lifts his crew when they lose hope.",
    personality: "Creative, curious, kind-hearted, loyal, and inspiring.",
    speaks: "Warm, bold, and full of hope.",
    skills: [
      { label: "Creativity", value: 98 },
      { label: "Inspiring Hope", value: 96 },
      { label: "Courage", value: 94 },
      { label: "Sailing", value: 88 },
    ],
    equipment: ["Captain's Sword", "Golden Spyglass", "Compass of Dreams"],
    ship: "The Seven Seas",
  },
  {
    id: "yumna",
    name: "Star Reader Yumna",
    title: "Navigator, Guide & Zoëlena's Best Friend",
    crew: "waqas",
    image: "https://i.ibb.co/2YkyLtxz/star-reader-yumna-removebg-preview.png",
    tagline: "Reads stars, maps, and hidden paths.",
    bio: "Yumna is the navigator and guide of the Seven Seas, and Zoëlena's best friend. Wise, focused, and imaginative, Yumna sees possibilities that others cannot see. She reads stars and ancient maps to guide the ship and unlock lost ocean secrets.",
    personality: "Wise, focused, imaginative, and observant.",
    speaks: "Calm, poetic, and reassuring.",
    skills: [
      { label: "Star Reading", value: 99 },
      { label: "Finding Paths", value: 95 },
      { label: "Ocean Wisdom", value: 92 },
      { label: "Map Making", value: 88 },
    ],
    equipment: ["Brass Star Tool", "Starglass Lens", "Ancient Map Scroll"],
    ship: "The Seven Seas",
  },
  {
    id: "saham",
    name: "First Mate Saham",
    title: "First Mate & Brain Behind the Crew",
    crew: "waqas",
    image: "https://i.ibb.co/GfS1wkx9/saham-removebg-preview-removebg-preview.png",
    tagline: "Clever planner and closest friend.",
    bio: "Saham is Captain Waqas' first mate and closest friend. He is the brain behind the crew! Clever, loyal, funny, and a great planner, Saham helps organize missions, solve hard puzzles, and keep the crew together with strategy and cheer during difficult moments.",
    personality: "Clever, loyal, funny, strategic, and warm.",
    speaks: "Cheerful, lively, and encouraging!",
    skills: [
      { label: "Mission Planning", value: 97 },
      { label: "Clever Strategy", value: 94 },
      { label: "Crew Morale", value: 96 },
      { label: "Building Tools", value: 88 },
    ],
    equipment: ["Command Chair", "Tool Kit", "Map Scrolls", "Snack Box"],
    ship: "The Seven Seas",
  },
];

export const getCharacter = (id: CharacterId) => CHARACTERS.find((c) => c.id === id)!;

export interface Ship {
  id: string;
  name: string;
  crew: CrewId;
  captain: string;
  description: string;
  upgrades: { name: string; effect: string; cost: number }[];
}

export const SHIPS: Ship[] = [
  {
    id: "neon-voyager",
    name: "The Neon Voyager",
    crew: "aliem",
    captain: "Pirate Aliem",
    description:
      "A cool black ship with bright blue glowing sails. It sails quietly in the night and can find secret paths in the water.",
    upgrades: [
      { name: "Glowing Sails", effect: "+2 speed in thick fog", cost: 40 },
      { name: "Strong Hull", effect: "Protects the ship from sharp rocks", cost: 65 },
      { name: "Deep Water Scanner", effect: "Finds one hidden island", cost: 90 },
    ],
  },
  {
    id: "seven-seas",
    name: "The Seven Seas",
    crew: "waqas",
    captain: "Pirate Waqas",
    description:
      "A big strong wooden ship with red sails and cannon power. It moves fast and has Saham's Command Chair on deck.",
    upgrades: [
      { name: "Front Bumper", effect: "Better at fighting rival ships", cost: 45 },
      { name: "Chain Shooters", effect: "Stops rival ships from sailing away", cost: 60 },
      { name: "Star Lookout", effect: "Helps Yumna see stars clearly at night", cost: 85 },
    ],
  },
];

export interface Island {
  id: string;
  name: string;
  x: number;
  y: number;
  crew: CrewId | "shared";
  biome: string;
  chapterUnlock: number;
  secret: string;
  mission: { title: string; type: string; brief: string; reward: string };
}

export const ISLANDS: Island[] = [
  {
    id: "saltglass",
    name: "Saltglass Harbour",
    x: 14,
    y: 68,
    crew: "shared",
    biome: "A busy port lit by colorful lanterns.",
    chapterUnlock: 1,
    secret: "The port book has a hidden name.",
    mission: {
      title: "The Missing Ship",
      type: "Mystery",
      brief: "Look at the port book and find the erased ship name.",
      reward: "Ancient Key I",
    },
  },
  {
    id: "drownbell",
    name: "Drownbell Reef",
    x: 33,
    y: 42,
    crew: "aliem",
    biome: "A reef with underwater bells that ring in the ocean.",
    chapterUnlock: 2,
    secret: "The bells ring in a special number pattern.",
    mission: {
      title: "Count the Bells",
      type: "Puzzle",
      brief: "Zoëlena turns the bell music into a secret map.",
      reward: "Cipher Shard",
    },
  },
  {
    id: "emberfall",
    name: "Emberfall Isle",
    x: 56,
    y: 24,
    crew: "waqas",
    biome: "A warm island where soft sparks float up into the sky.",
    chapterUnlock: 2,
    secret: "Yumna finds a star shape drawn on the ground.",
    mission: {
      title: "The Star Ground",
      type: "Exploration",
      brief: "Draw the star shape on the mountain floor.",
      reward: "Starglass Lens",
    },
  },
  {
    id: "hollowmaw",
    name: "Hollowmaw Caves",
    x: 42,
    y: 74,
    crew: "shared",
    biome: "Warm water caves that blow air like breathing.",
    chapterUnlock: 3,
    secret: "The blowing air comes from a hidden door machine.",
    mission: {
      title: "The Rock Door",
      type: "Puzzle",
      brief: "Press three symbols to open the door before the water returns.",
      reward: "Ancient Key II",
    },
  },
  {
    id: "mirrorwake",
    name: "Mirrorwake Atoll",
    x: 71,
    y: 55,
    crew: "aliem",
    biome: "Water so clean and calm it looks like a big mirror.",
    chapterUnlock: 4,
    secret: "The mirror water shows stars from long ago.",
    mission: {
      title: "Look in the Mirror",
      type: "Treasure Hunt",
      brief: "Look under the water and find the lost treasure.",
      reward: "Sunken Fleet Badge",
    },
  },
  {
    id: "gallowtide",
    name: "Gallowtide Anchorage",
    x: 84,
    y: 30,
    crew: "waqas",
    biome: "A floating pirate fort made of many linked ships.",
    chapterUnlock: 4,
    secret: "Captain Rhaskal wears the third key as an earring.",
    mission: {
      title: "Get the Key",
      type: "Pirate Fun",
      brief: "Sneak past the bad pirates to get the third key.",
      reward: "Ancient Key III",
    },
  },
  {
    id: "lastlantern",
    name: "The Last Lantern",
    x: 60,
    y: 86,
    crew: "shared",
    biome: "A tall lighthouse at the edge of the ocean with magic light.",
    chapterUnlock: 5,
    secret: "The secret is not gold, but a message for future heroes.",
    mission: {
      title: "The Great Final",
      type: "Final Stage",
      brief: "Both crews meet and open the final door together.",
      reward: "The Lost Sea Secret",
    },
  },
];

export interface Enemy {
  id: string;
  name: string;
  role: string;
  threat: number;
  description: string;
}

export const ENEMIES: Enemy[] = [
  {
    id: "rhaskal",
    name: "Captain Rhaskal",
    role: "Bad Pirate Boss",
    threat: 88,
    description: "A greedy pirate leader who wants all secrets for himself.",
  },
  {
    id: "grey-choir",
    name: "The Grey Choir",
    role: "Ghost Voices",
    threat: 74,
    description: "Strange fog voices that echo your words back to you.",
  },
  {
    id: "vessa",
    name: "Vessa Kane",
    role: "Reef Pirate",
    threat: 69,
    description: "Tricks lost ships onto rocks with ringing bells.",
  },
];

export interface Item {
  id: string;
  name: string;
  kind: "Key" | "Coin" | "Relic" | "Equipment";
  lore: string;
}

export const ITEMS: Item[] = [
  {
    id: "key-1",
    name: "Ancient Key I",
    kind: "Key",
    lore: "A shiny brass key. It gets warm near the Last Lantern.",
  },
  {
    id: "key-2",
    name: "Ancient Key II",
    kind: "Key",
    lore: "A key made of white salt rock. It never breaks.",
  },
  {
    id: "key-3",
    name: "Ancient Key III",
    kind: "Key",
    lore: "A golden key worn by a pirate captain.",
  },
  {
    id: "cipher-shard",
    name: "Cipher Shard",
    kind: "Relic",
    lore: "A glowing glass piece that makes a gentle bell chime.",
  },
  {
    id: "starglass",
    name: "Starglass Lens",
    kind: "Equipment",
    lore: "A special spyglass that shows stars from long ago.",
  },
  {
    id: "fleet-sigil",
    name: "Sunken Fleet Badge",
    kind: "Relic",
    lore: "A metal badge from the very first pirate fleet.",
  },
  {
    id: "coins",
    name: "Pirate Coins",
    kind: "Coin",
    lore: "Gold coins used to buy cool ship upgrades.",
  },
  {
    id: "sea-secret",
    name: "The Lost Sea Secret",
    kind: "Relic",
    lore: "The special story map found at the end of the journey.",
  },
];

export interface Achievement {
  id: string;
  name: string;
  detail: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-sail", name: "First Sail", detail: "Start your adventure." },
  { id: "cartographer", name: "Map Explorer", detail: "Unlock four islands on the world map." },
  { id: "keymaster", name: "Key Master", detail: "Collect all three Ancient Keys." },
  {
    id: "diplomat",
    name: "Peace Maker",
    detail: "Choose peace instead of fighting twice.",
  },
  {
    id: "storm-runner",
    name: "Brave Sailor",
    detail: "Choose the bold path twice.",
  },
  { id: "bonded", name: "Best Friends", detail: "Get maximum trust with both captains." },
  { id: "finale", name: "The Big Winner", detail: "Finish the whole story." },
];
