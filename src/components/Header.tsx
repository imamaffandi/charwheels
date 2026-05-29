"use client";

import { Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWheelStore } from "@/store/wheelStore";

export function AdvancedSettingsPanel() {
  const { settings, updateSettings } = useWheelStore();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Advanced Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="segment-colors">Segment Colors</Label>
          <Switch
            id="segment-colors"
            checked={settings.segmentColors}
            onCheckedChange={(v) => updateSettings({ segmentColors: v })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="weight-viz">Weight Visualization</Label>
          <Switch
            id="weight-viz"
            checked={settings.showWeightVisualization}
            onCheckedChange={(v) =>
              updateSettings({ showWeightVisualization: v })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="sound-fx">Sound Effects</Label>
          <Switch
            id="sound-fx"
            checked={settings.soundEffects}
            onCheckedChange={(v) => updateSettings({ soundEffects: v })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="wheel-size">Wheel Size ({settings.wheelSize}px)</Label>
          <Input
            id="wheel-size"
            type="range"
            min={160}
            max={320}
            step={10}
            value={settings.wheelSize}
            onChange={(e) =>
              updateSettings({ wheelSize: Number(e.target.value) })
            }
            className="h-2 p-0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="spin-duration">
            Spin Duration ({(settings.spinDuration / 1000).toFixed(1)}s)
          </Label>
          <Input
            id="spin-duration"
            type="range"
            min={3000}
            max={5000}
            step={250}
            value={settings.spinDuration}
            onChange={(e) =>
              updateSettings({ spinDuration: Number(e.target.value) })
            }
            className="h-2 p-0"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function Header() {
  return (
    <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex items-center gap-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Wheel of Fortune
          </h1>
          <p className="text-xs text-white/50">Character Builder</p>
        </div>
      </div>
    </header>
  );
}
