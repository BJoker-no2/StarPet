"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export interface PetData {
  id: number;
  name: string;
  image: string;
  message: string;
  flowers: number;
  isNew?: boolean;
}

interface PetBubbleProps {
  pet: PetData;
  index: number;
  onSelect: (pet: PetData) => void;
  entranceDelay: number;
}

// Deterministic pseudo-random based on seed
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function getStaticPosition(index: number) {
  const cols = 3;
  const col = index % cols;
  const row = Math.floor(index / cols);
  const baseX = (col / cols) * 70 + 5;
  const baseY = row * 35 + 5;
  const randomX = (seededRandom(index * 7 + 1) - 0.5) * 15;
  const randomY = (seededRandom(index * 13 + 3) - 0.5) * 15;
  return {
    x: Math.max(5, Math.min(75, baseX + randomX)),
    y: Math.max(5, Math.min(65, baseY + randomY)),
  };
}

export function PetBubble({ pet, index, onSelect, entranceDelay }: PetBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const bubbleRef = useRef<HTMLButtonElement>(null);

  // Deterministic position computed from index
  const position = getStaticPosition(index);

  // Unique float animation per bubble
  const animDuration = 8 + (index % 4) * 2;
  const animDelay = index * 0.5;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), entranceDelay);
    return () => clearTimeout(timer);
  }, [entranceDelay]);

  const size = 100 + (index % 3) * 20;

  return (
    <button
      ref={bubbleRef}
      className={`group absolute cursor-pointer transition-all duration-500 ${
        isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${size}px`,
        height: `${size}px`,
        animation: isVisible
          ? `floatBubble ${animDuration}s ease-in-out ${animDelay}s infinite, breatheGlow ${animDuration / 2}s ease-in-out ${animDelay}s infinite`
          : "none",
        transform: isHovered ? "scale(1.15)" : undefined,
        zIndex: isHovered ? 10 : 1,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(pet)}
      aria-label={`查看 ${pet.name} 的思念卡片`}
    >
      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-500"
        style={{
          background: `linear-gradient(135deg, rgba(244,180,198,${
            isHovered ? 0.4 : 0.15
          }), rgba(168,216,234,${isHovered ? 0.4 : 0.15}))`,
          filter: `blur(${isHovered ? 8 : 4}px)`,
          transform: `scale(${isHovered ? 1.2 : 1.08})`,
        }}
      />

      {/* Border ring */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-300"
        style={{
          border: `2px solid rgba(255,255,255,${isHovered ? 0.35 : 0.15})`,
          background: `radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)`,
        }}
      />

      {/* Pet image */}
      <div className="absolute inset-2 overflow-hidden rounded-full">
        <Image
          src={pet.image}
          alt={pet.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes={`${size}px`}
        />
      </div>

      {/* Name label on hover */}
      <div
        className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-all duration-300 ${
          isHovered
            ? "translate-y-0 opacity-100"
            : "translate-y-2 opacity-0"
        }`}
        style={{
          background: "rgba(26, 27, 75, 0.8)",
          color: "#D4AF37",
          border: "1px solid rgba(212,175,55,0.3)",
        }}
      >
        {pet.name}
      </div>

      {/* New member meteor debris */}
      {pet.isNew && (
        <div className="pointer-events-none absolute inset-0">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full"
              style={{
                background: "#D4AF37",
                animation: `meteorDebris ${3 + i}s linear ${i * 1}s infinite`,
                boxShadow: "0 0 4px rgba(212,175,55,0.6)",
              }}
            />
          ))}
        </div>
      )}
    </button>
  );
}
