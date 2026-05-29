"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface WheelEditorProps {
  rawInput: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function WheelEditor({ rawInput, onChange, disabled }: WheelEditorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="wheel-input" className="text-xs text-white/50">
        Entries (weight,label or label)
      </Label>
      <Textarea
        id="wheel-input"
        value={rawInput}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={`50,Mortal\n40,Hybrid\n25,Elf\nHuman\nOrc`}
        spellCheck={false}
        aria-label="Wheel entries input"
      />
    </div>
  );
}
