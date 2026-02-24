"use client";

import Image from "next/image";
import { X, Share2 } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import type { PetData } from "./pet-bubble";

interface MemoryCardProps {
  pet: PetData | null;
  onClose: () => void;
}

function FlowerParticle({ id, onComplete }: { id: number; onComplete: (id: number) => void }) {
  // Deterministic offset based on id
  const offsetX = (Math.sin(id * 9301 + 49297) % 1) * 60 - 30;

  useEffect(() => {
    const timer = setTimeout(() => onComplete(id), 1500);
    return () => clearTimeout(timer);
  }, [id, onComplete]);

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: `calc(50% + ${offsetX}px)`,
        bottom: "60px",
        animation: "flowerFloat 1.5s ease-out forwards",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="6" r="2.5" fill="#F4B4C6" opacity="0.9" />
        <circle cx="5.5" cy="8" r="2.5" fill="#FFD4E0" opacity="0.85" />
        <circle cx="10.5" cy="8" r="2.5" fill="#FFD4E0" opacity="0.85" />
        <circle cx="6.5" cy="10.5" r="2.5" fill="#F4B4C6" opacity="0.8" />
        <circle cx="9.5" cy="10.5" r="2.5" fill="#F4B4C6" opacity="0.8" />
        <circle cx="8" cy="8.5" r="2" fill="#D4AF37" />
      </svg>
    </div>
  );
}

export function MemoryCard({ pet, onClose }: MemoryCardProps) {
  const [flowers, setFlowers] = useState(0);
  const [particles, setParticles] = useState<number[]>([]);
  const nextParticleId = useRef(0);

  useEffect(() => {
    if (pet) {
      setFlowers(pet.flowers);
    }
  }, [pet]);

  const handleFlower = () => {
    setFlowers((f) => f + 1);

    // Haptic feedback
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([30, 50, 30]);
    }

    // Spawn particles
    const newId = nextParticleId.current++;
    setParticles((prev) => [...prev, newId]);
  };

  const removeParticle = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p !== id));
  }, []);

  if (!pet) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-in fade-in duration-300"
        style={{ background: "rgba(10, 10, 40, 0.75)", backdropFilter: "blur(8px)" }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-sm animate-in zoom-in-95 fade-in slide-in-from-bottom-4 duration-500 overflow-hidden rounded-3xl"
        style={{
          background: "linear-gradient(180deg, rgba(53, 47, 100, 0.95) 0%, rgba(26, 27, 75, 0.98) 100%)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 0 60px rgba(212,175,55,0.1), 0 20px 60px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
          aria-label="关闭"
        >
          <X className="h-4 w-4 text-foreground" />
        </button>

        {/* Top: Pet Image */}
        <div className="relative px-8 pt-8 pb-4">
          <div className="relative mx-auto aspect-square w-56 overflow-hidden rounded-2xl"
            style={{
              border: "3px solid rgba(212,175,55,0.3)",
              boxShadow: "0 0 30px rgba(212,175,55,0.15), inset 0 0 30px rgba(0,0,0,0.2)",
            }}
          >
            <Image
              src={pet.image}
              alt={pet.name}
              fill
              className="object-cover"
              sizes="224px"
            />
            {/* Corner ornaments */}
            <div className="absolute top-2 left-2 h-4 w-4 border-t-2 border-l-2 rounded-tl-sm" style={{ borderColor: "rgba(212,175,55,0.5)" }} />
            <div className="absolute top-2 right-2 h-4 w-4 border-t-2 border-r-2 rounded-tr-sm" style={{ borderColor: "rgba(212,175,55,0.5)" }} />
            <div className="absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 rounded-bl-sm" style={{ borderColor: "rgba(212,175,55,0.5)" }} />
            <div className="absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 rounded-br-sm" style={{ borderColor: "rgba(212,175,55,0.5)" }} />
          </div>
        </div>

        {/* Middle: Name and Message */}
        <div className="px-8 py-4 text-center">
          <h2
            className="mb-2 text-xl font-bold tracking-wider"
            style={{ color: "#D4AF37" }}
          >
            {pet.name}
          </h2>
          <div
            className="relative mx-auto max-w-xs rounded-xl px-4 py-3"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p className="text-sm leading-relaxed tracking-wide text-foreground/80">
              &ldquo;{pet.message}&rdquo;
            </p>
          </div>
        </div>

        {/* Bottom: Actions */}
        <div className="relative flex items-center justify-center gap-6 px-8 pt-2 pb-8">
          {/* Flower button */}
          <button
            onClick={handleFlower}
            className="flex items-center gap-2 rounded-full px-5 py-2.5 transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, rgba(244,180,198,0.2), rgba(244,180,198,0.1))",
              border: "1px solid rgba(244,180,198,0.3)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="7" r="3" fill="#F4B4C6" opacity="0.9" />
              <circle cx="6" cy="9" r="3" fill="#FFD4E0" opacity="0.85" />
              <circle cx="12" cy="9" r="3" fill="#FFD4E0" opacity="0.85" />
              <circle cx="7.5" cy="11.5" r="3" fill="#F4B4C6" opacity="0.8" />
              <circle cx="10.5" cy="11.5" r="3" fill="#F4B4C6" opacity="0.8" />
              <circle cx="9" cy="9.5" r="2.5" fill="#D4AF37" />
            </svg>
            <span className="text-sm font-semibold" style={{ color: "#F4B4C6" }}>
              {flowers}
            </span>
          </button>

          {/* Share button */}
          <button
            className="flex items-center gap-2 rounded-full px-5 py-2.5 transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, rgba(168,216,234,0.2), rgba(168,216,234,0.1))",
              border: "1px solid rgba(168,216,234,0.3)",
            }}
          >
            <Share2 className="h-4 w-4" style={{ color: "#A8D8EA" }} />
            <span className="text-sm font-semibold" style={{ color: "#A8D8EA" }}>
              分享
            </span>
          </button>

          {/* Flower particles */}
          {particles.map((id) => (
            <FlowerParticle key={id} id={id} onComplete={removeParticle} />
          ))}
        </div>
      </div>
    </div>
  );
}
