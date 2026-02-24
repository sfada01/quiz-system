import { COURSES } from "@/data/course";
import Link from "next/link";

export default function FlashcardsIndexPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 font-display text-4xl font-black text-ink">🃏 FLASHCARDS</h1>
      <p className="mb-8 text-ink-muted">Choose a course to study.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {COURSES.map((c) => (
          <Link key={c.id} href={`/flashcards/${c.id}`}
                className="flex items-center gap-4 rounded-2xl border border-white/8
                           bg-surface-2 p-5 transition-all hover:border-white/15 hover:-translate-y-1
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl shrink-0"
                 style={{ backgroundColor: `${c.color}22`, border: `1px solid ${c.color}44` }}>
              {c.icon}
            </div>
            <div>
              <p className="font-bold text-ink">{c.name}</p>
              <p className="text-xs text-ink-muted">{c.questions.length} cards</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}