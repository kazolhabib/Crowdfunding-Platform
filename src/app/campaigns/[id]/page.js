"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Input, Spinner } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, CircleUserRound, Gift, Target, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, refreshSession } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadCampaign = useCallback(async () => {
    try {
      const response = await fetch(`/api/campaigns/${id}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Campaign not found.");
      setCampaign(data.campaign);
    } catch (loadError) {
      setError(loadError.message || "Unable to load campaign.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return undefined;
    const timeoutId = setTimeout(() => {
      void loadCampaign();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [id, loadCampaign]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const contributionAmount = Number(amount);
    if (!Number.isInteger(contributionAmount) || contributionAmount < campaign.minimum_contribution) {
      setError(`Enter a whole-number contribution of at least ${campaign.minimum_contribution} credits.`);
      return;
    }
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "Supporter") {
      setError("Only supporters can contribute to campaigns.");
      return;
    }
    if (contributionAmount > user.credits) {
      setError("You do not have enough credits for this contribution.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contribution_amount: contributionAmount }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to submit contribution.");
      await refreshSession();
      setAmount("");
      setMessage("Contribution submitted for the creator's review.");
    } catch (submitError) {
      setError(submitError.message || "Unable to submit contribution.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Spinner size="lg" label="Loading campaign..." /></div>;
  }

  if (!campaign) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-zinc-500">{error || "Campaign not found."}</div>;
  }

  const progress = Math.min(100, Math.round((campaign.amount_raised / campaign.funding_goal) * 100));
  const isActive = campaign.status === "approved" && new Date(campaign.deadline) >= new Date();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-6">
          {campaign.image_url && <img src={campaign.image_url} alt={campaign.title} className="h-72 w-full rounded-2xl object-cover shadow-sm sm:h-96" />}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">{campaign.category}</p>
            <h1 className="mt-2 text-3xl font-extrabold text-zinc-900 dark:text-white">{campaign.title}</h1>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5"><CircleUserRound size={16} /> Created by {campaign.creator_name}</span>
              <span className="flex items-center gap-1.5"><Calendar size={16} /> Ends {new Date(campaign.deadline).toLocaleDateString()}</span>
            </div>
          </div>
          <Card className="border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <Card.Content className="p-6">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">About this campaign</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-zinc-600 dark:text-zinc-300">{campaign.story}</p>
            </Card.Content>
          </Card>
          {campaign.reward_info && <Card className="border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><Card.Content className="p-6"><h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white"><Gift size={19} className="text-amber-500" /> Reward information</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-zinc-600 dark:text-zinc-300">{campaign.reward_info}</p></Card.Content></Card>}
        </section>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><Card.Content className="p-6">
            <div className="flex items-end justify-between gap-3"><div><p className="text-2xl font-extrabold text-zinc-900 dark:text-white">{campaign.amount_raised} Cr</p><p className="text-xs text-zinc-500">raised of {campaign.funding_goal} Cr goal</p></div><span className="text-sm font-bold text-indigo-600">{progress}%</span></div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"><div className="h-full rounded-full bg-indigo-600" style={{ width: `${progress}%` }} /></div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-zinc-500"><span className="flex items-center gap-1.5"><Target size={14} /> Goal: {campaign.funding_goal} Cr</span><span className="flex items-center gap-1.5"><TrendingUp size={14} /> Min: {campaign.minimum_contribution} Cr</span></div>
            <form onSubmit={handleSubmit} className="mt-6 space-y-3"><Input type="number" min={campaign.minimum_contribution} step="1" label="Contribution (credits)" value={amount} onChange={(event) => setAmount(event.target.value)} isDisabled={!isActive || user?.role !== "Supporter"} /><Button type="submit" color="primary" className="w-full font-semibold" isLoading={submitting} isDisabled={!isActive || user?.role !== "Supporter"}>{isActive ? "Contribute credits" : "Campaign is no longer active"}</Button></form>
            {user?.role === "Supporter" && <p className="mt-3 text-center text-xs text-zinc-500">Available balance: {user.credits} credits</p>}
            {message && <p className="mt-4 text-sm text-green-600 dark:text-green-400">{message}</p>}
            {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
          </Card.Content></Card>
        </aside>
      </div>
    </main>
  );
}
