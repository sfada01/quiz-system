// ── AI Question Generator API ──────────────────────────────
// Generates questions from a topic string.
// TODO: Wire to Gemini or OpenAI (see comments below)

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { topic, count = 5, difficulty = "medium" } = await req.json();

  if (!topic) {
    return NextResponse.json({ error: "topic is required" }, { status: 400 });
  }

  // ── Real Gemini integration ────────────────────────────
  // const { GoogleGenerativeAI } = await import("@google/generative-ai");
  // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  // const result = await model.generateContent(`
  //   Generate ${count} multiple-choice quiz questions about "${topic}"
  //   at ${difficulty} difficulty.
  //   Return ONLY a JSON array: [{ question, options: [4 strings], correctIndex, explanation }]
  // `);
  // const text = result.response.text();
  // const questions = JSON.parse(text.match(/\[[\s\S]*\]/)?.[0] ?? "[]");
  // return NextResponse.json({ questions, topic, difficulty });

  // ── Mock response ──────────────────────────────────────
  await new Promise((r) => setTimeout(r, 1200));

  return NextResponse.json({
    topic,
    difficulty,
    questions: Array.from({ length: count }, (_, i) => ({
      id: `gen_${Date.now()}_${i}`,
      question: `[AI Generated] Question ${i + 1} about "${topic}"?`,
      options: [`Answer A`, `Answer B`, `Answer C`, `Answer D`],
      correctIndex: 0,
      explanation: `This is a mock explanation for question ${i + 1}.`,
      difficulty,
    })),
  });
}