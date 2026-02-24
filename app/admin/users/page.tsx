"use client";

// TODO: Load from GET /api/admin/users (paginated)
// TODO: DELETE /api/admin/users/:id to remove a user
// TODO: PATCH /api/admin/users/:id { role } to promote/demote

import { useState } from "react";
import { motion } from "framer-motion";
import { useUser }   from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MOCK_ALL_USERS } from "@/data/mockUsers";
import { User } from "@/types";
import UserAvatar from "@/components/UserAvatar";
import { Trash2, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

export default function AdminUsersPage() {
  const { isAdmin } = useUser();
  const router = useRouter();
  const [users,  setUsers]  = useState<User[]>(MOCK_ALL_USERS);
  const [search, setSearch] = useState("");

  useEffect(() => { if (!isAdmin) router.replace("/"); }, [isAdmin, router]);
  if (!isAdmin) return null;

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const removeUser = (id: string) => {
    // TODO: DELETE /api/admin/users/:id
    setUsers((u) => u.filter((x) => x.id !== id));
  };

  const toggleRole = (id: string) => {
    // TODO: PATCH /api/admin/users/:id { role }
    setUsers((u) => u.map((x) =>
      x.id === id ? { ...x, role: x.role === "admin" ? "student" : "admin" } : x
    ));
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin" className="text-ink-muted hover:text-ink transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="font-display text-3xl font-black text-ink">MANAGE USERS</h1>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
               placeholder="Search by name or email…"
               className="w-full rounded-xl border border-white/10 bg-surface-2 pl-10 pr-4 py-2.5
                          text-sm text-ink placeholder:text-ink-faint
                          focus:border-accent/50 focus:outline-none" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/8 bg-surface-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 text-xs uppercase tracking-widest text-ink-muted">
              <th className="px-5 py-3 text-left">User</th>
              <th className="px-5 py-3 text-left hidden sm:table-cell">Quizzes</th>
              <th className="px-5 py-3 text-left hidden md:table-cell">Avg Score</th>
              <th className="px-5 py-3 text-left">Role</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((u, i) => (
              <motion.tr key={u.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-surface-3 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <UserAvatar avatar={u.avatar} name={u.name} size="sm" />
                    <div>
                      <p className="font-medium text-ink">{u.name}</p>
                      <p className="text-xs text-ink-muted hidden sm:block">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-ink-muted hidden sm:table-cell">
                  {u.stats.totalQuizzesTaken}
                </td>
                <td className="px-5 py-3 hidden md:table-cell">
                  <span className={u.stats.averageScore >= 70 ? "text-emerald-400" : "text-amber-400"}>
                    {u.stats.averageScore}%
                  </span>
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => toggleRole(u.id)}
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors
                                      ${u.role === "admin"
                                        ? "bg-accent/20 text-accent hover:bg-accent/30"
                                        : "bg-surface-3 text-ink-muted hover:bg-surface-4"}`}>
                    {u.role}
                  </button>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => removeUser(u.id)}
                          aria-label={`Remove ${u.name}`}
                          className="rounded-lg p-1.5 text-ink-faint hover:bg-red-500/15 hover:text-red-400 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-ink-muted">No users found.</p>
        )}
      </div>
    </section>
  );
}