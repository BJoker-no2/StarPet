"use client";

import { useEffect, useId, useRef, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { ChevronDown, LogIn, LogOut, User } from "lucide-react";

function useOnClickOutside(
  refs: Array<React.RefObject<HTMLElement | null>>,
  onOutside: () => void
) {
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      const inside = refs.some((r) => (r.current ? r.current.contains(target) : false));
      if (!inside) onOutside();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [refs, onOutside]);
}

function fallbackInitials(nameOrEmail?: string | null) {
  const s = (nameOrEmail ?? "").trim();
  if (!s) return "?";
  const parts = s.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || s[0]!.toUpperCase();
}

export function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const labelId = useId();

  useOnClickOutside([buttonRef, panelRef], () => setOpen(false));

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const authed = status === "authenticated";
  const user = session?.user;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        className="flex items-center justify-center gap-1 rounded-full p-2.5 transition-all duration-200 hover:scale-105"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={labelId}
        onClick={() => setOpen((v) => !v)}
      >
        <User className="h-5 w-5 text-foreground" />
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {open && (
        <div
          ref={panelRef}
          id={labelId}
          role="menu"
          className="absolute right-0 z-[60] mt-2 w-[280px] overflow-hidden rounded-2xl backdrop-blur-md"
          style={{
            background: "rgba(26, 27, 75, 0.85)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          }}
        >
          <div className="flex items-center gap-3 px-4 py-4">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user?.name ?? "User"}
                className="h-10 w-10 rounded-full"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold"
                style={{
                  background: "rgba(212,175,55,0.18)",
                  border: "1px solid rgba(212,175,55,0.25)",
                  color: "rgba(255,255,255,0.92)",
                }}
              >
                {fallbackInitials(user?.name ?? user?.email)}
              </div>
            )}

            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-foreground">
                {status === "loading"
                  ? "Loading..."
                  : user?.name || user?.email || "未登录"}
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {authed ? user?.email : "请先使用 Google 登录"}
              </div>
            </div>
          </div>

          <div
            className="h-px"
            style={{ background: "rgba(255,255,255,0.10)" }}
          />

          <div className="p-2">
            {authed ? (
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-white/10"
                onClick={async () => {
                  setOpen(false);
                  await signOut({ callbackUrl: "/" });
                }}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            ) : (
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-white/10"
                onClick={async () => {
                  setOpen(false);
                  await signIn("google", { callbackUrl: "/" }, { prompt: "consent select_account" });
                }}
              >
                <LogIn className="h-4 w-4" />
                Login with Google
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

