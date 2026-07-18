"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";
import { Card, Button, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, Target, TrendingUp, ArrowRight } from "lucide-react";

const CAMPAIGN_FALLBACK_IMAGES = {
  Tech: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=1200",
  Art: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1200",
  Health: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200",
  Community: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=1200",
  default: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200",
};

export default function ExplorePage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("/api/campaigns/explore");
        const data = await res.json();
        if (data.success) setCampaigns(data.campaigns);
      } catch (err) {
        console.error("Fetch campaigns error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

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
        <h1 className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">
          Explore Campaigns
        </h1>
        <p className="text-[#645d52] text-xs font-bold uppercase tracking-[0.14em] mt-1">
          Discover active campaigns and support innovative projects.
        </p>
      </div>

      {campaigns.length === 0 ? (
        <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
          <Card.Content className="p-8 text-center text-xs font-bold uppercase tracking-wider text-[#776f63]">
            No active campaigns available right now. Check back soon!
          </Card.Content>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {campaigns.map((camp) => {
            const percent = Math.min(
              100,
              Math.round((camp.amount_raised / camp.funding_goal) * 100)
            );
            const fallbackImage = CAMPAIGN_FALLBACK_IMAGES[camp.category] || CAMPAIGN_FALLBACK_IMAGES.default;
            const campImage = camp.image_url || fallbackImage;

            return (
              <Card
                key={camp._id}
                className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[3px_3px_0_#24231f] rounded-none overflow-hidden hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_#24231f] transition-all duration-200 flex flex-col h-full"
              >
                {/* Image Wrapper */}
                <div className="relative h-40 w-full bg-[#ebe3d5] border-b border-[#bfb5a3] overflow-hidden">
                  <img
                    src={campImage}
                    alt={camp.title}
                    onError={(e) => {
                      if (e.currentTarget.dataset.fallbackApplied) return;
                      e.currentTarget.dataset.fallbackApplied = "true";
                      e.currentTarget.src = fallbackImage;
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {camp.category && (
                    <span className="absolute top-2.5 left-2.5 bg-[#f7f0e3] border border-[#bfb5a3] px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.12em] text-[#24231f] shadow-[1px_1px_0_#24231f]">
                      {camp.category}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <Card.Content className="p-4 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <h3 
                      className="font-serif text-base tracking-tight text-[#24231f] line-clamp-1 hover:text-[#9a3412] transition-colors cursor-pointer"
                      onClick={() => router.push(`/campaigns/${camp._id}`)}
                    >
                      {camp.title}
                    </h3>
                    <p className="text-[#7c7467] text-[9px] font-bold uppercase tracking-wider mt-1">
                      by {camp.creator_name}
                    </p>
                    {camp.description && (
                      <p className="text-[11px] text-[#645d52] leading-relaxed mt-2.5 line-clamp-2">
                        {camp.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-2 border-t border-[#ebe3d5] pt-3 text-[10px] font-bold uppercase tracking-wider text-[#645d52]">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#bfb5a3] shrink-0" />
                        <span className="truncate">Ends: {new Date(camp.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-end">
                        <Target size={13} className="text-[#bfb5a3] shrink-0" />
                        <span>Goal: {camp.funding_goal.toLocaleString()} Cr</span>
                      </div>
                    </div>

                    {/* Progress Bar & Stats */}
                    <div className="flex flex-col gap-1.5 mt-0.5">
                      <div className="flex justify-between items-end text-[9px] font-bold uppercase tracking-wider">
                        <span className="text-[#9a3412]">{percent}% Funded</span>
                        <span className="text-[#24231f]">{camp.amount_raised.toLocaleString()} Cr Raised</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#ebe3d5] rounded-none overflow-hidden border border-[#bfb5a3]/50">
                        <div
                          className="h-full bg-[#9a3412] transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link
                      href={`/campaigns/${camp._id}`}
                      className="w-full h-9 bg-[#ebe3d5] text-[#24231f] font-bold border border-[#bfb5a3] rounded-none uppercase tracking-wider text-[10px] hover:bg-[#24231f] hover:text-[#f4f0e8] hover:border-[#24231f] transition-all flex items-center justify-center gap-1.5 shadow-[2px_2px_0_#24231f] mt-1"
                    >
                      View Details
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </Card.Content>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
