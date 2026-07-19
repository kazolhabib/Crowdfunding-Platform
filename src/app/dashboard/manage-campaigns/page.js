"use client";

import React, { useEffect, useState } from "react";
import { Button, Card, Spinner } from "@heroui/react";

export default function ManageCampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const response = await fetch("/api/admin/campaigns");
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
      void load();
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const remove = async (campaignId) => {
    if (!window.confirm("Permanently remove this campaign? All contributor credits will be refunded.")) return;
    setBusy(campaignId);
    setError("");
    try {
      const response = await fetch(`/api/admin/campaigns?id=${campaignId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to remove campaign.");
      setCampaigns((items) => items.filter((campaign) => campaign._id !== campaignId));
    } catch (actionError) {
      setError(actionError.message);
    } finally {
      setBusy(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner size="lg" color="warning" label="Loading campaigns..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">
          Manage Campaigns
        </h1>
        <p className="text-[#645d52] text-xs font-bold uppercase tracking-[0.14em] mt-1">
          Remove campaigns when moderation requires permanent action.
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
            No campaigns found.
          </Card.Content>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-none border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#ebe3d5] border-b border-[#bfb5a3] text-left">
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Campaign</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Creator</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Raised / Goal</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Status</th>
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
                  <td className="px-4 py-3 text-[#24231f] font-semibold">
                    <span className="font-extrabold text-[#9a3412]">{campaign.amount_raised.toLocaleString()}</span> / {campaign.funding_goal.toLocaleString()} Cr
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 border text-[9px] font-bold uppercase bg-[#ebe3d5]/30 ${
                      campaign.status === "approved"
                        ? "border-green-200 text-green-700 bg-green-50/50"
                        : campaign.status === "pending"
                        ? "border-orange-200 text-orange-700 bg-orange-50/50"
                        : "border-red-200 text-red-700 bg-red-50/50"
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      className="bg-[#9a3412] hover:bg-[#7f2d0f] text-white font-bold uppercase tracking-wider text-[10px] rounded-none shadow-[2px_2px_0_#24231f] transition-all cursor-pointer"
                      isLoading={busy === campaign._id}
                      onPress={() => remove(campaign._id)}
                    >
                      Delete
                    </Button>
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
