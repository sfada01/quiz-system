"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, Trash2, Save } from "lucide-react";

import UploadZone      from "@/components/UploadZone";
import { extractQuestions } from "@/services/extractService";
import { ExtractedQuestion } from "@/types";
import { COURSES } from "@/data/course";

export default function UploadPage() {
  // ── Input state ──────────────────────────────────────────
  const [file,     setFile]    = useState<File | null>(null);
  const [rawText,  setRawText] = useState("");
  const [loading,  setLoading] = useState(false);
  const [error,    setError]   = useState<string | null>(null);

  // ── Extracted questions (editable) ──────────────────────
  const [questions, setQuestions] = useState<ExtractedQuestion[]>([]);

  // ── Assignment ───────────────────────────────────────────
  const [targetCourse, setTargetCourse] = useState("");
  const [newCourseName, setNewCourseName] = useState("");
  const [saved, setSaved] = useState(false);

  /* ── Handlers ──────────────────────────────────────────── */
  const handleExtract = async () => {
    if (!file && !rawText.trim()) {
      setError("Please upload a file or paste text first.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await extractQuestions({
        fileName: file?.name,
        text: rawText || undefined,
      });
      setQuestions(result.questions);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = useCallback(
    (i: number, field: keyof ExtractedQuestion, value: string | number) => {
      setQuestions((prev) => {
        const updated = [...prev];
        // @ ts expect error dynamic field assignment
        updated[i] = { ...updated[i], [field]: value };
        return updated;
      });
    },
    []
  );

  const removeQuestion = (i: number) =>
    setQuestions((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = () => {
    // In production: persist to DB / state store / local storage
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-black text-ink sm:text-5xl">
          ADD <span className="text-accent">QUESTIONS</span>
        </h1>
        <p className="mt-2 text-ink-muted">
          Upload a file or paste text — then let AI extract the Q&As.
        </p>
      </div>

      {/* ── Step 1: Input ── */}
      <div className="mb-6 rounded-2xl border border-white/8 bg-surface-2 p-6">
        <h2 className="mb-4 font-display text-lg font-bold text-ink">1 — Choose Input</h2>

        {/* Tabs */}
        <div className="mb-5 flex gap-2 text-sm font-medium">
          {["file", "text"].map((mode) => (
            <button
              key={mode}
              onClick={() => { setFile(null); setRawText(""); }}
              className="rounded-lg border border-white/10 px-4 py-2 text-ink-muted
                         hover:border-accent/40 hover:text-accent transition-colors
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {mode === "file" ? "📄 File Upload" : "✏️ Paste Text"}
            </button>
          ))}
        </div>

        <UploadZone onFile={setFile} />

        <div className="my-4 flex items-center gap-3 text-xs text-ink-faint">
          <div className="h-px flex-1 bg-white/8" />
          OR
          <div className="h-px flex-1 bg-white/8" />
        </div>

        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste text from a textbook, PDF copy, or notes…"
          rows={6}
          aria-label="Paste raw text"
          className="w-full resize-none rounded-xl border border-white/10 bg-surface-3
                     px-4 py-3 text-sm text-ink placeholder:text-ink-faint
                     focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      {/* ── Extract button ── */}
      <button
        onClick={handleExtract}
        disabled={loading}
        aria-busy={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent
                   py-4 font-bold text-surface-0 shadow-lg transition-all
                   hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <Sparkles size={18} />
        {loading ? "Extracting…" : "Extract with AI"}
      </button>

      {error && (
        <p className="mt-3 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      {/* ── Step 2: Preview & Edit ── */}
      <AnimatePresence>
        {questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-ink">
                2 — Review Extracted Questions ({questions.length})
              </h2>
            </div>

            <div className="space-y-4">
              {questions.map((q, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-white/8 bg-surface-2 p-5"
                >
                  <div className="mb-3 flex items-start gap-3">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center
                                     rounded-md bg-surface-3 text-xs font-bold text-ink-muted">
                      {i + 1}
                    </span>
                    <input
                      value={q.question}
                      onChange={(e) => updateQuestion(i, "question", e.target.value)}
                      aria-label={`Question ${i + 1} text`}
                      className="flex-1 rounded-lg border border-white/10 bg-surface-3 px-3 py-2
                                 text-sm text-ink focus:border-accent/50 focus:outline-none"
                    />
                    <button
                      onClick={() => removeQuestion(i)}
                      aria-label={`Remove question ${i + 1}`}
                      className="shrink-0 rounded-lg p-1.5 text-ink-muted
                                 hover:bg-red-500/15 hover:text-red-400"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pl-9">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${i}`}
                          checked={q.correctIndex === oi}
                          onChange={() => updateQuestion(i, "correctIndex", oi)}
                          aria-label={`Mark option ${oi + 1} as correct`}
                          className="accent-accent"
                        />
                        <input
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...q.options];
                            newOpts[oi] = e.target.value;
                            setQuestions((prev) => {
                              const updated = [...prev];
                              updated[i] = { ...updated[i], options: newOpts };
                              return updated;
                            });
                          }}
                          aria-label={`Option ${oi + 1}`}
                          className="flex-1 rounded-lg border border-white/10 bg-surface-3
                                     px-2 py-1 text-xs text-ink focus:border-accent/50 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ── Step 3: Assign & Save ── */}
            <div className="mt-8 rounded-2xl border border-white/8 bg-surface-2 p-6">
              <h2 className="mb-4 font-display text-lg font-bold text-ink">
                3 — Assign to Course
              </h2>

              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  value={targetCourse}
                  onChange={(e) => setTargetCourse(e.target.value)}
                  aria-label="Select existing course"
                  className="flex-1 rounded-xl border border-white/10 bg-surface-3 px-4 py-2.5
                             text-sm text-ink focus:border-accent/50 focus:outline-none"
                >
                  <option value="">— Existing course —</option>
                  {COURSES.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                <span className="flex items-center justify-center text-xs text-ink-faint">OR</span>

                <input
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  placeholder="New course name…"
                  aria-label="Create new course"
                  className="flex-1 rounded-xl border border-white/10 bg-surface-3 px-4 py-2.5
                             text-sm text-ink placeholder:text-ink-faint
                             focus:border-accent/50 focus:outline-none"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={!targetCourse && !newCourseName.trim()}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl
                           border border-accent/40 bg-accent/10 py-3 font-semibold text-accent
                           transition-colors hover:bg-accent/20 disabled:opacity-40
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Save size={16} />
                {saved ? "Saved! ✓" : "Save Questions"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}