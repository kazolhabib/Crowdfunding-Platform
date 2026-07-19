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
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => {
      void loadCampaigns();
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const updateCampaign = async (campaignId, action) => {
    if (action === "reject" && !reason.trim()) {
      setError("Provide a reason before rejecting this campaign.");
      return;
    }
    setProcessing(campaignId);
    setError("");
    try {
      const response = await fetch("/api/admin/campaigns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId, action, reason }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to update campaign.");
      setCampaigns((items) => items.filter((item) => item._id !== campaignId));
      setRejecting(null);
      setReason("");
    } catch (actionError) {
      setError(actionError.message);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner size="lg" color="warning" label="Loading campaign approvals..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">
          Campaign Approvals
        </h1>
        <p className="text-[#645d52] text-xs font-bold uppercase tracking-[0.14em] mt-1">
          Review submitted campaigns before they become public.
        </p>
      </div>

      {error && (
        <Card className="border border-red-200 bg-red-50/50 rounded-none shadow-[2px_2px_0_#24231f]">
          <Card.Content className="p-4 text-xs font-bold uppercase tracking-wider text-red-700">
            {error}
          </Card.Content>
        </Card>
      )}

      {campaigns.length === 0 ? (
        <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
          <Card.Content className="p-8 text-center text-xs font-bold uppercase tracking-wider text-[#776f63]">
            No pending campaigns to review.
          </Card.Content>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-none border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#ebe3d5] border-b border-[#bfb5a3] text-left">
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Campaign</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Creator</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Goal</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Deadline</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cfc6b7]/50">
              {campaigns.map((campaign) => (
                <tr key={campaign._id} className="hover:bg-[#ebe3d5]/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-serif text-sm font-bold text-[#24231f]">{campaign.title}</p>
                    <span className="mt-1 inline-block bg-[#f7f0e3] border border-[#bfb5a3] px-1.5 py-0.5 text-[8px] font-black uppercase tracking-[0.1em] text-[#24231f] shadow-[1px_1px_0_#24231f]">
                      {campaign.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#645d52] font-semibold">{campaign.creator_name}</td>
                  <td className="px-4 py-3 font-extrabold text-[#9a3412]">{campaign.funding_goal.toLocaleString()} Cr</td>
                  <td className="px-4 py-3 text-xs text-[#645d52] font-semibold">
                    {new Date(campaign.deadline).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex min-w-44 items-center gap-2">
                      {rejecting === campaign._id ? (
                        <>
                          <Input
                            aria-label="Rejection reason"
                            size="sm"
                            value={reason}
                            onChange={(event) => setReason(event.target.value)}
                            placeholder="Reason"
                            classNames={{
                              inputWrapper: "rounded-none border border-[#bfb5a3] bg-[#fdfaf4] shadow-sm",
                              input: "text-xs font-semibold text-[#24231f]",
                            }}
                          />
                          <Button
                            size="sm"
                            className="bg-[#9a3412] hover:bg-[#7f2d0f] text-white font-bold uppercase tracking-wider text-[10px] rounded-none shadow-[2px_2px_0_#24231f] transition-all cursor-pointer shrink-0"
                            isLoading={processing === campaign._id}
                            onPress={() => updateCampaign(campaign._id, "reject")}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            className="bg-[#ebe3d5] hover:bg-[#cfc6b7] text-[#565148] border border-[#bfb5a3] font-bold uppercase tracking-wider text-[10px] rounded-none shadow-[2px_2px_0_rgba(36,35,31,0.08)] transition-all cursor-pointer shrink-0"
                            onPress={() => setRejecting(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            className="bg-[#15803d] hover:bg-[#166534] text-white font-bold uppercase tracking-wider text-[10px] rounded-none shadow-[2px_2px_0_#24231f] transition-all cursor-pointer"
                            isLoading={processing === campaign._id}
                            onPress={() => updateCampaign(campaign._id, "approve")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            className="bg-[#9a3412] hover:bg-[#7f2d0f] text-white font-bold uppercase tracking-wider text-[10px] rounded-none shadow-[2px_2px_0_#24231f] transition-all cursor-pointer"
                            onPress={() => {
                              setRejecting(campaign._id);
                              setReason("");
                            }}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
