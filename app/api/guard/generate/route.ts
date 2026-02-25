import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ensureHttpsProxyAgent } from "@/lib/server-proxy";

export const runtime = "nodejs";

function normalizeUrlCandidate(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const s = raw.trim();
  if (!s) return null;

  // Trim common trailing punctuation from markdown/JSON formatting.
  const trimmed = s.replace(/[)\],"'`>]+$/g, "");
  if (trimmed.startsWith("data:image/")) return trimmed;
  if (/^https?:\/\/\S+/i.test(trimmed)) return trimmed;
  return null;
}

function extractDataUrlsFromText(text: string): string[] {
  const out: string[] = [];

  // Handle base64 that may be wrapped with whitespace/newlines (common in markdown/code blocks).
  let idx = 0;
  while (true) {
    const start = text.indexOf("data:image/", idx);
    if (start === -1) break;

    const base64Marker = text.indexOf(";base64,", start);
    if (base64Marker === -1) {
      idx = start + 10;
      continue;
    }
    const comma = base64Marker + ";base64,".length;

    let end = comma;
    while (end < text.length) {
      const ch = text[end];
      if (/[A-Za-z0-9+/=\r\n\t ]/.test(ch)) {
        end++;
        continue;
      }
      break;
    }

    const header = text.slice(start, comma);
    const b64 = text.slice(comma, end).replace(/\s+/g, "");
    const candidate = normalizeUrlCandidate(`${header}${b64}`);
    if (candidate) out.push(candidate);
    idx = end;
  }

  return out;
}

function extractHttpUrlsFromText(text: string): string[] {
  const matches = text.match(/https?:\/\/\S+/gi) ?? [];
  const out: string[] = [];
  for (const m of matches) {
    const candidate = normalizeUrlCandidate(m);
    if (candidate) out.push(candidate);
  }
  return out;
}

function extractImages(message: any): string[] {
  const images: string[] = [];

  const push = (v: unknown) => {
    const candidate = normalizeUrlCandidate(v);
    if (!candidate) return;
    if (!images.includes(candidate)) images.push(candidate);
  };

  // Some providers may attach images directly to the message.
  if (Array.isArray(message?.images)) {
    for (const it of message.images) push(it?.url ?? it);
  }

  const content = message?.content;
  if (Array.isArray(content)) {
    for (const part of content) {
      // OpenAI-style content parts: { type: "text", text: "..." } / { type: "image_url", image_url: { url } }
      if (part?.type === "image_url") {
        push(part?.image_url?.url ?? part?.image_url ?? part?.url);
        continue;
      }

      // Provider variants seen in the wild.
      if (part?.type === "image" || part?.type === "output_image") {
        push(part?.image_url?.url ?? part?.image_url ?? part?.url);
        if (part?.image?.url) push(part.image.url);
        if (part?.image?.data && (part?.image?.media_type || part?.image?.mime_type)) {
          const mt = String(part.image.media_type ?? part.image.mime_type);
          push(`data:${mt};base64,${String(part.image.data)}`);
        }
        if (part?.source?.data && part?.source?.media_type) {
          push(`data:${String(part.source.media_type)};base64,${String(part.source.data)}`);
        }
        continue;
      }

      if (part?.type === "text" && typeof part?.text === "string") {
        for (const u of extractDataUrlsFromText(part.text)) push(u);
        for (const u of extractHttpUrlsFromText(part.text)) push(u);
      }
    }
  } else if (typeof content === "string") {
    for (const u of extractDataUrlsFromText(content)) push(u);
    for (const u of extractHttpUrlsFromText(content)) push(u);
  }

  return images;
}

export async function POST(req: Request) {
  ensureHttpsProxyAgent();

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing OPENROUTER_API_KEY" },
      { status: 500 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const prompt = String(body?.prompt ?? "").trim();
  const imageDataUrl = String(body?.imageDataUrl ?? "").trim();

  if (!prompt) {
    return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
  }
  if (!imageDataUrl.startsWith("data:image/")) {
    return NextResponse.json(
      { error: "Missing or invalid imageDataUrl" },
      { status: 400 }
    );
  }

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
    defaultHeaders: {
      ...(process.env.OPENROUTER_SITE_URL
        ? { "HTTP-Referer": process.env.OPENROUTER_SITE_URL }
        : {}),
      ...(process.env.OPENROUTER_SITE_NAME
        ? { "X-Title": process.env.OPENROUTER_SITE_NAME }
        : {}),
    },
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-image",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageDataUrl } },
          ],
        },
      ],
      // OpenRouter image-generation models require modalities to include "image".
      // See: https://openrouter.ai/docs/features/multimodal/image-generation
      modalities: ["image", "text"] as any,
      // Gemini-only knob (optional). Keep default unless you want higher res.
      // image_config: { image_size: "1K" } as any,
    } as any);

    const message: any = completion.choices?.[0]?.message ?? null;
    const images = extractImages(message);

    return NextResponse.json({
      images,
      message,
    });
  } catch (err: any) {
    // Keep response safe; do not leak keys or full upstream payloads.
    const msg = typeof err?.message === "string" ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "OpenRouter request failed", message: msg },
      { status: 502 }
    );
  }
}
