"use client";

// ── Admin Dashboard ────────────────────────────────────────
// TODO: Protect with real middleware:
//   export { default } from "next-auth/middleware"
//   export const config = { matcher: ["/admin/:path*"] }
//   Check session.user.role === "admin"

import { useUser }  from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion }   from "framer-motion";
import Link from "next/link";
import { MOCK_ADMIN_ANALYTICS } from "@/data/mockAnalytics";
import StatCard from "@/components/StatCard";
import { Users, BookOpen, BarChart2, Upload, Shield } from "lucide-react";

export default function AdminPage() {
  const { isAdmin } = useUser();
  const router = useRouter();

  // Guard route
  useEffect(() => {
    if (!isAdmin) router.replace("/");
  }, [isAdmin, router]);

  if (!isAdmin) return null;

  const data = MOCK_ADMIN_ANALYTICS;

  const adminLinks = [
    { href: "/admin/users",   label: "Manage Users",   icon: Users,    desc: `${data.totalUsers} total users` },
    { href: "/admin/courses", label: "Manage Courses", icon: BookOpen, desc: "4 courses, 80 questions" },
    { href: "/analytics",     label: "Analytics",      icon: BarChart2,desc: "Full platform stats" },
    { href: "/upload",        label: "Upload Questions",icon: Upload,   desc: "AI question extraction" },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex items-center gap-3">
          <Shield className="text-accent" size={28} />
          <div>
            <h1 className="font-display text-4xl font-black text-ink">ADMIN PANEL</h1>
            <p className="text-sm text-ink-muted">Full platform management</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Users"   value={data.totalUsers}    icon={<Users size={18}/>}    color="#6366f1" index={0} />
          <StatCard label="Active Today"  value={data.activeToday}   icon="🟢"                    color="#10b981" index={1} />
          <StatCard label="Total Quizzes" value={data.totalQuizzes}  icon={<BookOpen size={18}/>} color="#f59e0b" index={2} />
          <StatCard label="Platform Avg"  value={`${data.avgScore}%`} icon={<BarChart2 size={18}/>} color="#e8ff47" index={3} />
        </div>

        {/* Admin navigation cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {adminLinks.map(({ href, label, icon: Icon, desc }, i) => (
            <motion.div key={href}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}>
              <Link href={href}
                    className="flex items-center gap-4 rounded-2xl border border-white/8
                               bg-surface-2 p-6 transition-all hover:border-accent/30
                               hover:-translate-y-1 hover:shadow-lg
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center
                                rounded-xl bg-accent/10 border border-accent/20">
                  <Icon size={22} className="text-accent" />
                </div>
                <div>
                  <p className="font-bold text-ink">{label}</p>
                  <p className="text-sm text-ink-muted">{desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}