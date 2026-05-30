"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, Upload } from "lucide-react";
import type { ExportData } from "@/types";

interface ImportExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: () => ExportData;
  onImport: (data: ExportData) => boolean;
}

export function ImportExportDialog({
  open,
  onOpenChange,
  onExport,
  onImport,
}: ImportExportDialogProps) {
  const [importText, setImportText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"export" | "import">("export");

  const handleExport = () => {
    const data = onExport();
    const json = JSON.stringify({ wheels: data.wheels, settings: data.settings, advancedMode: data.advancedMode }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wheel-config.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    setError(null);
    try {
      const parsed = JSON.parse(importText) as ExportData;
      if (!parsed.wheels) {
        setError("Invalid format: missing wheels array");
        return;
      }
      const success = onImport(parsed);
      if (success) {
        setImportText("");
        onOpenChange(false);
      } else {
        setError("Import failed. Check data format.");
      }
    } catch {
      setError("Invalid JSON");
    }
  };

  const exportPreview = JSON.stringify(onExport(), null, 2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import / Export</DialogTitle>
          <DialogDescription>
            Share wheel configurations as JSON
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <Button
            variant={mode === "export" ? "default" : "secondary"}
            size="sm"
            onClick={() => setMode("export")}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant={mode === "import" ? "default" : "secondary"}
            size="sm"
            onClick={() => setMode("import")}
          >
            <Upload className="h-4 w-4" />
            Import
          </Button>
        </div>

        {mode === "export" ? (
          <div className="space-y-3">
            <Textarea
              readOnly
              value={exportPreview}
              className="min-h-[200px] text-xs"
              aria-label="Export preview"
            />
            <Button onClick={handleExport} className="w-full">
              <Download className="h-4 w-4" />
              Download JSON
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='{"wheels": [...]}'
              className="min-h-[200px] text-xs"
              aria-label="Import JSON"
            />
            {error && (
              <p className="text-sm text-accent" role="alert">
                {error}
              </p>
            )}
            <Button onClick={handleImport} className="w-full" disabled={!importText.trim()}>
              <Upload className="h-4 w-4" />
              Import Configuration
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
