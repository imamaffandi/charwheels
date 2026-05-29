"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import {
  Plus,
  RotateCw,
  Save,
  FileJson,
  Settings2,
} from "lucide-react";
import { Header, AdvancedSettingsPanel } from "@/components/Header";
import { WheelCard, type WheelCardHandle } from "@/components/WheelCard";
import { CharacterSheet } from "@/components/CharacterSheet";
import { HistoryPanel } from "@/components/HistoryPanel";
import { ImportExportDialog } from "@/components/ImportExportDialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useWheelStore } from "@/store/wheelStore";
import { useKeyboardShortcuts, useWindowSize } from "@/hooks/useKeyboardShortcuts";
import { PRESETS } from "@/lib/presets";
import { MAX_WHEELS } from "@/lib/constants";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

export function WheelApp() {
  const wheelRefs = useRef<Map<string, WheelCardHandle>>(new Map());
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCharacterSheet, setShowCharacterSheet] = useState(false);
  const [importExportOpen, setImportExportOpen] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });

  const {
    wheels,
    selectedWheelId,
    setSelectedWheelId,
    addWheel,
    reorderWheels,
    manualSave,
    saveMessage,
    advancedMode,
    toggleAdvancedMode,
    loadPreset,
    addToHistory,
    exportData,
    importData,
    spinningWheelIds,
  } = useWheelStore();

  useEffect(() => {
    const update = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const setWheelRef = useCallback(
    (id: string, handle: WheelCardHandle | null) => {
      if (handle) {
        wheelRefs.current.set(id, handle);
      } else {
        wheelRefs.current.delete(id);
      }
    },
    []
  );

  const spinWheel = useCallback(async (wheelId: string) => {
    const ref = wheelRefs.current.get(wheelId);
    if (ref && !ref.isLocked()) {
      await ref.spin();
    }
  }, []);

  const spinSelected = useCallback(() => {
    if (selectedWheelId) {
      void spinWheel(selectedWheelId);
    }
  }, [selectedWheelId, spinWheel]);

  const spinAll = useCallback(async () => {
    const spinPromises: Promise<void>[] = [];

    wheels.forEach((wheel) => {
      const ref = wheelRefs.current.get(wheel.id);
      if (ref && !ref.isLocked() && !ref.isSpinning()) {
        spinPromises.push(ref.spin());
      }
    });

    if (spinPromises.length === 0) return;

    await Promise.all(spinPromises);

    const currentWheels = useWheelStore.getState().wheels;
    const results = currentWheels
      .filter((w) => w.result)
      .map((w) => ({
        wheelId: w.id,
        wheelTitle: w.title,
        entry: w.result!,
      }));

    if (results.length > 0) {
      addToHistory(results);
      setShowConfetti(true);
      setShowCharacterSheet(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [wheels, addToHistory]);

  useKeyboardShortcuts({
    onSpinSelected: spinSelected,
    onSpinAll: spinAll,
  });

  const handleSpinComplete = useCallback(
    (wheelId: string) => {
      const spinning = useWheelStore.getState().spinningWheelIds;
      if (spinning.length === 0) {
        const currentWheels = useWheelStore.getState().wheels;
        const wheel = currentWheels.find((w) => w.id === wheelId);
        if (wheel?.result) {
          addToHistory([
            {
              wheelId: wheel.id,
              wheelTitle: wheel.title,
              entry: wheel.result,
            },
          ]);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 4000);
        }
      }
    },
    [addToHistory]
  );

  const isSpinningAny = spinningWheelIds.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-indigo-950/40 to-zinc-950">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={300}
          gravity={0.15}
        />
      )}

      <Header />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
          <Select onValueChange={loadPreset}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Load Preset" />
            </SelectTrigger>
            <SelectContent>
              {PRESETS.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Switch
              id="advanced-mode"
              checked={advancedMode}
              onCheckedChange={toggleAdvancedMode}
            />
            <Label htmlFor="advanced-mode" className="text-sm cursor-pointer">
              Advanced Mode
            </Label>
          </div>

          <Badge variant="secondary">
            {wheels.length}/{MAX_WHEELS} wheels
          </Badge>

          {saveMessage && (
            <Badge variant={saveMessage.includes("Maximum") ? "default" : "success"}>
              {saveMessage}
            </Badge>
          )}

          <div className="ml-auto flex flex-wrap gap-2">
            <Button
              size="lg"
              onClick={() => void spinAll()}
              disabled={isSpinningAny}
            >
              <RotateCw
                className={`h-5 w-5 ${isSpinningAny ? "animate-spin" : ""}`}
              />
              Spin All
            </Button>
            <Button
              variant="secondary"
              onClick={() => addWheel()}
              disabled={wheels.length >= MAX_WHEELS}
            >
              <Plus className="h-4 w-4" />
              Add Wheel
            </Button>
            <Button variant="secondary" onClick={manualSave}>
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button
              variant="outline"
              onClick={() => setImportExportOpen(true)}
            >
              <FileJson className="h-4 w-4" />
              Import/Export
            </Button>
          </div>
        </div>

        {/* Character Sheet */}
        <CharacterSheet wheels={wheels} visible={showCharacterSheet} />

        {/* Wheels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {wheels.map((wheel, index) => (
              <WheelCard
                key={wheel.id}
                ref={(handle) => setWheelRef(wheel.id, handle)}
                wheel={wheel}
                index={index}
                totalWheels={wheels.length}
                isSelected={selectedWheelId === wheel.id}
                onSelect={() => setSelectedWheelId(wheel.id)}
                onMoveUp={() => reorderWheels(index, index - 1)}
                onMoveDown={() => reorderWheels(index, index + 1)}
                onSpinComplete={handleSpinComplete}
                showAdvanced={advancedMode}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom panels */}
        <div className="grid gap-4 lg:grid-cols-2">
          {advancedMode && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Settings2 className="h-4 w-4" />
                Advanced Settings
              </div>
              <AdvancedSettingsPanel />
            </div>
          )}
          <HistoryPanel />
        </div>

        {/* Keyboard shortcuts hint */}
        <p className="text-center text-xs text-white/30 pb-4">
          Shortcuts: Space = spin selected · Shift+Space = spin all · Ctrl+S =
          save · Ctrl+N = new wheel
        </p>
      </main>

      <ImportExportDialog
        open={importExportOpen}
        onOpenChange={setImportExportOpen}
        onExport={exportData}
        onImport={importData}
      />
    </div>
  );
}
