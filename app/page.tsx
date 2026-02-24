import { COURSES } from "@/data/course";
import CourseCard  from "@/components/CourseCard";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      {/* Hero heading */}
      <div className="mb-12 text-center">
        <h1 className="font-display text-5xl font-black leading-none tracking-tight
                       text-ink sm:text-7xl">
          CHOOSE YOUR<br />
          <span className="text-accent">CHALLENGE</span>
        </h1>
        <p className="mt-4 text-base text-ink-muted sm:text-lg">
          Select a course below and test what you know.
        </p>
      </div>

      {/* Course grid */}
      <div
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        role="list"
        aria-label="Available courses"
      >
        {COURSES.map((course, i) => (
          <CourseCard key={course.id} course={course} index={i} />
        ))}
      </div>
    </section>
  );
}