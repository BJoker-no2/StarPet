import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ensureHttpsProxyAgent } from "@/lib/server-proxy";

export const runtime = "nodejs";

function extractImages(message: any): string[] {
  const images: string[] = [];

  const content = message?.content;
  if (Array.isArray(content)) {
    for (const part of content) {
      if (part?.type === "image_url" && part?.image_url?.url) {
        images.push(String(part.image_url.url));
      }
    }
  } else if (typeof content === "string") {
    const matches =
      content.match(
        /(data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+|https?:\/\/\S+)/g
      ) ?? [];
    for (const m of matches) images.push(m);
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
    });

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

