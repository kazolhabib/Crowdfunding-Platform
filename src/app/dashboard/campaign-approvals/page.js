"use client";

import React, { useEffect, useState } from "react";
import { Button, Card, Input, Spinner } from "@heroui/react";

export default function CampaignApprovalsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const loadCampaigns = async () => {
    try {
      const response = await fetch("/api/admin/campaigns?status=pending");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load campaigns.");
      setCampaigns(data.campaigns);
    } catch (loadError) { setError(loadError.message); } finally { setLoading(false); }
  };
  useEffect(() => { const id = setTimeout(() => { void loadCampaigns(); }, 0); return () => clearTimeout(id); }, []);

  const updateCampaign = async (campaignId, action) => {
    if (action === "reject" && !reason.trim()) { setError("Provide a reason before rejecting this campaign."); return; }
    setProcessing(campaignId); setError("");
    try {
      const response = await fetch("/api/admin/campaigns", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ campaignId, action, reason }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to update campaign.");
      setCampaigns((items) => items.filter((item) => item._id !== campaignId));
      setRejecting(null); setReason("");
    } catch (actionError) { setError(actionError.message); } finally { setProcessing(null); }
  };

  if (loading) return <div className="flex min-h-[40vh] items-center justify-center"><Spinner size="lg" label="Loading campaign approvals..." /></div>;
  return <div className="flex flex-col gap-6"><div><h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">Campaign Approvals</h1><p className="mt-1 text-xs text-zinc-500">Review submitted campaigns before they become public.</p></div>{error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/20">{error}</p>}{campaigns.length === 0 ? <Card className="border border-zinc-200 dark:border-zinc-800"><Card.Content className="p-8 text-center text-sm text-zinc-500">No pending campaigns to review.</Card.Content></Card> : <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"><table className="w-full text-left text-sm"><thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"><tr><th className="p-4">Campaign</th><th className="p-4">Creator</th><th className="p-4">Goal</th><th className="p-4">Deadline</th><th className="p-4">Action</th></tr></thead><tbody>{campaigns.map((campaign) => <tr key={campaign._id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"><td className="p-4"><p className="font-semibold text-zinc-900 dark:text-white">{campaign.title}</p><p className="max-w-xs truncate text-xs text-zinc-500">{campaign.category}</p></td><td className="p-4">{campaign.creator_name}</td><td className="p-4">{campaign.funding_goal} Cr</td><td className="p-4 text-xs text-zinc-500">{new Date(campaign.deadline).toLocaleDateString()}</td><td className="p-4"><div className="flex min-w-44 gap-2">{rejecting === campaign._id ? <><Input aria-label="Rejection reason" size="sm" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Reason" /><Button size="sm" color="danger" isLoading={processing === campaign._id} onPress={() => updateCampaign(campaign._id, "reject")}>Confirm</Button></> : <><Button size="sm" color="success" isLoading={processing === campaign._id} onPress={() => updateCampaign(campaign._id, "approve")}>Approve</Button><Button size="sm" color="danger" variant="flat" onPress={() => { setRejecting(campaign._id); setReason(""); }}>Reject</Button></>}</div></td></tr>)}</tbody></table></div>}</div>;
}
