"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { AuthButton } from "./auth-button";
import { UserMenu } from "./user-menu";

function PawLogo() {
  return (
    <div className="relative flex items-center gap-2">
      <div className="relative">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          className="relative z-10"
        >
          {/* Main paw pad */}
          <ellipse cx="16" cy="20" rx="7" ry="6" fill="#D4AF37" opacity="0.9" />
          {/* Toe beans */}
          <circle cx="9" cy="13" r="3" fill="#D4AF37" opacity="0.85" />
          <circle cx="16" cy="10" r="3.2" fill="#D4AF37" opacity="0.85" />
          <circle cx="23" cy="13" r="3" fill="#D4AF37" opacity="0.85" />
        </svg>
        <div
          className="absolute inset-0 rounded-full blur-md"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)",
          }}
        />
      </div>
      <span className="text-lg font-bold tracking-wide text-foreground">
        StarPet
      </span>
    </div>
  );
}

export function Header() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header
      className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-4 py-3 backdrop-blur-md md:px-8 md:py-4"
      style={{ background: "rgba(26, 27, 75, 0.6)" }}
    >
      <PawLogo />

      <div
        className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-300 ${
          searchFocused ? "w-64 md:w-80" : "w-48 md:w-64"
        }`}
        style={{
          background: searchFocused
            ? "rgba(255,255,255,0.12)"
            : "rgba(255,255,255,0.07)",
          border: `1px solid ${
            searchFocused
              ? "rgba(212,175,55,0.4)"
              : "rgba(255,255,255,0.1)"
          }`,
        }}
      >
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          type="text"
          placeholder="寻找那个毛孩子..."
          className="w-full bg-transparent text-sm tracking-wide text-foreground placeholder:text-muted-foreground focus:outline-none"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      <div className="flex items-center gap-2">
        <AuthButton />
        <UserMenu />
      </div>
    </header>
  );
}
