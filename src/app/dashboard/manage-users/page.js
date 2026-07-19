"use client";

import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, Spinner } from "@heroui/react";
import { AlertTriangle } from "lucide-react";

const ROLES = ["Admin", "Creator", "Supporter"];

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState(null);

  const load = async () => {
    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load users.");
      setUsers(data.users);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const updateRole = async (userId, role) => {
    setBusy(userId);
    setError("");
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to update role.");
      setUsers((items) =>
        items.map((user) => (user._id === userId ? data.user : user))
      );
    } catch (actionError) {
      setError(actionError.message);
    } finally {
      setBusy(null);
    }
  };

  const remove = async (userId) => {
    setBusy(userId);
    setError("");
    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to remove user.");
      setUsers((items) => items.filter((user) => user._id !== userId));
    } catch (actionError) {
      setError(actionError.message);
    } finally {
      setBusy(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (confirmDeleteUserId) {
      remove(confirmDeleteUserId);
      setConfirmDeleteUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner size="lg" color="warning" label="Loading users..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">
          Manage Users
        </h1>
        <p className="text-[#645d52] text-xs font-bold uppercase tracking-[0.14em] mt-1">
          Update roles or remove user accounts.
        </p>
      </div>

      {error && (
        <Card className="border border-red-200 bg-red-50/50 rounded-none shadow-[2px_2px_0_#24231f]">
          <Card.Content className="p-4 text-xs font-bold uppercase tracking-wider text-red-700">
            {error}
          </Card.Content>
        </Card>
      )}

      <div className="overflow-x-auto rounded-none border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#ebe3d5] border-b border-[#bfb5a3] text-left">
              <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">User</th>
              <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Email</th>
              <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Role</th>
              <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Credits</th>
              <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#cfc6b7]/50">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-[#ebe3d5]/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar size="sm" className="rounded-none border border-[#bfb5a3]">
                      <Avatar.Image src={user.photoURL} alt={user.name} />
                      <Avatar.Fallback className="rounded-none bg-[#ebe3d5] font-serif font-black text-[#9a3412]">
                        {user.name?.[0]}
                      </Avatar.Fallback>
                    </Avatar>
                    <span className="font-bold text-[#24231f]">{user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#645d52] font-semibold">{user.email}</td>
                <td className="px-4 py-3">
                  <select
                    aria-label={`Role for ${user.name}`}
                    value={user.role}
                    disabled={busy === user._id}
                    onChange={(event) => updateRole(user._id, event.target.value)}
                    className="rounded-none border border-[#bfb5a3] bg-[#fdfaf4] px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#24231f] shadow-[1px_1px_0_#24231f] focus:outline-none cursor-pointer"
                  >
                    {ROLES.map((role) => (
                      <option key={role} className="bg-[#fdfaf4] text-[#24231f] font-bold uppercase tracking-wider">
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 font-extrabold text-[#9a3412]">{user.credits} Cr</td>
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    className="bg-[#9a3412] hover:bg-[#7f2d0f] text-white font-bold uppercase tracking-wider text-[10px] rounded-none shadow-[2px_2px_0_#24231f] transition-all cursor-pointer"
                    isLoading={busy === user._id}
                    onPress={() => setConfirmDeleteUserId(user._id)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Custom Brutalist Confirmation Modal */}
      {confirmDeleteUserId && (() => {
        const userToDelete = users.find((u) => u._id === confirmDeleteUserId);
        return (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setConfirmDeleteUserId(null)}
          >
            <div
              className="bg-[#fdfaf4] border-2 border-[#24231f] w-full max-w-sm rounded-none p-6 shadow-[8px_8px_0_#24231f] flex flex-col gap-4 text-center animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto w-12 h-12 rounded-none bg-[#ebe3d5] border border-[#bfb5a3] flex items-center justify-center text-[#9a3412]">
                <AlertTriangle size={24} />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-serif text-xl tracking-[-0.02em] text-[#24231f]">
                  Delete User Account
                </h3>
                <p className="text-sm leading-6 text-[#645d52] font-semibold">
                  Are you sure you want to delete <span className="font-bold text-[#24231f] underline">{userToDelete?.name}</span>? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 mt-2">
                <Button
                  className="flex-1 font-bold uppercase tracking-wider text-[10px] border border-[#bfb5a3] bg-[#ebe3d5] text-[#565148] rounded-none shadow-[2px_2px_0_rgba(36,35,31,0.08)] hover:-translate-y-0.5 transition-all cursor-pointer h-10"
                  onPress={() => setConfirmDeleteUserId(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 font-bold uppercase tracking-wider text-[10px] bg-[#9a3412] text-[#f7f0e3] hover:bg-[#7f2d0f] rounded-none shadow-[2px_2px_0_#24231f] hover:-translate-y-0.5 transition-all cursor-pointer h-10"
                  onPress={handleDeleteConfirm}
                >
                  Delete User
                </Button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
