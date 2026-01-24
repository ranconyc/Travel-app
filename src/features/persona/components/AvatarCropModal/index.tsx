"use client";

import { useState, useRef, useEffect } from "react";
import Button from "@/components/atoms/Button";
import { X, ZoomIn, ZoomOut } from "lucide-react";

interface AvatarCropModalProps {
  imageUrl: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

export default function AvatarCropModal({
  imageUrl,
  onCropComplete,
  onCancel,
}: AvatarCropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Load image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      imageRef.current = img;
      draw();
    };
  }, [imageUrl]);

  // Draw loop
  const draw = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background (optional: dark overlay for circle mask)
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calc draw dimensions
    const size = Math.min(canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Clip to circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, size / 2 - 20, 0, Math.PI * 2);
    ctx.clip();

    // Draw image centered with offset
    // Ensure image covers the circle (cover logic)
    const ratio = Math.max(size / img.width, size / img.height) * scale;
    const drawW = img.width * ratio;
    const drawH = img.height * ratio;
    const drawX = centerX - drawW / 2 + offset.x;
    const drawY = centerY - drawH / 2 + offset.y;

    // Draw white background behind image
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();

    // Draw circle border (guide)
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, size / 2 - 20, 0, Math.PI * 2);
    ctx.stroke();
  };

  useEffect(() => {
    draw();
  }, [scale, offset]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(
      (blob) => {
        if (blob) onCropComplete(blob);
      },
      "image/jpeg",
      0.9,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-surface rounded-2xl w-full max-w-sm flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 flex justify-between items-center bg-surface-secondary/20">
          <h3 className="font-bold text-lg">Crop Photo</h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-surface-secondary/50 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative w-full aspect-square bg-black overflow-hidden cursor-move touch-none">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="w-full h-full"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />
        </div>

        <div className="p-4 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <ZoomOut size={16} className="text-secondary" />
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="flex-1 accent-brand h-1.5 bg-surface-secondary rounded-lg appearance-none cursor-pointer"
            />
            <ZoomIn size={16} className="text-secondary" />
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
