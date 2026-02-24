"use client";

import { useEffect, useState } from "react";
import { StarryBackground } from "./starry-background";
import { Header } from "./header";
import { PetSphere } from "./pet-sphere";
import { ActionBar } from "./action-bar";

// Deterministic pseudo-random based on seed
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function EntranceOverlay({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"expanding" | "fading" | "done">("expanding");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fading"), 600);
    const t2 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center transition-opacity duration-600 ${
        phase === "fading" ? "opacity-0" : "opacity-100"
      }`}
      style={{ background: "#1A1B4B" }}
    >
      {/* Expanding stars */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const distance = 40 + seededRandom(i + 100) * 60;
        return (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full"
            style={{
              background: "#D4AF37",
              boxShadow: "0 0 6px rgba(212,175,55,0.6)",
              animation: `starsExpand 0.8s ease-out ${i * 0.03}s forwards`,
              left: `calc(50% + ${Math.cos(angle) * distance}vmin)`,
              top: `calc(50% + ${Math.sin(angle) * distance}vmin)`,
              opacity: 0,
            }}
          />
        );
      })}

      {/* Center glow */}
      <div
        className="h-4 w-4 rounded-full"
        style={{
          background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)",
          animation: "starsExpand 0.6s ease-out forwards",
          boxShadow: "0 0 40px 20px rgba(212,175,55,0.3)",
        }}
      />
    </div>
  );
}

export function StarPetHome() {
  const [entranceDone, setEntranceDone] = useState(false);

  return (
    <main
      className="relative flex h-dvh flex-col overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #1A1B4B 0%, #2A2658 40%, #352F64 100%)",
      }}
    >
      <EntranceOverlay onComplete={() => setEntranceDone(true)} />

      <StarryBackground />

      <Header />

      {/* Core sphere area */}
      <div className="relative z-10 flex-1 pt-16 pb-32">
        {entranceDone && <PetSphere />}
      </div>

      <ActionBar />
    </main>
  );
}
