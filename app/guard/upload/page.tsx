"use client";

import { StarryBackground } from "@/components/starry-background";
import { ChevronLeft, ChevronRight, PawPrint, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type StyleKey = "forest" | "sketch" | "cosmic";

const STYLE_CHOICES: Array<{
  key: StyleKey;
  label: string;
  hint: string;
  chipBg: string;
  afterFilter: string;
  afterOverlay?: string;
}> = [
  {
    key: "forest",
    label: "治愈森林",
    hint: "新海诚感",
    chipBg: "rgba(168,216,234,0.18)",
    afterFilter:
      "saturate(1.2) contrast(1.06) brightness(1.05) hue-rotate(-8deg)",
    afterOverlay:
      "radial-gradient(circle at 30% 20%, rgba(168,216,234,0.25), transparent 55%), radial-gradient(circle at 70% 70%, rgba(212,175,55,0.15), transparent 55%)",
  },
  {
    key: "sketch",
    label: "温暖简笔",
    hint: "手绘感",
    chipBg: "rgba(244,180,198,0.18)",
    afterFilter:
      "grayscale(0.15) contrast(1.18) brightness(1.06) saturate(0.85)",
    afterOverlay:
      "linear-gradient(135deg, rgba(244,180,198,0.18), rgba(255,255,255,0.02))",
  },
  {
    key: "cosmic",
    label: "星际守护",
    hint: "梦幻感",
    chipBg: "rgba(212,175,55,0.18)",
    afterFilter:
      "saturate(1.25) contrast(1.1) brightness(1.03) hue-rotate(18deg)",
    afterOverlay:
      "radial-gradient(circle at 40% 30%, rgba(212,175,55,0.20), transparent 60%), radial-gradient(circle at 70% 65%, rgba(168,216,234,0.18), transparent 60%)",
  },
];

const CAROUSEL_SLIDES: Array<{
  style: StyleKey;
  beforeSrc: string;
  title: string;
  subtitle: string;
}> = [
  {
    style: "forest",
    beforeSrc: "/images/pet-1.jpg",
    title: "治愈森林",
    subtitle: "新海诚感",
  },
  {
    style: "sketch",
    beforeSrc: "/images/pet-3.jpg",
    title: "温暖简笔",
    subtitle: "手绘感",
  },
  {
    style: "cosmic",
    beforeSrc: "/images/pet-5.jpg",
    title: "星际守护",
    subtitle: "梦幻感",
  },
];

function objectUrlFromFile(file: File) {
  return URL.createObjectURL(file);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function BeforeAfterCard({
  src,
  styleKey,
  title,
  subtitle,
}: {
  src: string;
  styleKey: StyleKey;
  title: string;
  subtitle: string;
}) {
  const style = STYLE_CHOICES.find((s) => s.key === styleKey)!;
  const [pos, setPos] = useState(55); // 0..100

  return (
    <div
      className="relative overflow-hidden rounded-3xl"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 24px 70px rgba(0,0,0,0.35)",
      }}
    >
      <div className="px-5 pt-5 pb-3">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="mt-1 text-xs text-foreground/60">{subtitle}</div>
      </div>

      <div className="px-5 pb-5">
        <div
          className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl"
          style={{ background: "rgba(0,0,0,0.15)" }}
        >
          {/* Before */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-label="Before"
          />

          {/* After (revealed on the left side up to pos) */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: style.afterFilter,
              clipPath: `inset(0 ${100 - pos}% 0 0)`,
            }}
            aria-label="After"
          />
          {style.afterOverlay && (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: style.afterOverlay,
                mixBlendMode: "screen",
                opacity: 0.65,
                clipPath: `inset(0 ${100 - pos}% 0 0)`,
              }}
            />
          )}

          {/* Handle */}
          <div
            className="absolute top-0 bottom-0"
            style={{
              left: `${pos}%`,
              width: 0,
              borderLeft: "2px solid rgba(255,255,255,0.55)",
              transform: "translateX(-1px)",
            }}
          />
          <div
            className="absolute top-1/2 flex h-9 w-9 items-center justify-center rounded-full"
            style={{
              left: `${pos}%`,
              transform: "translate(-50%, -50%)",
              background: "rgba(26, 27, 75, 0.75)",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
            }}
          >
            <div
              className="h-4 w-4 rounded-sm"
              style={{ background: "rgba(212,175,55,0.55)" }}
            />
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            className="absolute inset-x-3 bottom-3 w-[calc(100%-24px)]"
            aria-label="Before/After slider"
          />
        </div>
      </div>
    </div>
  );
}

function StyleCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % CAROUSEL_SLIDES.length);
    }, 6500);
    return () => clearInterval(t);
  }, []);

  const slide = CAROUSEL_SLIDES[index]!;

  return (
    <div className="w-full">
      <BeforeAfterCard
        src={slide.beforeSrc}
        styleKey={slide.style}
        title={slide.title}
        subtitle={`风格示例 · ${slide.subtitle}`}
      />

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-2 rounded-full px-3 py-2 text-xs text-foreground/80 hover:bg-white/10"
          onClick={() =>
            setIndex(
              (i) =>
                (i - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length
            )
          }
          aria-label="Previous"
        >
          <ChevronLeft className="h-4 w-4" />
          上一个
        </button>

        <div className="flex items-center gap-2">
          {CAROUSEL_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              className="h-2 w-2 rounded-full"
              style={{
                background:
                  i === index
                    ? "rgba(212,175,55,0.85)"
                    : "rgba(255,255,255,0.22)",
              }}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-full px-3 py-2 text-xs text-foreground/80 hover:bg-white/10"
          onClick={() => setIndex((i) => (i + 1) % CAROUSEL_SLIDES.length)}
          aria-label="Next"
        >
          下一个
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function GuardUploadPage() {
  const router = useRouter();

  const fileRef = useRef<HTMLInputElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [style, setStyle] = useState<StyleKey>("forest"); // default: 新海诚风格
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<string[]>([]);

  // Keep: adjust uploaded image position (drag) + zoom.
  const [bgPos, setBgPos] = useState({ x: 50, y: 50 }); // percentage
  const [zoom, setZoom] = useState(1); // 1..2
  const dragRef = useRef<{
    active: boolean;
    pointerId: number | null;
    startX: number;
    startY: number;
    startPosX: number;
    startPosY: number;
  }>({
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    startPosX: 50,
    startPosY: 50,
  });
  const didDragRef = useRef(false);

  const previewUrl = useMemo(() => (file ? objectUrlFromFile(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function openPicker() {
    fileRef.current?.click();
  }

  function buildPrompt(k: StyleKey) {
    if (k === "forest") {
      return "根据图片中的宠物形象，生成对应的二次元形象，风格为新海诚风格";
    }
    if (k === "sketch") {
      return "根据图片中的宠物形象，生成对应的二次元形象，风格为温暖简笔手绘感";
    }
    return "根据图片中的宠物形象，生成对应的二次元形象，风格为星际守护梦幻感";
  }

  async function fileToDataUrlResized(input: File, maxSide = 1024) {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Failed to load image"));
      el.src = URL.createObjectURL(input);
    });

    try {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      const scale = Math.min(1, maxSide / Math.max(w, h));
      const outW = Math.max(1, Math.round(w * scale));
      const outH = Math.max(1, Math.round(h * scale));
      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.drawImage(img, 0, 0, outW, outH);
      return canvas.toDataURL("image/jpeg", 0.9);
    } finally {
      try {
        URL.revokeObjectURL(img.src);
      } catch {
        // ignore
      }
    }
  }

  async function onGenerate() {
    if (!file || generating) return;
    setGenerating(true);
    setError(null);
    setOutputs([]);

    try {
      const prompt = buildPrompt(style);
      const imageDataUrl = await fileToDataUrlResized(file, 1024);

      const res = await fetch("/api/guard/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, imageDataUrl }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          typeof data?.message === "string"
            ? data.message
            : typeof data?.error === "string"
              ? data.error
              : `Request failed (${res.status})`
        );
      }

      const images = Array.isArray(data?.images) ? (data.images as string[]) : [];
      if (images.length === 0) {
        const content = (data as any)?.message?.content;
        const textHint =
          typeof content === "string"
            ? content
            : Array.isArray(content)
              ? content
                  .filter((p: any) => p?.type === "text" && typeof p?.text === "string")
                  .map((p: any) => p.text)
                  .join("\n")
              : "";
        const hint = typeof textHint === "string" ? textHint.trim() : "";
        throw new Error(
          hint
            ? `API 未返回图片（images 为空）。模型返回：${hint.slice(0, 200)}`
            : "API 未返回图片（images 为空）"
        );
      }

      setOutputs(images);
    } catch (e: any) {
      setError(typeof e?.message === "string" ? e.message : "生成失败");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <main
      className="relative flex min-h-dvh flex-col overflow-hidden px-6 py-10"
      style={{
        background:
          "linear-gradient(160deg, #1A1B4B 0%, #2A2658 40%, #352F64 100%)",
      }}
    >
      <StarryBackground />

      <button
        type="button"
        onClick={() => router.push("/")}
        className="absolute left-4 top-4 z-10 rounded-full px-3 py-2 text-xs text-foreground/80 hover:bg-white/10"
        aria-label="返回首页"
      >
        返回
      </button>

      {/* Center title */}
      <div className="relative z-10 mx-auto mb-10 flex max-w-5xl flex-col items-center text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon.svg" alt="Star Pet" className="h-10 w-10" />
        <div className="mt-3 text-3xl font-extrabold tracking-wide text-foreground">
          Star Pet
        </div>
        <div className="mt-2 text-sm font-semibold tracking-wide text-foreground/70">
          Remember Your Pet
        </div>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left: carousel */}
        <section className="order-2 lg:order-1">
          <StyleCarousel />
        </section>

        {/* Right: upload + style selection */}
        <section className="order-1 lg:order-2">
          <div
            className="overflow-hidden rounded-3xl backdrop-blur-md"
            style={{
              background: "rgba(26, 27, 75, 0.75)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 24px 70px rgba(0,0,0,0.35)",
            }}
          >
            <div className="px-5 pt-5 pb-3">
              <div className="text-sm font-semibold text-foreground">
                Upload image
              </div>
              <div className="mt-1 text-xs text-foreground/60">
                仅上传一张，拖动可调整展示位置
              </div>
            </div>

            <div className="px-5 pb-5">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  if (!f) return;
                  setFile(f);
                  setBgPos({ x: 50, y: 50 });
                  setZoom(1);
                  setOutputs([]);
                  setError(null);
                }}
              />

              <div
                className="rounded-2xl p-3"
                style={{
                  border: "1px dashed rgba(255,255,255,0.22)",
                  background: "rgba(255,255,255,0.04)",
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const f = e.dataTransfer.files?.[0];
                  if (!f) return;
                  if (!f.type.startsWith("image/")) return;
                  setFile(f);
                  setBgPos({ x: 50, y: 50 });
                  setZoom(1);
                  setOutputs([]);
                  setError(null);
                }}
              >
                <button
                  type="button"
                  className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl"
                  style={{
                    height: 240,
                    background: "rgba(0,0,0,0.15)",
                  }}
                  onClick={() => {
                    if (didDragRef.current) {
                      didDragRef.current = false;
                      return;
                    }
                    openPicker();
                  }}
                  aria-label="Upload image"
                >
                  {previewUrl ? (
                    <div
                      ref={previewRef}
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `url(${previewUrl})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
                        backgroundSize: `${zoom * 100}%`,
                      }}
                      onPointerDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const rect = previewRef.current?.getBoundingClientRect();
                        if (!rect) return;
                        dragRef.current = {
                          active: true,
                          pointerId: e.pointerId,
                          startX: e.clientX,
                          startY: e.clientY,
                          startPosX: bgPos.x,
                          startPosY: bgPos.y,
                        };
                        didDragRef.current = false;
                        (e.currentTarget as HTMLDivElement).setPointerCapture(
                          e.pointerId
                        );
                      }}
                      onPointerMove={(e) => {
                        if (!dragRef.current.active) return;
                        if (dragRef.current.pointerId !== e.pointerId) return;
                        const rect = previewRef.current?.getBoundingClientRect();
                        if (!rect) return;
                        const dx = e.clientX - dragRef.current.startX;
                        const dy = e.clientY - dragRef.current.startY;
                        if (Math.abs(dx) + Math.abs(dy) > 4) didDragRef.current = true;
                        const nextX =
                          dragRef.current.startPosX + (dx / rect.width) * 100;
                        const nextY =
                          dragRef.current.startPosY + (dy / rect.height) * 100;
                        setBgPos({ x: clamp(nextX, 0, 100), y: clamp(nextY, 0, 100) });
                      }}
                      onPointerUp={(e) => {
                        if (dragRef.current.pointerId !== e.pointerId) return;
                        dragRef.current.active = false;
                        dragRef.current.pointerId = null;
                        try {
                          (e.currentTarget as HTMLDivElement).releasePointerCapture(
                            e.pointerId
                          );
                        } catch {
                          // ignore
                        }
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-foreground/70">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.10)",
                        }}
                      >
                        <Upload className="h-6 w-6 opacity-80" />
                      </div>
                      <div className="text-sm font-semibold text-foreground">
                        Upload image
                      </div>
                      <div className="text-xs text-foreground/60">
                        点击或拖拽上传
                      </div>
                    </div>
                  )}

                  {previewUrl && (
                    <div
                      className="absolute left-3 bottom-3 rounded-full px-3 py-1 text-xs text-foreground/85"
                      style={{
                        background: "rgba(26, 27, 75, 0.65)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      拖动调整 · 点击可重选
                    </div>
                  )}
                </button>

                {/* Controls */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs text-foreground/70">
                    <PawPrint className="h-4 w-4 opacity-70" />
                    缩放
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={2}
                    step={0.01}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full"
                    aria-label="Zoom"
                    disabled={!previewUrl}
                  />
                  <button
                    type="button"
                    className="shrink-0 rounded-xl px-3 py-1 text-xs text-foreground/80 hover:bg-white/10 disabled:opacity-50"
                    onClick={() => {
                      setBgPos({ x: 50, y: 50 });
                      setZoom(1);
                    }}
                    disabled={!previewUrl}
                  >
                    重置
                  </button>
                </div>
              </div>
            </div>

            <div className="h-px" style={{ background: "rgba(255,255,255,0.10)" }} />

            <div className="px-5 pt-5 pb-6">
              <div className="text-sm font-semibold text-foreground">Style</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {STYLE_CHOICES.map((s) => {
                  const active = s.key === style;
                  return (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setStyle(s.key)}
                      className="rounded-full px-4 py-2 text-sm transition-colors"
                      style={{
                        background: active ? "rgba(212,175,55,0.22)" : s.chipBg,
                        border: active
                          ? "1px solid rgba(212,175,55,0.35)"
                          : "1px solid rgba(255,255,255,0.10)",
                        color: "rgba(255,255,255,0.92)",
                      }}
                      aria-pressed={active}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 text-xs text-foreground/60">
                默认新海诚风格（治愈森林）。当前：
                {STYLE_CHOICES.find((s) => s.key === style)?.label ?? ""}
              </div>

              <div className="mt-2 text-xs text-foreground/50">
                提示词：{buildPrompt(style)}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom CTA (match homepage + button vibe) */}
      <div className="relative z-10 mx-auto mt-10 flex w-full max-w-5xl justify-center pb-10">
        <button
          type="button"
          disabled={!file || generating}
          onClick={onGenerate}
          className={`group relative flex h-14 w-full max-w-md items-center justify-center rounded-full px-6 text-sm font-semibold transition-all duration-300 ${
            generating ? "scale-95" : "hover:scale-[1.02]"
          } disabled:cursor-not-allowed disabled:opacity-60`}
          style={{
            background: "linear-gradient(135deg, #D4AF37, #F4B4C6, #A8D8EA)",
            animation: "neonPulse 3s ease-in-out infinite",
            color: "#1A1B4B",
          }}
          aria-label="开启时光之旅"
        >
          {generating ? "正在生成…" : "开启时光之旅"}
          <div
            className="absolute inset-1 rounded-full"
            style={{ border: "1.5px solid rgba(26,27,75,0.15)" }}
          />
        </button>
      </div>

      {/* Output Gallery */}
      <div className="relative z-10 mx-auto w-full max-w-5xl pb-16">
        <div
          className="overflow-hidden rounded-3xl backdrop-blur-md"
          style={{
            background: "rgba(26, 27, 75, 0.55)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 24px 70px rgba(0,0,0,0.35)",
          }}
        >
          <div className="px-5 pt-5 pb-3">
            <div className="text-sm font-semibold text-foreground">
              Output Gallery
            </div>
            <div className="mt-1 text-xs text-foreground/60">
              生成结果将显示在这里
            </div>
          </div>

          {error && (
            <div className="px-5 pb-4 text-sm" style={{ color: "#F4B4C6" }}>
              {error}
            </div>
          )}

          {outputs.length === 0 ? (
            <div className="px-5 pb-6 text-sm text-foreground/60">
              {generating
                ? "正在把照片交给时空传送…"
                : "上传图片并点击“开启时光之旅”开始生成。"}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 px-5 pb-6 md:grid-cols-2">
              {outputs.map((src, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Output ${i + 1}`}
                    className="h-auto w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs text-foreground/70">
                    <span>结果 {i + 1}</span>
                    <a
                      className="rounded-full px-3 py-1 text-xs text-foreground/85 hover:bg-white/10"
                      href={src}
                      download
                    >
                      下载
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
