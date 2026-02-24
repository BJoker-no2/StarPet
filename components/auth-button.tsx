"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { LogIn, LogOut } from "lucide-react";

export function AuthButton() {
  const { status } = useSession();
  const [pending, setPending] = useState(false);

  const authed = status === "authenticated";
  const disabled = pending || status === "loading";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={async () => {
        setPending(true);
        try {
          if (authed) {
            await signOut({ callbackUrl: "/" });
          } else {
            await signIn(
              "google",
              { callbackUrl: "/" },
              { prompt: "consent select_account" }
            );
          }
        } finally {
          setPending(false);
        }
      }}
      className="flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
      style={{
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
      aria-label={authed ? "Logout" : "Login"}
    >
      {authed ? (
        <>
          <LogOut className="h-4 w-4 text-foreground" />
          <span className="text-foreground">Logout</span>
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4 text-foreground" />
          <span className="text-foreground">Login</span>
        </>
      )}
    </button>
  );
}

