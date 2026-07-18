"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, Suspense } from "react";
import { Card, Button, Spinner } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Calendar, Target, TrendingUp, ArrowRight, Search } from "lucide-react";

const CATEGORIES = ["All", "Tech", "Art", "Community", "Health"];

const CAMPAIGN_FALLBACK_IMAGES = {
  Tech: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=1200",
  Art: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1200",
  Health: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200",
  Community: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=1200",
  default: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200",
};

function ExploreCampaignsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("/api/campaigns/explore");
        const data = await res.json();
        if (data.success) {
          setCampaigns(data.campaigns);
        }
      } catch (err) {
        console.error("Fetch campaigns error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const handleCategoryChange = (category) => {
    const params = new URLSearchParams(window.location.search);
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`/campaigns?${params.toString()}`);
  };

  const filteredCampaigns = campaigns.filter((camp) => {
    const matchesCategory = activeCategory === "All" || camp.category === activeCategory;
    const matchesSearch =
      camp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camp.creator_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (camp.description && camp.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12">

      {/* Ticket-tear header */}
      <div className="mb-10 flex items-center justify-between border-y border-[#cfc6b7] py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6b6459]">
        <span>Explore active creations</span>
        <span>Public Registry — {new Date().getFullYear()}</span>
      </div>

      {/* Title */}
      <div className="mb-12 max-w-2xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9a3412]">
          patron registry
        </p>
        <h1 className="mt-4 font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.88] tracking-[-0.07em] text-[#24231f]">
          Explore the <br /><em className="font-normal text-[#9a3412]">collection.</em>
        </h1>
        <p className="mt-6 text-sm leading-7 text-[#645d52] sm:text-base">
          Discover independent campaigns and direct platform credits toward the concepts, products, and communities that inspire you.
        </p>
      </div>

      {/* Search & Category Filter Section */}
      <div className="mb-10 flex flex-col gap-6 border-b border-[#cfc6b7] pb-8 lg:flex-row lg:items-center lg:justify-between">
        {/* Categories */}
        <div className="flex flex-wrap gap-x-4 gap-y-2.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`border-b-2 pb-1.5 text-xs font-bold uppercase tracking-[0.14em] transition-all ${activeCategory === cat
                  ? "border-[#9a3412] text-[#9a3412]"
                  : "border-transparent text-[#7c7467] hover:text-[#24231f]"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative w-full max-w-md lg:w-80">
          <span className="absolute inset-y-0 left-3 flex items-center text-[#7c7467]">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-[#bfb5a3] bg-[#fdfaf4] py-2.5 pl-10 pr-4 text-xs font-bold uppercase tracking-wider text-[#24231f] rounded-none shadow-[2px_2px_0_#24231f]/10 focus:shadow-[2px_2px_0_#24231f] focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Campaign list */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Spinner size="lg" color="warning" label="Retrieving Registry..." className="text-[#24231f]" />
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none py-16 text-center">
          <Card.Content className="flex flex-col items-center justify-center gap-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#776f63]">
              No campaigns match your request
            </span>
            <p className="max-w-md text-xs text-[#776f63]">
              Try clearing your search term or exploring another category to discover active crowdfunding efforts.
            </p>
            {searchTerm && (
              <Button
                onClick={() => setSearchTerm("")}
                className="mt-2 h-9 bg-[#24231f] text-[#f4f0e8] text-[10px] font-bold uppercase tracking-wider rounded-none px-4 hover:bg-[#9a3412] transition-colors"
              >
                Clear Search
              </Button>
            )}
          </Card.Content>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredCampaigns.map((camp) => {
            const percent = Math.min(
              100,
              Math.round((camp.amount_raised / camp.funding_goal) * 100)
            );
            const fallbackImage = CAMPAIGN_FALLBACK_IMAGES[camp.category] || CAMPAIGN_FALLBACK_IMAGES.default;
            const campImage = camp.image_url || fallbackImage;

            return (
              <Card
                key={camp._id}
                className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none overflow-hidden hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#24231f] transition-all duration-200 flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative h-48 w-full bg-[#ebe3d5] border-b border-[#bfb5a3] overflow-hidden group">
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
                  <span className="absolute top-3 left-3 bg-[#f7f0e3] border border-[#bfb5a3] px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.14em] text-[#24231f] shadow-[1px_1px_0_#24231f]">
                    {camp.category}
                  </span>
                </div>

                {/* Body Content */}
                <Card.Content className="p-5 flex-1 flex flex-col justify-between gap-5">
                  <div>
                    <h3 className="font-serif text-xl tracking-[-0.03em] text-[#24231f] line-clamp-1 hover:text-[#9a3412] transition-colors cursor-pointer" onClick={() => router.push(`/campaigns/${camp._id}`)}>
                      {camp.title}
                    </h3>
                    <p className="text-[#7c7467] text-[10px] font-bold uppercase tracking-wider mt-1.5">
                      by {camp.creator_name}
                    </p>

                    {camp.description && (
                      <p className="text-xs text-[#645d52] leading-5 mt-3 line-clamp-2">
                        {camp.description}
                      </p>
                    )}
                  </div>

                  {/* Stats & Progress */}
                  <div className="flex flex-col gap-3">
                    {/* Grid of details */}
                    <div className="grid grid-cols-2 gap-2 border-t border-[#ebe3d5] pt-4 text-[10px] font-bold uppercase tracking-wider text-[#645d52]">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-[#bfb5a3]" />
                        <span className="truncate">Ends: {new Date(camp.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <Target size={13} className="text-[#bfb5a3]" />
                        <span>Goal: {camp.funding_goal.toLocaleString()} Cr</span>
                      </div>
                    </div>

                    {/* Progress Bar & raised details */}
                    <div className="flex flex-col gap-1.5 mt-1">
                      <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-wider">
                        <span className="text-[#9a3412]">{percent}% Funded</span>
                        <span className="text-[#24231f]">{camp.amount_raised.toLocaleString()} Cr Raised</span>
                      </div>
                      <div className="h-2 w-full bg-[#ebe3d5] rounded-none overflow-hidden border border-[#bfb5a3]/50">
                        <div
                          className="h-full bg-[#9a3412] transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <Link
                      href={`/campaigns/${camp._id}`}
                      className="w-full h-11 bg-[#ebe3d5] text-[#24231f] font-bold border border-[#bfb5a3] rounded-none uppercase tracking-wider text-xs hover:bg-[#24231f] hover:text-[#f4f0e8] hover:border-[#24231f] transition-all flex items-center justify-center gap-2 shadow-[2px_2px_0_#24231f] mt-2"
                    >
                      View Details
                      <ArrowRight size={14} />
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

export default function ExploreCampaignsPage() {
  return (
    <div className="min-h-screen bg-[#f4f0e8] text-[#24231f]">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[40vh]">
          <Spinner size="lg" color="warning" label="Loading..." className="text-[#24231f]" />
        </div>
      }>
        <ExploreCampaignsContent />
      </Suspense>
    </div>
  );
}
