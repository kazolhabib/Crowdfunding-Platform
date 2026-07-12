"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const MOCK_USER_DETAILS = {
  Visitor: null,
  Supporter: {
    email: "supporter@demo.com",
    name: "John Supporter",
    photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120",
    role: "Supporter",
  },
  Creator: {
    email: "creator@demo.com",
    name: "Jane Creator",
    photoURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    role: "Creator",
  },
  Admin: {
    email: "admin@demo.com",
    name: "Alex Admin",
    photoURL: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120",
    role: "Admin",
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch session from backend on mount
  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          return data.user;
        }
      }
      setUser(null);
      return null;
    } catch (err) {
      console.error("Fetch session error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchSession();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = async (email, name, photoURL, role = "Supporter") => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isGoogle: true,
          email,
          googleName: name,
          googlePhoto: photoURL,
          googleRole: role,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Google sign-in failed");
      }
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, photoURL, password, role }) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, photoURL, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper for navbar to dynamically switch roles for testing
  const loginMockRole = async (role) => {
    if (role === "Visitor") {
      await logout();
    } else {
      const mock = MOCK_USER_DETAILS[role];
      if (mock) {
        await loginGoogle(mock.email, mock.name, mock.photoURL, mock.role);
      }
    }
  };

  const currentRole = user ? user.role : "Visitor";

  return (
    <AuthContext.Provider
      value={{
        user,
        refreshSession: fetchSession,
        login,
        loginGoogle,
        register,
        logout,
        loginMockRole,
        loading,
        currentRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
