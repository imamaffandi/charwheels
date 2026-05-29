export interface WheelEntry {
  id: string;
  label: string;
  weight: number;
  color?: string;
}

export interface Wheel {
  id: string;
  title: string;
  entries: WheelEntry[];
  rawInput: string;
  result?: WheelEntry;
  locked: boolean;
}

export interface RollHistoryEntry {
  wheelId: string;
  wheelTitle: string;
  entry: WheelEntry;
}

export interface RollHistory {
  id: string;
  timestamp: number;
  results: RollHistoryEntry[];
}

export interface AdvancedSettings {
  segmentColors: boolean;
  wheelSize: number;
  spinDuration: number;
  soundEffects: boolean;
  showWeightVisualization: boolean;
}

export interface AppState {
  wheels: Wheel[];
  history: RollHistory[];
  advancedMode: boolean;
  settings: AdvancedSettings;
  selectedWheelId: string | null;
}

export interface ExportData {
  wheels: Omit<Wheel, "result">[];
  settings?: AdvancedSettings;
  advancedMode?: boolean;
}

export interface SegmentGeometry {
  entry: WheelEntry;
  startAngle: number;
  endAngle: number;
  midAngle: number;
}

export interface SpinResult {
  entry: WheelEntry;
  targetRotation: number;
  segmentIndex: number;
}
