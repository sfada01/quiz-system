import { NextRequest, NextResponse } from "next/server";
import { ExtractResponse } from "@/types";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { text, fileName } = body as { text?: string; fileName?: string };

  // ── OPTION A: Real Gemini integration (uncomment when ready) ──
  // import { GoogleGenerativeAI } from "@google/generative-ai";
  // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  // const prompt = `
  //   Extract quiz questions from the following text.
  //   Return a JSON array of objects with shape:
  //   { question: string, options: string[4], correctIndex: number, explanation: string }
  //   Text: ${text}
  // `;
  // const result = await model.generateContent(prompt);
  // const raw = result.response.text();
  // const questions = JSON.parse(raw.match(/\[[\s\S]*\]/)?.[0] ?? "[]");
  // return NextResponse.json({ questions });

  // ── OPTION B: Real OpenAI integration (uncomment when ready) ──
  // import OpenAI from "openai";
  // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  // const chat = await openai.chat.completions.create({
  //   model: "gpt-4o-mini",
  //   messages: [
  //     { role: "system", content: "Extract MCQ quiz questions. Return JSON array." },
  //     { role: "user",   content: text ?? `File: ${fileName}` },
  //   ],
  //   response_format: { type: "json_object" },
  // });
  // const questions = JSON.parse(chat.choices[0].message.content ?? "{}").questions;
  // return NextResponse.json({ questions });

  // ── CURRENT: Mock response ─────────────────────────────────────
  await new Promise((r) => setTimeout(r, 1000)); // simulate latency

  const mock: ExtractResponse = {
    questions: [
      {
        question: "What is the speed of light in a vacuum?",
        options: ["≈ 3×10⁸ m/s", "≈ 3×10⁶ m/s", "≈ 3×10¹⁰ m/s", "≈ 3×10⁴ m/s"],
        correctIndex: 0,
        explanation: "c ≈ 299,792,458 m/s.",
        difficulty: "medium",
      },
      {
        question: "Who proposed general relativity?",
        options: ["Albert Einstein", "Isaac Newton", "Niels Bohr", "Max Planck"],
        correctIndex: 0,
        explanation: "Einstein published it in 1915.",
        difficulty: "easy",
      },
      {
        question: "What is Planck's constant (approx)?",
        options: ["6.626×10⁻³⁴ J·s", "6.626×10⁻²⁴ J·s", "9.109×10⁻³¹ J·s", "1.602×10⁻¹⁹ J·s"],
        correctIndex: 0,
        difficulty: "hard",
      },
    ],
  };

  return NextResponse.json(mock);
}