"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Wheel,
  WheelEntry,
  RollHistory,
  AdvancedSettings,
  ExportData,
} from "@/types";
import { generateId } from "@/lib/utils";
import {
  parseWheelInput,
  parsedToEntries,
  entriesToRawInput,
  sortEntriesByWeightDesc,
} from "@/lib/parseWheelInput";
import {
  MAX_WHEELS,
  MAX_HISTORY,
  STORAGE_KEY,
  DEFAULT_SPIN_DURATION,
  DEFAULT_WHEEL_SIZE,
} from "@/lib/constants";
import { createEmptyWheel, createWheelsFromPreset } from "@/lib/presets";

interface WheelStore {
  wheels: Wheel[];
  history: RollHistory[];
  advancedMode: boolean;
  settings: AdvancedSettings;
  selectedWheelId: string | null;
  spinningWheelIds: string[];
  lastSavedAt: number | null;
  saveMessage: string | null;

  setSelectedWheelId: (id: string | null) => void;
  addWheel: () => boolean;
  removeWheel: (id: string) => void;
  duplicateWheel: (id: string) => boolean;
  renameWheel: (id: string, title: string) => void;
  reorderWheels: (fromIndex: number, toIndex: number) => void;
  updateWheelInput: (id: string, rawInput: string) => void;
  toggleLock: (id: string) => void;
  setWheelResult: (id: string, result: WheelEntry | undefined) => void;
  setSpinning: (id: string, spinning: boolean) => void;
  loadPreset: (presetId: string) => void;
  toggleAdvancedMode: () => void;
  updateSettings: (settings: Partial<AdvancedSettings>) => void;
  addToHistory: (results: RollHistory["results"]) => void;
  clearHistory: () => void;
  exportData: () => ExportData;
  importData: (data: ExportData) => boolean;
  manualSave: () => void;
  setSaveMessage: (msg: string | null) => void;
}

const defaultSettings: AdvancedSettings = {
  segmentColors: true,
  wheelSize: DEFAULT_WHEEL_SIZE,
  spinDuration: DEFAULT_SPIN_DURATION,
  soundEffects: false,
  showWeightVisualization: true,
};

function syncEntriesFromInput(wheel: Wheel, rawInput: string): Wheel {
  const parsed = parseWheelInput(rawInput);
  const newEntries = parsedToEntries(parsed);

  const colorMap = new Map(wheel.entries.map((e) => [e.label, e.color]));
  newEntries.forEach((e) => {
    const existing = colorMap.get(e.label);
    if (existing) e.color = existing;
  });

  return { ...wheel, rawInput, entries: newEntries, result: undefined };
}

export const useWheelStore = create<WheelStore>()(
  persist(
    (set, get) => ({
      wheels: [createEmptyWheel("Wheel 1")],
      history: [],
      advancedMode: false,
      settings: defaultSettings,
      selectedWheelId: null,
      spinningWheelIds: [],
      lastSavedAt: null,
      saveMessage: null,

      setSelectedWheelId: (id) => set({ selectedWheelId: id }),

      addWheel: () => {
        const { wheels } = get();
        if (wheels.length >= MAX_WHEELS) {
          set({ saveMessage: "Maximum 10 wheels reached" });
          setTimeout(() => set({ saveMessage: null }), 3000);
          return false;
        }
        const newWheel = createEmptyWheel(`Wheel ${wheels.length + 1}`);
        set({ wheels: [...wheels, newWheel], selectedWheelId: newWheel.id });
        return true;
      },

      removeWheel: (id) => {
        const { wheels, selectedWheelId } = get();
        if (wheels.length <= 1) return;
        const filtered = wheels.filter((w) => w.id !== id);
        set({
          wheels: filtered,
          selectedWheelId:
            selectedWheelId === id ? filtered[0]?.id ?? null : selectedWheelId,
        });
      },

      duplicateWheel: (id) => {
        const { wheels } = get();
        if (wheels.length >= MAX_WHEELS) {
          set({ saveMessage: "Maximum 10 wheels reached" });
          setTimeout(() => set({ saveMessage: null }), 3000);
          return false;
        }
        const source = wheels.find((w) => w.id === id);
        if (!source) return false;

        const duplicate: Wheel = {
          ...source,
          id: generateId(),
          title: `${source.title} (Copy)`,
          entries: source.entries.map((e) => ({ ...e, id: generateId() })),
          result: undefined,
          locked: false,
        };
        const index = wheels.findIndex((w) => w.id === id);
        const next = [...wheels];
        next.splice(index + 1, 0, duplicate);
        set({ wheels: next });
        return true;
      },

      renameWheel: (id, title) => {
        set({
          wheels: get().wheels.map((w) =>
            w.id === id ? { ...w, title } : w
          ),
        });
      },

      reorderWheels: (fromIndex, toIndex) => {
        const wheels = [...get().wheels];
        const [moved] = wheels.splice(fromIndex, 1);
        if (!moved) return;
        wheels.splice(toIndex, 0, moved);
        set({ wheels });
      },

      updateWheelInput: (id, rawInput) => {
        set({
          wheels: get().wheels.map((w) =>
            w.id === id ? syncEntriesFromInput(w, rawInput) : w
          ),
        });
      },

      toggleLock: (id) => {
        set({
          wheels: get().wheels.map((w) =>
            w.id === id ? { ...w, locked: !w.locked } : w
          ),
        });
      },

      setWheelResult: (id, result) => {
        set({
          wheels: get().wheels.map((w) =>
            w.id === id ? { ...w, result } : w
          ),
        });
      },

      setSpinning: (id, spinning) => {
        const current = get().spinningWheelIds;
        if (spinning && !current.includes(id)) {
          set({ spinningWheelIds: [...current, id] });
        } else if (!spinning) {
          set({ spinningWheelIds: current.filter((x) => x !== id) });
        }
      },

      loadPreset: (presetId) => {
        const newWheels = createWheelsFromPreset(presetId);
        if (newWheels.length === 0) return;
        set({
          wheels: newWheels.slice(0, MAX_WHEELS),
          selectedWheelId: newWheels[0]?.id ?? null,
        });
      },

      toggleAdvancedMode: () =>
        set({ advancedMode: !get().advancedMode }),

      updateSettings: (partial) =>
        set({ settings: { ...get().settings, ...partial } }),

      addToHistory: (results) => {
        const entry: RollHistory = {
          id: generateId(),
          timestamp: Date.now(),
          results,
        };
        const history = [entry, ...get().history].slice(0, MAX_HISTORY);
        set({ history });
      },

      clearHistory: () => set({ history: [] }),

      exportData: () => {
        const { wheels, settings, advancedMode } = get();
        return {
          wheels: wheels.map(({ result: _r, ...rest }) => rest),
          settings,
          advancedMode,
        };
      },

      importData: (data) => {
        if (!data.wheels || !Array.isArray(data.wheels)) return false;
        const wheels: Wheel[] = data.wheels.slice(0, MAX_WHEELS).map((w) => ({
          id: w.id || generateId(),
          title: w.title || "Wheel",
          rawInput: w.rawInput || entriesToRawInput(w.entries || []),
          entries: (w.entries || []).map((e) => ({
            ...e,
            id: e.id || generateId(),
          })),
          locked: w.locked ?? false,
        }));
        set({
          wheels,
          settings: data.settings ?? get().settings,
          advancedMode: data.advancedMode ?? get().advancedMode,
          selectedWheelId: wheels[0]?.id ?? null,
        });
        return true;
      },

      manualSave: () => {
        set({ lastSavedAt: Date.now(), saveMessage: "Saved!" });
        setTimeout(() => set({ saveMessage: null }), 2000);
      },

      setSaveMessage: (msg) => set({ saveMessage: msg }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        wheels: state.wheels,
        history: state.history,
        advancedMode: state.advancedMode,
        settings: state.settings,
      }),
    }
  )
);

export function sortWheelEntries(id: string): void {
  const store = useWheelStore.getState();
  const wheel = store.wheels.find((w) => w.id === id);
  if (!wheel) return;

  const sorted = sortEntriesByWeightDesc(wheel.entries);
  const rawInput = entriesToRawInput(sorted);
  store.updateWheelInput(id, rawInput);
}
