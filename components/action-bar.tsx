"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ActionBar() {
  const [pressed, setPressed] = useState(false);
  const router = useRouter();

  return (
    <div
      className="fixed bottom-0 right-0 left-0 z-40 flex flex-col items-center pb-6 pt-8"
      style={{
        background:
          "linear-gradient(to top, rgba(26,27,75,0.95) 0%, rgba(26,27,75,0.6) 60%, transparent 100%)",
      }}
    >
      {/* CTA Button */}
      <button
        type="button"
        className={`group relative flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 ${
          pressed ? "scale-95" : "hover:scale-110"
        }`}
        style={{
          background: "linear-gradient(135deg, #D4AF37, #F4B4C6, #A8D8EA)",
          animation: "neonPulse 3s ease-in-out infinite",
        }}
        onClick={() => router.push("/guard/upload")}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        aria-label="开启守护"
      >
        <Plus
          className="h-6 w-6 transition-transform duration-300 group-hover:rotate-90"
          style={{ color: "#1A1B4B" }}
        />

        {/* Inner ring */}
        <div
          className="absolute inset-1 rounded-full"
          style={{ border: "1.5px solid rgba(26,27,75,0.15)" }}
        />
      </button>

      {/* Label */}
      <p
        className="mt-2 text-sm font-semibold tracking-widest"
        style={{ color: "#D4AF37" }}
      >
        + 开启守护
      </p>

      {/* Stats */}
      <p className="mt-1 text-xs tracking-wide text-foreground/50">
        已有 <span style={{ color: "#D4AF37" }}>1,205</span> 位守护天使在此相聚
      </p>
    </div>
  );
}

