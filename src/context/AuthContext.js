"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const MOCK_USERS = {
  Visitor: null,
  Supporter: {
    name: "John Supporter",
    email: "supporter@demo.com",
    photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120",
    role: "Supporter",
    credits: 50,
  },
  Creator: {
    name: "Jane Creator",
    email: "creator@demo.com",
    photoURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    role: "Creator",
    credits: 20,
  },
  Admin: {
    name: "Alex Admin",
    email: "admin@demo.com",
    photoURL: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120",
    role: "Admin",
    credits: 0,
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedRole = localStorage.getItem("mock_role") || "Visitor";
    setUser(MOCK_USERS[savedRole] || null);
    setLoading(false);
  }, []);

  const login = (role) => {
    if (role in MOCK_USERS) {
      setUser(MOCK_USERS[role]);
      localStorage.setItem("mock_role", role);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.setItem("mock_role", "Visitor");
  };

  const currentRole = user ? user.role : "Visitor";

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        currentRole,
        mockUsers: MOCK_USERS,
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
