
"use client";

// ── UserContext ────────────────────────────────────────────
// Manages the logged-in user, role switching, and profile updates.
//
// TODO: Replace mock data with real auth:
//   - NextAuth.js: useSession() from "next-auth/react"
//   - Supabase:    supabase.auth.getUser()
//   - Firebase:    onAuthStateChanged()

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { User, UserRole } from "@/types";
import { MOCK_CURRENT_USER, MOCK_ADMIN_USER } from "@/data/mockUsers";

interface UserContextValue {
  user: User | null;
  isAdmin: boolean;
  isLoggedIn: boolean;
  login:  (role?: UserRole) => void;  // mock login
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  switchRole: () => void; // dev helper to toggle admin/student
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  // TODO: Initialize from real auth session instead of mock
  const [user, setUser] = useState<User | null>(MOCK_CURRENT_USER);

  const isAdmin   = user?.role === "admin";
  const isLoggedIn = !!user;

  const login = useCallback((role: UserRole = "student") => {
    // TODO: Replace with real login flow (OAuth, email/password, etc.)
    setUser(role === "admin" ? MOCK_ADMIN_USER : MOCK_CURRENT_USER);
  }, []);

  const logout = useCallback(() => {
    // TODO: Call signOut() from your auth provider
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    // TODO: PATCH /api/users/:id with updates, then refresh session
    setUser((prev) => prev ? { ...prev, ...updates } : prev);
  }, []);

  const switchRole = useCallback(() => {
    // Dev helper — remove in production
    setUser((prev) =>
      prev?.role === "admin" ? MOCK_CURRENT_USER : MOCK_ADMIN_USER
    );
  }, []);

  return (
    <UserContext.Provider value={{ user, isAdmin, isLoggedIn, login, logout, updateUser, switchRole }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be inside <UserProvider>");
  return ctx;
}