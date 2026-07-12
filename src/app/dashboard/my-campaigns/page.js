"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Spinner, Input } from "@heroui/react";
import { Pencil, Trash2, X } from "lucide-react";

export default function MyCampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCampaign, setEditCampaign] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStory, setEditStory] = useState("");
  const [editReward, setEditReward] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/creator/campaigns");
      const data = await res.json();
      if (data.success) setCampaigns(data.campaigns);
    } catch (err) {
      console.error("Fetch campaigns error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const openEdit = (camp) => {
    setEditCampaign(camp);
    setEditTitle(camp.title);
    setEditStory(camp.story);
    setEditReward(camp.reward_info || "");
  };

  const handleUpdate = async () => {
    if (!editCampaign) return;
    setSaving(true);
    try {
      const res = await fetch("/api/creator/campaigns", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: editCampaign._id,
          title: editTitle,
          story: editStory,
          reward_info: editReward,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditCampaign(null);
        fetchCampaigns();
      }
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure? All approved supporters will be refunded automatically.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/creator/campaigns?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchCampaigns();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(null);
    }
  };

  const statusColor = (s) => {
    if (s === "approved") return "text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400";
    if (s === "rejected") return "text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400";
    return "text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Spinner size="lg" color="primary" label="Loading campaigns..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">My Campaigns</h1>
        <p className="text-zinc-500 text-xs mt-1">Manage all campaigns you have created.</p>
      </div>

      {campaigns.length === 0 ? (
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <Card.Content className="p-8 text-center text-sm text-zinc-500">
            You haven't created any campaigns yet.
          </Card.Content>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-left">
                <th className="px-4 py-3 font-bold text-xs text-zinc-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 font-bold text-xs text-zinc-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 font-bold text-xs text-zinc-500 uppercase tracking-wider">Goal</th>
                <th className="px-4 py-3 font-bold text-xs text-zinc-500 uppercase tracking-wider">Raised</th>
                <th className="px-4 py-3 font-bold text-xs text-zinc-500 uppercase tracking-wider">Deadline</th>
                <th className="px-4 py-3 font-bold text-xs text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 font-bold text-xs text-zinc-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {campaigns.map((camp) => (
                <tr key={camp._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-3 font-semibold text-zinc-800 dark:text-white max-w-[200px] truncate">
                    {camp.title}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{camp.category}</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{camp.funding_goal}</td>
                  <td className="px-4 py-3 font-semibold text-zinc-800 dark:text-white">{camp.amount_raised}</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {new Date(camp.deadline).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColor(camp.status)}`}>
                      {camp.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(camp)}
                        className="p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/30 text-blue-600 dark:text-blue-400 cursor-pointer transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(camp._id)}
                        disabled={deleting === camp._id}
                        className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 cursor-pointer transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal Overlay */}
      {editCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl">
            <Card.Content className="p-6 flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Update Campaign</h2>
                <button
                  onClick={() => setEditCampaign(null)}
                  className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <Input
                label="Title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                variant="bordered"
              />

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-zinc-500">Story</label>
                <textarea
                  value={editStory}
                  onChange={(e) => setEditStory(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-medium bg-transparent text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-blue-500 resize-y transition-colors"
                />
              </div>

              <Input
                label="Reward Info"
                value={editReward}
                onChange={(e) => setEditReward(e.target.value)}
                variant="bordered"
              />

              <div className="flex justify-end gap-3 mt-2">
                <Button variant="bordered" size="sm" onClick={() => setEditCampaign(null)}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  size="sm"
                  onClick={handleUpdate}
                  isLoading={saving}
                  className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>
      )}
    </div>
  );
}
