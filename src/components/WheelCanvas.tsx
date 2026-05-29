"use client";

import {
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import type { WheelEntry } from "@/types";
import { computeSegments, pickSpinResult, easeOutCubic } from "@/lib/wheelGeometry";
import { WHEEL_COLORS } from "@/lib/constants";

export interface WheelCanvasHandle {
  spin: (
    onComplete: (entry: WheelEntry, segmentIndex: number) => void
  ) => void;
  isSpinning: () => boolean;
}

interface WheelCanvasProps {
  entries: WheelEntry[];
  size: number;
  spinDuration: number;
  showColors: boolean;
  highlightIndex?: number;
  onSpinStart?: () => void;
}

function drawWheel(
  ctx: CanvasRenderingContext2D,
  entries: WheelEntry[],
  rotation: number,
  size: number,
  showColors: boolean,
  highlightIndex: number
) {
  const center = size / 2;
  const radius = center - 8;
  const segments = computeSegments(entries);

  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(rotation);

  segments.forEach((seg, i) => {
    const color = showColors
      ? seg.entry.color ?? WHEEL_COLORS[i % WHEEL_COLORS.length]
      : `hsl(${(i * 360) / segments.length}, 65%, 50%)`;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, seg.startAngle, seg.endAngle);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    if (i === highlightIndex) {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.stroke();
    } else {
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.save();
    ctx.rotate(seg.midAngle);
    ctx.textAlign = "right";
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${Math.max(9, Math.min(12, radius / segments.length))}px sans-serif`;
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 4;

    const label =
      seg.entry.label.length > 14
        ? `${seg.entry.label.slice(0, 12)}…`
        : seg.entry.label;
    ctx.fillText(label, radius - 12, 4);
    ctx.restore();
  });

  ctx.restore();

  ctx.beginPath();
  ctx.arc(center, center, radius * 0.12, 0, Math.PI * 2);
  ctx.fillStyle = "#18181b";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(center, 4);
  ctx.lineTo(center - 10, 22);
  ctx.lineTo(center + 10, 22);
  ctx.closePath();
  ctx.fillStyle = "#f43f5e";
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

export const WheelCanvas = forwardRef<WheelCanvasHandle, WheelCanvasProps>(
  function WheelCanvas(
    {
      entries,
      size,
      spinDuration,
      showColors,
      highlightIndex = -1,
      onSpinStart,
    },
    ref
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rotationRef = useRef(0);
    const animatingRef = useRef(false);
    const rafRef = useRef<number>(0);
    const highlightRef = useRef(highlightIndex);

    useEffect(() => {
      highlightRef.current = highlightIndex;
    }, [highlightIndex]);

    const render = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.scale(dpr, dpr);

      drawWheel(
        ctx,
        entries,
        rotationRef.current,
        size,
        showColors,
        highlightRef.current
      );
    }, [entries, size, showColors]);

    useEffect(() => {
      render();
    }, [render]);

    useImperativeHandle(ref, () => ({
      isSpinning: () => animatingRef.current,
      spin: (onComplete) => {
        if (animatingRef.current || entries.length === 0) return;

        const result = pickSpinResult(entries, rotationRef.current);
        if (!result) return;

        animatingRef.current = true;
        onSpinStart?.();

        const startRotation = rotationRef.current;
        const endRotation = result.targetRotation;
        const startTime = performance.now();
        const duration = spinDuration;

        const animate = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeOutCubic(progress);

          rotationRef.current =
            startRotation + (endRotation - startRotation) * eased;
          highlightRef.current = -1;
          render();

          if (progress < 1) {
            rafRef.current = requestAnimationFrame(animate);
          } else {
            rotationRef.current = endRotation;
            highlightRef.current = result.segmentIndex;
            animatingRef.current = false;
            render();
            onComplete(result.entry, result.segmentIndex);
          }
        };

        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(animate);
      },
    }));

    useEffect(() => {
      return () => cancelAnimationFrame(rafRef.current);
    }, []);

    if (entries.length === 0) {
      return (
        <div
          className="flex items-center justify-center rounded-full border-2 border-dashed border-white/20 bg-white/5 text-white/40 text-sm"
          style={{ width: size, height: size }}
        >
          Add entries
        </div>
      );
    }

    return (
      <canvas
        ref={canvasRef}
        className="rounded-full"
        aria-label="Spinning wheel"
        role="img"
      />
    );
  }
);
