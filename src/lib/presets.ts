import type { Wheel } from "@/types";
import { generateId } from "@/lib/utils";
import { parseWheelInput, parsedToEntries } from "@/lib/parseWheelInput";

export interface Preset {
  id: string;
  name: string;
  wheels: { title: string; rawInput: string }[];
}

function buildWheel(title: string, rawInput: string): Wheel {
  const parsed = parseWheelInput(rawInput);
  return {
    id: generateId(),
    title,
    entries: parsedToEntries(parsed),
    rawInput,
    locked: false,
  };
}

export const PRESETS: Preset[] = [
  {
    id: "fantasy",
    name: "Fantasy Character Builder",
    wheels: [
      {
        title: "Race",
        rawInput: `50,Mortal
40,Hybrid
25,Beastfolk
25,Elf
20,Dwarf
20,Orc
15,Draconian
10,Celestial
10,Ancient One
5,Primordial`,
      },
      {
        title: "Strength",
        rawInput: `30,Peak Human
25,Trained
20,Enhanced
15,Titan
10,Demigod`,
      },
      {
        title: "Stamina",
        rawInput: `25,Average
25,Enduring
20,Ironblood
15,Unyielding
15,Regenerative`,
      },
      {
        title: "Speed",
        rawInput: `30,Normal
25,Swift
20,Blitz
15,Phantom
10,Riftwalker`,
      },
      {
        title: "Battle IQ",
        rawInput: `25,Instinctive
25,Tactical
20,Strategist
15,Genius
15,Oracle`,
      },
    ],
  },
  {
    id: "psychological",
    name: "Psychological Drama",
    wheels: [
      {
        title: "Core Wound",
        rawInput: `20,Abandonment
20,Betrayal
15,Neglect
15,Rejection
15,Loss
15,Injustice`,
      },
      {
        title: "Defense Mechanism",
        rawInput: `25,Denial
20,Projection
20,Intellectualization
15,Humor
10,Withdrawal
10,Aggression`,
      },
      {
        title: "Desire",
        rawInput: `20,Love
20,Power
15,Freedom
15,Recognition
15,Justice
15,Peace`,
      },
      {
        title: "Fear",
        rawInput: `25,Being Alone
20,Failure
20,Intimacy
15,Loss of Control
10,Death
10,Exposure`,
      },
    ],
  },
  {
    id: "dnd",
    name: "D&D Character",
    wheels: [
      {
        title: "Class",
        rawInput: `15, Fighter
15, Wizard
12, Rogue
12, Cleric
10, Ranger
10, Paladin
10, Barbarian
8, Bard
8, Druid`,
      },
      {
        title: "Race",
        rawInput: `20, Human
18, Elf
15, Dwarf
12, Halfling
10, Dragonborn
10, Tiefling
8, Gnome
7, Half-Elf`,
      },
      {
        title: "Background",
        rawInput: `15, Soldier
15, Sage
12, Criminal
12, Noble
10, Folk Hero
10, Acolyte
10, Hermit
8, Entertainer
8, Outlander`,
      },
      {
        title: "Alignment",
        rawInput: `12, Lawful Good
12, Neutral Good
12, Chaotic Good
12, Lawful Neutral
12, True Neutral
12, Chaotic Neutral
10, Lawful Evil
10, Neutral Evil
8, Chaotic Evil`,
      },
    ],
  },
  {
    id: "team",
    name: "Random Team Generator",
    wheels: [
      {
        title: "Role",
        rawInput: `20, Leader
20, Strategist
20, Support
20, Specialist
20, Wildcard`,
      },
      {
        title: "Personality",
        rawInput: `20, Bold
20, Cautious
20, Creative
20, Analytical
20, Empathetic`,
      },
      {
        title: "Skill Focus",
        rawInput: `25, Combat
25, Tech
20, Social
15, Stealth
15, Magic`,
      },
    ],
  },
];

export function createWheelsFromPreset(presetId: string): Wheel[] {
  const preset = PRESETS.find((p) => p.id === presetId);
  if (!preset) return [];

  return preset.wheels.map((w) => buildWheel(w.title, w.rawInput));
}

export function createEmptyWheel(title = "New Wheel"): Wheel {
  return {
    id: generateId(),
    title,
    entries: [],
    rawInput: "",
    locked: false,
  };
}
