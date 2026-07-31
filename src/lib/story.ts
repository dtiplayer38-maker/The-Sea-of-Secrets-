import type { CharacterId, CrewId } from "./game-data";

export interface Panel {
  speaker?: CharacterId;
  narration?: string;
  line?: string;
  caption?: string;
  mood: "calm" | "tense" | "wonder" | "storm" | "triumph";
}

export interface ChoiceOption {
  id: string;
  label: string;
  kind: "attack" | "explore" | "ally";
  outcome: string;
  trust: Partial<Record<CrewId, number>>;
  item?: string;
}

export interface Challenge {
  prompt: string;
  clue: string;
  options: string[];
  answer: number;
  onSolve: string;
  onFail: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  crew: CrewId | "both";
  island: string;
  logline: string;
  intro: string;
  panels: Panel[];
  choice: { prompt: string; options: ChoiceOption[] };
  challenge: Challenge;
  reward: { item: string; coins: number };
}

export const CHAPTERS: Chapter[] = [
  {
    id: "ch1",
    number: 1,
    title: "Saltglass Harbour",
    crew: "both",
    island: "saltglass",
    logline: "Two captains, one missing harbour record, and a clever crew.",
    intro:
      "Rain falls on the port lanterns. Captain Waqas and Captain Aliem meet at the dock for an epic journey!",
    panels: [
      {
        narration:
          "The Neon Voyager glided into Saltglass Harbour. Captain Aliem watched the water with precise and logical eyes.",
        mood: "calm",
      },
      {
        speaker: "aliem",
        line: "Dock number nine is empty, but our sensors show someone erased a ship name from the port book.",
        mood: "tense",
      },
      {
        speaker: "zoelena",
        line: "I can read the hidden ink code! Someone used magic ink to hide a ancient secret.",
        mood: "wonder",
      },
      {
        narration: "Across the harbor, the Seven Seas dropped anchor with a proud splash!",
        mood: "tense",
      },
      {
        speaker: "waqas",
        line: "Never lose hope, crew! Every mystery is just an adventure waiting for a creative dreamer!",
        mood: "wonder",
      },
      {
        speaker: "saham",
        line: "Captain Waqas is right! I already made a 3-step master plan and packed extra snacks for everyone!",
        mood: "calm",
      },
    ],
    choice: {
      prompt:
        "The missing ship name leads past sharp rocks. How do the crews solve this first problem?",
      options: [
        {
          id: "c1a",
          label: "Waqas leads a brave sail through the harbor waves",
          kind: "attack",
          outcome:
            "Waqas inspires both crews with courage! Aliem calculates the safest wave timing to follow smoothly.",
          trust: { waqas: 8, aliem: 4 },
        },
        {
          id: "c1b",
          label: "Aliem and Saham combine tech scanner with the master plan",
          kind: "explore",
          outcome:
            "Aliem's tech scanner and Saham's clever strategy find a smooth path around the rocks!",
          trust: { aliem: 8, waqas: 4 },
        },
        {
          id: "c1c",
          label: "Zoëlena and Yumna work together to read the clues",
          kind: "ally",
          outcome:
            "Best friends Yumna and Zoëlena combine star maps and digital code. They find the secret path easily!",
          trust: { aliem: 7, waqas: 7 },
        },
      ],
    },
    challenge: {
      prompt: "Zoëlena and Saham read the hidden book riddle.",
      clue: '"I am paid for, but never docked. I am named, but never spoken. What am I?"',
      options: ["A lost sailor", "A ship that was erased", "A big wave", "An empty box"],
      answer: 1,
      onSolve:
        "Zoëlena decodes the glowing text: a ship named SEA SECRET, erased from the book long ago!",
      onFail:
        "Saham recalculates the clue and helps everyone find the right answer on the next try.",
    },
    reward: { item: "Ancient Key I", coins: 25 },
  },
  {
    id: "ch2",
    number: 2,
    title: "Drownbell & Emberfall",
    crew: "both",
    island: "drownbell",
    logline: "Underwater bells chime and stars shine. Best friends unite!",
    intro:
      "Aliem's crew dives at the underwater bell reef, while Waqas's crew explores the star mountain.",
    panels: [
      {
        narration: "At Drownbell Reef, underwater bells ring in a rhythmic digital code.",
        mood: "wonder",
      },
      {
        speaker: "zoelena",
        line: "Listen closely! The bell chime is a digital signal. Aliem, can you convert it to map coordinates?",
        mood: "wonder",
      },
      {
        speaker: "aliem",
        line: "Precise logic gives us the exact signal frequency. It points toward Emberfall Isle!",
        mood: "calm",
      },
      {
        narration: "Meanwhile on Emberfall Isle, glowing star dust floats into the night sky.",
        mood: "wonder",
      },
      {
        speaker: "yumna",
        line: "I see possibilities others cannot see! The mountain floor matches the constellation above us.",
        mood: "wonder",
      },
      {
        speaker: "waqas",
        line: "Incredible, Yumna! Your star wisdom turns our dream into reality!",
        mood: "triumph",
      },
      {
        speaker: "saham",
        line: "Zoëlena just sent us a signal code! I am linking her data with Yumna's star map right now!",
        mood: "calm",
      },
    ],
    choice: {
      prompt:
        "The underwater bells and sky stars show two halves of one map. How do you combine them?",
      options: [
        {
          id: "c2a",
          label: "Waqas uses creative courage to leap across the star stones",
          kind: "attack",
          outcome:
            "Waqas leads with energy and courage! The whole crew cheers as the first star beam lights up.",
          trust: { waqas: 9 },
        },
        {
          id: "c2b",
          label: "Aliem uses deep sea scanners to unlock the bell vault",
          kind: "explore",
          outcome:
            "Aliem dives with his neon lantern and retrieves the glowing Cipher Shard safely.",
          trust: { aliem: 9 },
          item: "Cipher Shard",
        },
        {
          id: "c2c",
          label: "Yumna and Zoëlena combine their star and digital keys",
          kind: "ally",
          outcome:
            "Best friends Yumna and Zoëlena link their tools. Star light and blue neon unite in total harmony!",
          trust: { aliem: 8, waqas: 8 },
          item: "Starglass Lens",
        },
      ],
    },
    challenge: {
      prompt: "Match the bell numbers with the star pattern.",
      clue: "The bells ring 3-1-4. Yumna's star map has seven stars. Which star unlocks the secret path?",
      options: ["The first star", "The fourth star", "The seventh star", "The dim star"],
      answer: 1,
      onSolve:
        "Counting from the fourth star, both clues line up perfectly to point toward the secret cave!",
      onFail: "Saham encourages the crew: 'No problem! A good planner always double-checks!'",
    },
    reward: { item: "Cipher Shard", coins: 30 },
  },
  {
    id: "ch3",
    number: 3,
    title: "The Breathing Caves",
    crew: "both",
    island: "hollowmaw",
    logline: "An ancient gear door, a rising tide, and a crew that never gives up.",
    intro:
      "Warm air blows out of the cave twice a day. Inside waits an ancient door machine and a rising tide!",
    panels: [
      {
        narration: "Inside Hollowmaw Caves, ancient mechanical gears block the main chamber.",
        mood: "tense",
      },
      {
        speaker: "saham",
        line: "As the brain of this operation, I see three giant gear locks! We need a precise strategy.",
        mood: "calm",
      },
      {
        speaker: "zoelena",
        line: "I will watch the water level and protect us with my Holo-Shield if the tide rises too fast.",
        mood: "tense",
      },
      {
        speaker: "aliem",
        line: "The machine runs on mechanical logic: Star first, Bell second, Key last.",
        mood: "calm",
      },
      {
        narration: "Suddenly, water surges into the cave! The crew starts to panic.",
        mood: "storm",
      },
      {
        speaker: "waqas",
        line: "Don't lose hope, friends! Look around you—we have the smartest, bravest team on the sea!",
        mood: "wonder",
      },
      {
        speaker: "yumna",
        line: "Captain Waqas is right. Trust our teamwork and press the symbols together!",
        mood: "triumph",
      },
    ],
    choice: {
      prompt: "The tide is rising fast! How does the team solve the cave challenge?",
      options: [
        {
          id: "c3a",
          label: "Waqas and Saham use teamwork to turn the heavy iron wheel",
          kind: "attack",
          outcome:
            "Waqas provides the muscle and Saham guides the leverage! The heavy wheel turns!",
          trust: { waqas: 9 },
        },
        {
          id: "c3b",
          label: "Aliem and Zoëlena hack the gear lock with precise technology",
          kind: "explore",
          outcome:
            "Aliem overrides the mechanism while Zoëlena holds back the water with her shield!",
          trust: { aliem: 9 },
        },
        {
          id: "c3c",
          label: "All five friends work together in perfect harmony",
          kind: "ally",
          outcome:
            "Every single crew member uses their strength. The ancient door slides open smoothly!",
          trust: { aliem: 8, waqas: 8 },
        },
      ],
    },
    challenge: {
      prompt: "Press the three symbols in the correct order before water fills the cave.",
      clue: "Aliem: 'Logical sequence: Star first, Bell second, Key last.'",
      options: [
        "Bell -> Star -> Key",
        "Star -> Bell -> Key",
        "Key -> Star -> Bell",
        "Star -> Key -> Bell",
      ],
      answer: 1,
      onSolve: "The lock turns smoothly! Aliem catches a glowing white key — Ancient Key II!",
      onFail: "Zoëlena shields the team from the splash while Saham resets the gear sequence.",
    },
    reward: { item: "Ancient Key II", coins: 35 },
  },
  {
    id: "ch4",
    number: 4,
    title: "Gallowtide & Mirror Water",
    crew: "both",
    island: "gallowtide",
    logline: "Outsmarting Captain Rhaskal with clever strategy and friendship.",
    intro:
      "Captain Rhaskal holds the third key at his floating pirate fortress. Our friends need a clever plan!",
    panels: [
      {
        narration:
          "Gallowtide Fortress: a massive floating city of rival pirate ships chained together.",
        mood: "storm",
      },
      {
        speaker: "waqas",
        line: "Rhaskal has the final key around his neck. Saham, what is our master plan?",
        mood: "tense",
      },
      {
        speaker: "saham",
        line: "A 4-minute distraction! I will launch a harmless spark rocket while Zoëlena creates a digital illusion!",
        mood: "calm",
      },
      {
        speaker: "zoelena",
        line: "Understood! I will protect Saham while he executes the plan.",
        mood: "tense",
      },
      {
        narration: "Meanwhile at Mirrorwake Atoll, the sea becomes clear as polished glass.",
        mood: "wonder",
      },
      {
        speaker: "yumna",
        line: "Look down! The mirror water reflects stars from long ago. It shows where the secret fleet was anchored.",
        mood: "wonder",
      },
      {
        speaker: "aliem",
        line: "Logic and star science agree. The final treasure is waiting at the Last Lantern lighthouse!",
        mood: "calm",
      },
    ],
    choice: {
      prompt: "Rhaskal notices the ships approaching. How do you secure the final key?",
      options: [
        {
          id: "c4a",
          label: "Saham and Waqas execute the clever distraction plan",
          kind: "attack",
          outcome:
            "Saham's spark rocket pops with colorful stars! Waqas snatches the third key with a smile!",
          trust: { waqas: 10 },
          item: "Ancient Key III",
        },
        {
          id: "c4b",
          label: "Aliem and Zoëlena dive deep into Mirrorwake for the ancient badge",
          kind: "explore",
          outcome:
            "Aliem dives into the mirror water and retrieves the Sunken Fleet Badge while Rhaskal is distracted.",
          trust: { aliem: 10 },
          item: "Sunken Fleet Badge",
        },
        {
          id: "c4c",
          label: "Waqas speaks with kindness and offers friendship to Rhaskal",
          kind: "ally",
          outcome:
            "Waqas reminds Rhaskal that everyone has potential. Rhaskal smiles and hands over the key willingly!",
          trust: { aliem: 8, waqas: 8 },
          item: "Ancient Key III",
        },
      ],
    },
    challenge: {
      prompt: "Rhaskal asks a clever riddle before letting the ships pass.",
      clue: '"I show you the sky, but I hold no stars. I keep a memory from long ago. What am I?"',
      options: ["A star map", "A mirror reflection", "A light lantern", "A dream"],
      answer: 1,
      onSolve:
        "Rhaskal laughs with joy! 'You are true smart heroes!' He opens the floating city gates!",
      onFail: "Yumna gently gives a hint, and Rhaskal nods in agreement.",
    },
    reward: { item: "Ancient Key III", coins: 40 },
  },
  {
    id: "ch5",
    number: 5,
    title: "The Last Lantern",
    crew: "both",
    island: "lastlantern",
    logline: "Every character has a reason to be here. A grand final revelation!",
    intro:
      "All three Ancient Keys shine brightly. Both crews stand together at the door of the ancient lighthouse!",
    panels: [
      {
        narration:
          "The Last Lantern shines with radiant golden light across the ocean. The big moment has arrived!",
        mood: "wonder",
      },
      {
        speaker: "aliem",
        line: "Three keys inserted into the digital lock. Technology and logic brought us to this exact moment.",
        mood: "calm",
      },
      {
        speaker: "waqas",
        line: "And imagination, courage, and friendship brought us together! Turn the keys, Captain!",
        mood: "wonder",
      },
      {
        narration: "The ancient door opens! Glowing golden words illuminate the stone walls.",
        mood: "triumph",
      },
      {
        speaker: "yumna",
        line: "The stars guided us here! These words are a map of hope written by ancient explorers.",
        mood: "wonder",
      },
      {
        speaker: "zoelena",
        line: "I am translating the ancient code: 'To those who work together with mind, heart, and trust—the whole ocean is yours!'",
        mood: "wonder",
      },
      {
        speaker: "saham",
        line: "We did it! Every single one of us was needed to complete this mission!",
        mood: "triumph",
      },
      {
        narration:
          "Captain Waqas, Captain Aliem, Saham, Yumna, and Zoëlena raise their glasses in celebration!",
        caption: "EVERY CHARACTER HAD A REASON TO BE HERE. UNITED AS ONE CREW!",
        mood: "triumph",
      },
    ],
    choice: {
      prompt: "The lighthouse glow reveals a new world map. What is your crew's next decision?",
      options: [
        {
          id: "c5a",
          label: "Protect the ancient map and keep it safe for future dreamers",
          kind: "attack",
          outcome:
            "Waqas and Saham pledge to guard the lighthouse so the secret stays pure forever!",
          trust: { waqas: 8, aliem: 8 },
        },
        {
          id: "c5b",
          label: "Aliem builds a digital copy of the map for all young explorers",
          kind: "explore",
          outcome: "Aliem and Zoëlena code the map into a glowing beacon for all safe sailors!",
          trust: { aliem: 10, waqas: 6 },
        },
        {
          id: "c5c",
          label: "Sail together into the new ocean as one giant super-crew!",
          kind: "ally",
          outcome:
            "The Neon Voyager and Seven Seas sail side by side toward infinite new horizons!",
          trust: { aliem: 10, waqas: 10 },
        },
      ],
    },
    challenge: {
      prompt: "Answer the final message of the Last Lantern.",
      clue: '"What made this journey a true victory?"',
      options: [
        "Gold coins",
        "Friendship, teamwork, and every character's unique strength",
        "A big storm",
        "Nothing",
      ],
      answer: 1,
      onSolve: "The golden lighthouse bursts into a celebration of fireworks and rainbow lights!",
      onFail:
        "Waqas smiles and reminds everyone: 'Friendship and teamwork are always the true answer!'",
    },
    reward: { item: "The Lost Sea Secret", coins: 100 },
  },
];

export const getChapter = (n: number) => CHAPTERS.find((c) => c.number === n);
