"use client";

import {
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { motion } from "framer-motion";
import {
  GripVertical,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock,
  SortDesc,
  RotateCw,
  ClipboardCopy,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { WheelCanvas, type WheelCanvasHandle } from "@/components/WheelCanvas";
import { WheelEditor } from "@/components/WheelEditor";
import { ResultPanel } from "@/components/ResultPanel";
import { ProbabilityViewer } from "@/components/ProbabilityViewer";
import type { Wheel } from "@/types";
import { useWheelStore, sortWheelEntries } from "@/store/wheelStore";
import { playSpinSound, playWinSound } from "@/lib/sounds";

export interface WheelCardHandle {
  spin: () => Promise<void>;
  isSpinning: () => boolean;
  getWheelId: () => string;
  isLocked: () => boolean;
}

interface WheelCardProps {
  wheel: Wheel;
  index: number;
  totalWheels: number;
  isSelected: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onSpinComplete?: (wheelId: string) => void;
  showAdvanced: boolean;
}

export const WheelCard = forwardRef<WheelCardHandle, WheelCardProps>(
  function WheelCard(
    {
      wheel,
      index,
      totalWheels,
      isSelected,
      onSelect,
      onMoveUp,
      onMoveDown,
      onSpinComplete,
      showAdvanced,
    },
    ref
  ) {
    const canvasRef = useRef<WheelCanvasHandle>(null);
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const [copied, setCopied] = useState(false);

    const {
      renameWheel,
      removeWheel,
      duplicateWheel,
      updateWheelInput,
      toggleLock,
      setWheelResult,
      setSpinning,
      settings,
      spinningWheelIds,
    } = useWheelStore();

    const isSpinning = spinningWheelIds.includes(wheel.id);

    const handleSpin = useCallback((): Promise<void> => {
      return new Promise((resolve) => {
        if (wheel.locked || wheel.entries.length === 0) {
          resolve();
          return;
        }

        const canvas = canvasRef.current;
        if (!canvas || canvas.isSpinning()) {
          resolve();
          return;
        }

        setHighlightIndex(-1);
        setSpinning(wheel.id, true);

        if (settings.soundEffects) playSpinSound();

        canvas.spin((entry, segIndex) => {
          setHighlightIndex(segIndex);
          setWheelResult(wheel.id, entry);
          setSpinning(wheel.id, false);
          if (settings.soundEffects) playWinSound();
          onSpinComplete?.(wheel.id);
          resolve();
        });
      });
    }, [
      wheel.id,
      wheel.locked,
      wheel.entries.length,
      settings.soundEffects,
      setSpinning,
      setWheelResult,
      onSpinComplete,
    ]);

    useImperativeHandle(ref, () => ({
      spin: handleSpin,
      isSpinning: () => canvasRef.current?.isSpinning() ?? false,
      getWheelId: () => wheel.id,
      isLocked: () => wheel.locked,
    }));

    const copyResult = async () => {
      if (!wheel.result) return;
      await navigator.clipboard.writeText(wheel.result.label);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    };

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          className={`transition-all duration-200 ${
            isSelected
              ? "ring-2 ring-accent/50 border-accent/30"
              : "hover:border-foreground/20"
          } ${wheel.locked ? "opacity-80" : ""}`}
          onClick={onSelect}
          role="article"
          aria-label={`${wheel.title} wheel`}
        >
          <CardHeader className="pb-1">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-foreground/30 shrink-0 cursor-grab" />
              <Input
                value={wheel.title}
                onChange={(e) => renameWheel(wheel.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="h-8 text-sm font-semibold border-none bg-transparent px-1 focus-visible:ring-1"
                aria-label="Wheel title"
              />
              {wheel.locked && (
                <Badge variant="secondary">
                  <Lock className="h-3 w-3 mr-1" />
                  Locked
                </Badge>
              )}
              <div className="ml-auto flex gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveUp();
                  }}
                  disabled={index === 0}
                  aria-label="Move wheel up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveDown();
                  }}
                  disabled={index === totalWheels - 1}
                  aria-label="Move wheel down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex justify-center py-2">
              <WheelCanvas
                ref={canvasRef}
                entries={wheel.entries}
                size={settings.wheelSize}
                spinDuration={settings.spinDuration}
                showColors={settings.segmentColors}
                highlightIndex={highlightIndex}
              />
            </div>

            <ResultPanel result={wheel.result} />

            <WheelEditor
              rawInput={wheel.rawInput}
              onChange={(v) => updateWheelInput(wheel.id, v)}
              disabled={wheel.locked}
            />

            {showAdvanced && settings.showWeightVisualization && (
              <div className="rounded-lg bg-foreground/5 p-3 border border-foreground/5">
                <p className="text-xs text-foreground/50 mb-2 font-medium">
                  Probabilities
                </p>
                <ProbabilityViewer entries={wheel.entries} />
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  void handleSpin();
                }}
                disabled={isSpinning || wheel.locked || wheel.entries.length === 0}
                className="flex-1 min-w-[80px]"
                aria-label={`Spin ${wheel.title}`}
              >
                <RotateCw
                  className={`h-4 w-4 ${isSpinning ? "animate-spin" : ""}`}
                />
                Spin
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  sortWheelEntries(wheel.id);
                }}
                disabled={wheel.locked}
                aria-label="Sort by weight"
              >
                <SortDesc className="h-4 w-4" />
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  void copyResult();
                }}
                disabled={!wheel.result}
                aria-label="Copy result"
              >
                <ClipboardCopy className="h-4 w-4" />
                {copied ? "!" : ""}
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLock(wheel.id);
                }}
                aria-label={wheel.locked ? "Unlock wheel" : "Lock wheel"}
              >
                {wheel.locked ? (
                  <Unlock className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateWheel(wheel.id);
                }}
                aria-label="Duplicate wheel"
              >
                <Copy className="h-4 w-4" />
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeWheel(wheel.id);
                }}
                disabled={totalWheels <= 1}
                aria-label="Delete wheel"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);
