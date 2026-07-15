"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  saveAccessToken,
  getAccessToken,
  clearAccessToken,
} from "@/lib/tokenStorage";

const AuthContext = createContext();

const MOCK_USER_DETAILS = {
  Visitor: null,
  Supporter: {
    email: "supporter@demo.com",
    name: "John Supporter",
    photoURL: "",
    role: "Supporter",
  },
  Creator: {
    email: "creator@demo.com",
    name: "Jane Creator",
    photoURL: "",
    role: "Creator",
  },
  Admin: {
    email: "admin@demo.com",
    name: "Alex Admin",
    photoURL: "",
    role: "Admin",
  },
};

function applyAuthResult(data, setUser) {
  if (data?.token) {
    saveAccessToken(data.token);
  }
  if (data?.user) {
    setUser(data.user);
    return data.user;
  }
  return null;
}

function authHeaders() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from cookie and/or localStorage token
  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
        headers: {
          ...authHeaders(),
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          return data.user;
        }
      }
      clearAccessToken();
      setUser(null);
      return null;
    } catch (err) {
      console.error("Fetch session error:", err);
      setUser(null);
      return null;
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
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      return applyAuthResult(data, setUser);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Google login:
   * - Real path: pass { googleCredential } from Google Identity Services
   * - Demo path (navbar role switcher): pass email/name/role without credential
   */
  const loginGoogle = async (emailOrOptions, name, photoURL, role = "Supporter") => {
    setLoading(true);
    try {
      const isOptionsObject =
        emailOrOptions && typeof emailOrOptions === "object" && !Array.isArray(emailOrOptions);

      const body = isOptionsObject
        ? {
            isGoogle: true,
            googleCredential: emailOrOptions.googleCredential,
            email: emailOrOptions.email,
            googleName: emailOrOptions.name,
            googlePhoto: emailOrOptions.photoURL,
            googleRole: emailOrOptions.role || "Supporter",
          }
        : {
            isGoogle: true,
            email: emailOrOptions,
            googleName: name,
            googlePhoto: photoURL,
            googleRole: role,
          };

      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Google sign-in failed");
      }
      return applyAuthResult(data, setUser);
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, photoURL, password, role }) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, photoURL, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }
      return applyAuthResult(data, setUser);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      clearAccessToken();
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
      clearAccessToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfilePhoto = async (photoURL) => {
    const res = await fetch("/api/auth/profile", {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({ photoURL }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Unable to update profile picture.");
    }
    setUser(data.user);
    return data.user;
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
        updateProfilePhoto,
        loginMockRole,
        loading,
        currentRole,
        getAccessToken,
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
