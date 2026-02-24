// ============================================================
// Stub AI extraction endpoint.
// Replace the mock return with a real Gemini / OpenAI call.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { ExtractResponse } from "@/types";

export async function POST(req: NextRequest) {
  // Read the payload (available for real implementation)
  const body = await req.json().catch(() => ({}));
  console.log("[/api/extract] received payload:", body);

  // ── STUB — return mock questions ─────────────────────────
  // TODO: replace this block with:
  //   const aiResult = await callGemini(body.text ?? body.fileName);
  //   return NextResponse.json(aiResult);

  const mock: ExtractResponse = {
    questions: [
      {
        question: "What is the speed of light in a vacuum?",
        options: [
          "≈ 3 × 10⁸ m/s",
          "≈ 3 × 10⁶ m/s",
          "≈ 3 × 10¹⁰ m/s",
          "≈ 3 × 10⁴ m/s",
        ],
        correctIndex: 0,
        explanation: "The speed of light c ≈ 299,792,458 m/s.",
      },
      {
        question: "Who proposed the theory of general relativity?",
        options: ["Albert Einstein", "Isaac Newton", "Niels Bohr", "Max Planck"],
        correctIndex: 0,
        explanation: "Einstein published the general theory of relativity in 1915.",
      },
      {
        question: "What is Planck's constant (approximate)?",
        options: ["6.626 × 10⁻³⁴ J·s", "6.626 × 10⁻²⁴ J·s", "9.109 × 10⁻³¹ J·s", "1.602 × 10⁻¹⁹ J·s"],
        correctIndex: 0,
      },
    ],
  };

  // Simulate a short network delay
  await new Promise((r) => setTimeout(r, 900));

  return NextResponse.json(mock);
}