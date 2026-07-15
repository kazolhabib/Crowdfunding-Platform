"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Spinner } from "@heroui/react";
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
    const timeoutId = setTimeout(() => {
      void fetchCampaigns();
    }, 0);
    return () => clearTimeout(timeoutId);
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
    if (s === "approved") return "text-green-700 bg-green-50/50 border-green-200";
    if (s === "rejected") return "text-red-700 bg-red-50/50 border-red-200";
    return "text-amber-700 bg-amber-50/50 border-amber-200";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Spinner size="lg" color="warning" label="Loading campaigns..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">My Campaigns</h1>
        <p className="text-[#645d52] text-xs font-bold uppercase tracking-[0.14em] mt-1">
          Manage all campaigns you have created.
        </p>
      </div>

      {campaigns.length === 0 ? (
        <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
          <Card.Content className="p-8 text-center text-xs font-bold uppercase tracking-wider text-[#776f63]">
            You haven&apos;t created any campaigns yet.
          </Card.Content>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-none border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#ebe3d5] border-b border-[#bfb5a3] text-left">
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Title</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Category</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Goal</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Raised</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Deadline</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Status</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cfc6b7]/50">
              {campaigns.map((camp) => (
                <tr key={camp._id} className="hover:bg-[#ebe3d5]/30 transition-colors">
                  <td className="px-4 py-3 font-bold text-[#24231f] max-w-[220px] truncate">
                    {camp.title}
                  </td>
                  <td className="px-4 py-3 text-[#645d52] font-semibold">{camp.category}</td>
                  <td className="px-4 py-3 text-[#645d52] font-bold">{camp.funding_goal} Cr</td>
                  <td className="px-4 py-3 font-extrabold text-[#9a3412]">{camp.amount_raised} Cr</td>
                  <td className="px-4 py-3 text-[#776f63] font-medium text-xs">
                    {new Date(camp.deadline).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 border text-[9px] font-bold uppercase rounded-none ${statusColor(camp.status)}`}>
                      {camp.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(camp)}
                        className="p-2 border border-[#bfb5a3] bg-[#ebe3d5] text-[#24231f] hover:bg-[#24231f] hover:text-[#f4f0e8] hover:border-[#24231f] cursor-pointer transition-colors shadow-[1px_1px_0_#24231f]"
                        title="Edit"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(camp._id)}
                        disabled={deleting === camp._id}
                        className="p-2 border border-[#bfb5a3] bg-[#ebe3d5] text-red-700 hover:bg-red-750 hover:text-white hover:border-red-750 cursor-pointer transition-colors disabled:opacity-50 shadow-[1px_1px_0_#24231f]"
                        title="Delete"
                      >
                        <Trash2 size={13} />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 animate-fade-in">
          <Card className="w-full max-w-lg border border-[#bfb5a3] bg-[#fdfaf4] shadow-[6px_6px_0_#24231f] rounded-none">
            <Card.Content className="p-6 flex flex-col gap-5">
              <div className="flex justify-between items-center border-b border-[#cfc6b7] pb-3">
                <h2 className="font-serif text-xl tracking-[-0.02em] text-[#24231f]">Update Campaign</h2>
                <button
                  onClick={() => setEditCampaign(null)}
                  className="p-1 border border-[#bfb5a3] bg-[#ebe3d5] text-[#24231f] hover:bg-[#24231f] hover:text-[#f4f0e8] hover:border-[#24231f] cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#565148]">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-3 border border-[#bfb5a3] bg-[#f4f0e8]/50 text-sm text-[#24231f] focus:outline-none focus:border-[#9a3412] focus:bg-[#fdfaf4] transition-all font-semibold rounded-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#565148]">Story</label>
                <textarea
                  value={editStory}
                  onChange={(e) => setEditStory(e.target.value)}
                  rows={4}
                  className="w-full px-3.5 py-3 border border-[#bfb5a3] bg-[#f4f0e8]/50 text-sm text-[#24231f] focus:outline-none focus:border-[#9a3412] focus:bg-[#fdfaf4] resize-y transition-all font-semibold rounded-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#565148]">Reward Info</label>
                <input
                  type="text"
                  value={editReward}
                  onChange={(e) => setEditReward(e.target.value)}
                  className="w-full px-3.5 py-3 border border-[#bfb5a3] bg-[#f4f0e8]/50 text-sm text-[#24231f] focus:outline-none focus:border-[#9a3412] focus:bg-[#fdfaf4] transition-all font-semibold rounded-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-[#cfc6b7]">
                <Button
                  className="rounded-none border border-[#bfb5a3] bg-[#ebe3d5] text-[#24231f] font-bold uppercase text-xs h-10 px-4 hover:bg-[#24231f] hover:text-[#f4f0e8] hover:border-[#24231f]"
                  onClick={() => setEditCampaign(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="rounded-none bg-[#9a3412] hover:bg-[#b45309] text-[#f7f0e3] font-bold uppercase text-xs h-10 px-4"
                  onClick={handleUpdate}
                  isLoading={saving}
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
