"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Spinner } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, CircleUserRound, Gift, Target, TrendingUp, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import LoadingSpinner from "@/components/LoadingSpinner";

const CAMPAIGN_FALLBACK_IMAGES = {
  Tech: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=1200",
  Art: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1200",
  Health: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200",
  Community: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=1200",
  default: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200",
};

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, refreshSession } = useAuth();
  const { showToast } = useToast();
  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reporting, setReporting] = useState(false);

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

    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "Supporter") {
      const errMsg = "Only supporters can contribute to campaigns.";
      setError(errMsg);
      showToast(errMsg, "error");
      return;
    }

    const contributionAmount = Number(amount);
    if (!Number.isInteger(contributionAmount) || contributionAmount < campaign.minimum_contribution) {
      const errMsg = `Enter a whole-number contribution of at least ${campaign.minimum_contribution} credits.`;
      setError(errMsg);
      showToast(errMsg, "warning");
      return;
    }
    if (contributionAmount > user.credits) {
      const errMsg = "You do not have enough credits for this contribution.";
      setError(errMsg);
      showToast(errMsg, "warning");
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
      const successMsg = "Contribution submitted successfully! Waiting for creator approval.";
      setMessage(successMsg);
      showToast(successMsg, "success");
    } catch (submitError) {
      const errMsg = submitError.message || "Unable to submit contribution.";
      setError(errMsg);
      showToast(errMsg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReport = async (event) => {
    event.preventDefault();
    if (!reportReason.trim()) {
      setError("Please provide a reason for reporting.");
      return;
    }
    if (!user) {
      router.push("/login");
      return;
    }

    setReporting(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/campaigns/${id}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reportReason }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to submit report.");
      setMessage("Campaign reported successfully. Admin will review it.");
      setReportReason("");
      setShowReportForm(false);
    } catch (reportError) {
      setError(reportError.message || "Unable to submit report.");
    } finally {
      setReporting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading campaign details..." />;
  }

  if (!campaign) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-xs font-bold uppercase tracking-wider text-[#776f63]">
        {error || "Campaign not found."}
      </div>
    );
  }

  const progress = Math.min(100, Math.round((campaign.amount_raised / campaign.funding_goal) * 100));
  const isActive = campaign.status === "approved" && new Date(campaign.deadline) >= new Date();
  const fallbackImage = CAMPAIGN_FALLBACK_IMAGES[campaign.category] || CAMPAIGN_FALLBACK_IMAGES.default;
  const campImage = campaign.image_url || fallbackImage;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Main Content */}
        <section className="space-y-6">
          <div className="h-72 w-full border border-[#bfb5a3] bg-[#ebe3d5] rounded-none overflow-hidden shadow-[4px_4px_0_#24231f] sm:h-96">
            <img
              src={campImage}
              alt={campaign.title}
              onError={(e) => {
                if (e.currentTarget.dataset.fallbackApplied) return;
                e.currentTarget.dataset.fallbackApplied = "true";
                e.currentTarget.src = fallbackImage;
              }}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#9a3412]">
              {campaign.category}
            </span>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl tracking-[-0.04em] text-[#24231f]">
              {campaign.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider text-[#776f63]">
              <span className="flex items-center gap-1.5 border border-[#bfb5a3] bg-[#ebe3d5]/30 px-2.5 py-1">
                <CircleUserRound size={14} className="text-[#bfb5a3]" />
                by {campaign.creator_name}
              </span>
              <span className="flex items-center gap-1.5 border border-[#bfb5a3] bg-[#ebe3d5]/30 px-2.5 py-1">
                <Calendar size={14} className="text-[#bfb5a3]" />
                deadline: {new Date(campaign.deadline).toLocaleDateString()}
              </span>
            </div>
          </div>

          <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
            <Card.Content className="p-6">
              <h2 className="font-serif text-lg tracking-[-0.02em] text-[#24231f] border-b border-[#cfc6b7] pb-2">
                About this campaign
              </h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#645d52] font-semibold">
                {campaign.story}
              </p>
            </Card.Content>
          </Card>

          {campaign.reward_info && (
            <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
              <Card.Content className="p-6">
                <h2 className="flex items-center gap-2 font-serif text-lg tracking-[-0.02em] text-[#24231f] border-b border-[#cfc6b7] pb-2">
                  <Gift size={19} className="text-[#b45309]" />
                  Reward Information
                </h2>
                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#645d52] font-semibold">
                  {campaign.reward_info}
                </p>
              </Card.Content>
            </Card>
          )}
        </section>

        {/* Sidebar Funding Box */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
            <Card.Content className="p-6 flex flex-col gap-5">
              <div>
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">
                      {campaign.amount_raised} Cr
                    </p>
                    <p className="text-[#776f63] text-[10px] font-bold uppercase tracking-wider mt-1">
                      raised of {campaign.funding_goal} Cr goal
                    </p>
                  </div>
                  <span className="font-serif text-xl tracking-[-0.02em] text-[#9a3412]">
                    {progress}%
                  </span>
                </div>

                <div className="mt-4 h-2.5 overflow-hidden rounded-none border border-[#bfb5a3]/50 bg-[#ebe3d5]">
                  <div
                    className="h-full bg-[#9a3412]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[10px] font-bold uppercase tracking-wider text-[#645d52] border-y border-[#cfc6b7] py-3">
                <span className="flex items-center gap-1.5">
                  <Target size={14} className="text-[#bfb5a3]" /> Goal: {campaign.funding_goal} Cr
                </span>
                <span className="flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-[#bfb5a3]" /> Min: {campaign.minimum_contribution} Cr
                </span>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#565148]">
                    Contribution (credits)
                  </label>
                  <input
                    required
                    type="number"
                    min={campaign.minimum_contribution}
                    step="1"
                    placeholder={`Min ${campaign.minimum_contribution} credits`}
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    className="w-full px-3.5 py-3 border border-[#bfb5a3] bg-[#f4f0e8]/50 text-sm text-[#24231f] focus:outline-none focus:border-[#9a3412] focus:bg-[#fdfaf4] transition-all font-semibold rounded-none disabled:opacity-50"
                    disabled={!isActive || (user && user.role !== "Supporter")}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#9a3412] hover:bg-[#b45309] text-[#f7f0e3] font-bold uppercase tracking-wider text-xs rounded-none transition-all shadow-[2px_2px_0_#24231f] disabled:opacity-50"
                  isLoading={submitting}
                  isDisabled={!isActive || (user && user.role !== "Supporter")}
                  startContent={!submitting && <Heart size={14} />}
                >
                  {isActive
                    ? "Contribute Credits"
                    : "Campaign is inactive"}
                </Button>
              </form>

              {user?.role === "Supporter" && (
                <div className="text-center text-[10px] font-bold uppercase tracking-wider text-[#776f63] border-t border-[#cfc6b7]/30 pt-3">
                  Available balance: <span className="text-[#24231f]">{user.credits} credits</span>
                </div>
              )}

              {user && user.role === "Supporter" && (
                <div className="mt-3 border-t border-[#cfc6b7]/30 pt-3 flex flex-col gap-2">
                  {!showReportForm ? (
                    <button
                      type="button"
                      onClick={() => setShowReportForm(true)}
                      className="text-center text-[10px] font-bold uppercase tracking-wider text-red-600 hover:underline cursor-pointer"
                    >
                      Report this campaign
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <textarea
                        placeholder="Why are you reporting this campaign?"
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-[#bfb5a3] bg-[#f4f0e8]/50 text-xs text-[#24231f] focus:outline-none focus:border-[#9a3412] focus:bg-[#fdfaf4] resize-none font-semibold rounded-none"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleReport}
                          isLoading={reporting}
                          className="flex-1 h-8 bg-red-700 hover:bg-red-800 text-white font-bold uppercase tracking-wider text-[9px] rounded-none shadow-[1px_1px_0_#24231f]"
                        >
                          Submit Report
                        </Button>
                        <Button
                          size="sm"
                          variant="bordered"
                          onClick={() => {
                            setShowReportForm(false);
                            setReportReason("");
                          }}
                          className="h-8 border border-[#bfb5a3] bg-[#ebe3d5] text-[#24231f] font-bold uppercase tracking-wider text-[9px] rounded-none"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {message && (
                <div className="p-3 border border-green-200 bg-green-50/50 text-green-700 text-xs font-bold uppercase tracking-wider rounded-none">
                  {message}
                </div>
              )}
              {error && (
                <div className="p-3 border border-red-200 bg-red-50/50 text-red-700 text-xs font-bold uppercase tracking-wider rounded-none">
                  {error}
                </div>
              )}
            </Card.Content>
          </Card>
        </aside>
      </div>
    </main>
  );
}
