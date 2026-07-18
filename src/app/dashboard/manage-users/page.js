"use client";

import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, Spinner, Table } from "@heroui/react";
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
        <Spinner size="lg" label="Loading users..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
          Manage Users
        </h1>
        <p className="mt-1 text-xs text-zinc-550">
          Update roles or remove user accounts.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      <Card className="overflow-hidden border border-zinc-200 dark:border-zinc-800">
        <Table aria-label="Platform users">
          <Table.ScrollContainer>
            <Table.Content>
              <Table.Header>
                <Table.Column isRowHeader>User</Table.Column>
                <Table.Column>Email</Table.Column>
                <Table.Column>Role</Table.Column>
                <Table.Column>Credits</Table.Column>
                <Table.Column>Actions</Table.Column>
              </Table.Header>
              <Table.Body items={users}>
                {(user) => (
                  <Table.Row key={user._id}>
                    <Table.Cell>
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          <Avatar.Image src={user.photoURL} alt={user.name} />
                          <Avatar.Fallback>{user.name?.[0]}</Avatar.Fallback>
                        </Avatar>
                        <span className="font-semibold">{user.name}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>
                      <select
                        aria-label={`Role for ${user.name}`}
                        value={user.role}
                        disabled={busy === user._id}
                        onChange={(event) =>
                          updateRole(user._id, event.target.value)
                        }
                        className="rounded-md border border-zinc-200 bg-transparent px-2 py-1 text-sm dark:border-zinc-700 text-zinc-800 dark:text-zinc-200"
                      >
                        {ROLES.map((role) => (
                          <option key={role} className="bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-250">
                            {role}
                          </option>
                        ))}
                      </select>
                    </Table.Cell>
                    <Table.Cell>{user.credits}</Table.Cell>
                    <Table.Cell>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        isLoading={busy === user._id}
                        onPress={() => setConfirmDeleteUserId(user._id)}
                      >
                        Remove
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </Card>

      {/* Custom Confirmation Modal */}
      {confirmDeleteUserId && (() => {
        const userToDelete = users.find((u) => u._id === confirmDeleteUserId);
        return (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setConfirmDeleteUserId(null)}
          >
            <div
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-sm rounded-medium p-5 shadow-2xl flex flex-col gap-4 text-center animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-600 dark:text-red-400">
                <AlertTriangle size={24} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Delete User Account
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Are you sure you want to delete <span className="font-semibold text-zinc-800 dark:text-zinc-200">{userToDelete?.name}</span>? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-2.5 mt-2">
                <Button
                  className="flex-1 font-semibold border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                  variant="bordered"
                  onPress={() => setConfirmDeleteUserId(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 font-semibold bg-danger text-white hover:bg-danger-600"
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
