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
    id: "dnd",
    name: "D&D Character Builder",
    wheels: [
      {
        title: "Race",
        rawInput: `50,Human
  40,Dwarf
  40,Elf
  35,Halfling
  30,Gnome
  25,Half-Elf
  20,Half-Orc
  15,Tiefling
  10,Dragonborn`,
      },
      {
        title: "Class",
        rawInput: `40,Fighter
  35,Rogue
  35,Wizard
  30,Cleric
  30,Ranger
  25,Barbarian
  25,Bard
  20,Druid
  20,Monk
  20,Paladin
  15,Sorcerer
  15,Warlock`,
      },
      {
        title: "Background",
        rawInput: `50,Folk Hero
  45,Soldier
  40,Criminal
  40,Sage
  35,Acolyte
  35,Charlatan
  30,Entertainer
  30,Guild Artisan
  25,Hermit
  25,Noble
  20,Outlander
  20,Urchin`,
      },
      {
        title: "Alignment",
        rawInput: `40,Neutral Good
  35,Chaotic Good
  35,Lawful Good
  30,True Neutral
  25,Chaotic Neutral
  25,Lawful Neutral
  20,Neutral Evil
  15,Chaotic Evil
  15,Lawful Evil`,
      },
      {
        title: "Strength",
        rawInput: `50,8
  40,10
  30,12
  25,14
  20,16
  15,18
  10,20`,
      },
      {
        title: "Dexterity",
        rawInput: `50,8
  40,10
  30,12
  25,14
  20,16
  15,18
  10,20`,
      },
      {
        title: "Constitution",
        rawInput: `50,8
  40,10
  30,12
  25,14
  20,16
  15,18
  10,20`,
      },
      {
        title: "Intelligence",
        rawInput: `50,8
  40,10
  30,12
  25,14
  20,16
  15,18
  10,20`,
      },
      {
        title: "Wisdom",
        rawInput: `50,8
  40,10
  30,12
  25,14
  20,16
  15,18
  10,20`,
      },
      {
        title: "Charisma",
        rawInput: `50,8
  40,10
  30,12
  25,14
  20,16
  15,18
  10,20`,
      },
    ],
  },
  {
    id: "Ultimate",
    name: "Ultimate Character Builder",
    wheels: [
      {
        title: "Class",
        rawInput: `15,Fighter
15,Wizard
12,Rogue
12,Cleric
10,Ranger
8,Paladin
8,Barbarian`,
      },
      {
        title: "Race",
        rawInput: `20,Human
18,Elf
15,Dwarf
12,Halfling
10,Tiefling
8,Gnome
7,Half-Elf
5,Dragonborn`,
      },
      {
        title: "Alignment",
        rawInput: `Lawful Good
Neutral Good
Chaotic Good
Lawful Neutral
True Neutral
Chaotic Neutral
Lawful Evil
Neutral Evil
Chaotic Evil`,
      },
      {
        title: "Strength",
        rawInput: `35,Peak Human
25,Trained
18,Enhanced
8,Titan
2,Demigod`,
      },
      {
        title: "Stamina",
        rawInput: `35,Average
25,Enduring
20,Ironblood
8,Unyielding
2,Regenerative`,
      },
      {
        title: "Speed",
        rawInput: `35,Normal
25,Swift
18,Blitz
8,Phantom
2,Riftwalker`,
      },
      {
        title: "Battle IQ",
        rawInput: `35,Instinctive
25,Tactical
18,Strategist
8,Genius
2,Oracle`,
      },
      {
        title: "Weapon",
        rawInput: `50,Dagger
40,Short Sword
25,Spear
25,Bow
20,Twin Blades
20,War Axe
15,Greatsword
10,Scythe
10,Arcane Staff
5,Relic Weapon`,
      },
      {
        title: "Weapon Mastery",
        rawInput: `50,Novice
40,Apprentice
30,Skilled
20,Veteran
12,Expert
8,Elite
5,Master
3,Grandmaster
1,Transcendent
0.25,Mythic`,
      },
      {
        title: "Unique Skill",
        rawInput: `50,Berserker Rage
40,Shadow Step
30,Blood Pact
25,Future Sight
20,Soul Drain
15,Beast Awakening
8,Void Manipulation
3,Time Fracture
1,Reality Rewrite
0.1,Absolute Dominion`,
      },
      {
        title: "Weakness",
        rawInput: `50,Overconfidence
40,Fragile Mind
30,Slow Recovery
25,Mana Instability
20,Rage Control
15,Greed
8,Fear of Isolation
3,Power Corruption
1,Cursed Fate
0.1,Existence Decay`,
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
