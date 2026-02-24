import { ExtractResponse } from "@/types";

/**
 * Calls /api/extract with raw text or a filename hint.
 * Swap the mock response for a real Gemini / OpenAI call in the route handler.
 */
export async function extractQuestions(
  payload: { text?: string; fileName?: string }
): Promise<ExtractResponse> {
  const res = await fetch("/api/extract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? "Extraction failed");
  }
  return res.json() as Promise<ExtractResponse>;
}