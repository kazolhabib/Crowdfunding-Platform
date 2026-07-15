"use client";

import React, { useState, useEffect } from "react";
import { Card, Spinner } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";
import { HeartHandshake, Clock, Coins } from "lucide-react";

export default function SupporterPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalCount: 0, pendingCount: 0, approvedTotal: 0 });
  const [approvedContributions, setApprovedContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/supporter/contributions?limit=50");
        const data = await res.json();
        if (data.success) {
          if (data.stats) setStats(data.stats);
          if (data.contributions) {
            // Filter only approved contributions
            const approved = data.contributions.filter((c) => c.status === "approved");
            setApprovedContributions(approved);
          }
        }
      } catch (err) {
        console.error("Fetch supporter dashboard data error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Spinner size="lg" color="warning" label="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-[#645d52] text-xs font-bold uppercase tracking-[0.14em] mt-1">
          Track your contributions and discover campaigns to support.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
          <Card.Content className="p-6 flex items-center gap-5">
            <div className="p-3.5 bg-[#ebe3d5] text-[#9a3412] border border-[#bfb5a3] rounded-none">
              <HeartHandshake size={28} />
            </div>
            <div>
              <span className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">
                {stats.totalCount}
              </span>
              <p className="text-[#645d52] text-[10px] font-bold uppercase tracking-[0.12em] mt-1">
                Total Contributions
              </p>
            </div>
          </Card.Content>
        </Card>

        <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
          <Card.Content className="p-6 flex items-center gap-5">
            <div className="p-3.5 bg-[#ebe3d5] text-[#b45309] border border-[#bfb5a3] rounded-none">
              <Clock size={28} />
            </div>
            <div>
              <span className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">
                {stats.pendingCount}
              </span>
              <p className="text-[#645d52] text-[10px] font-bold uppercase tracking-[0.12em] mt-1">
                Pending Contributions
              </p>
            </div>
          </Card.Content>
        </Card>

        <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
          <Card.Content className="p-6 flex items-center gap-5">
            <div className="p-3.5 bg-[#ebe3d5] text-[#15803d] border border-[#bfb5a3] rounded-none">
              <Coins size={28} />
            </div>
            <div>
              <span className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">
                {stats.approvedTotal}
              </span>
              <p className="text-[#645d52] text-[10px] font-bold uppercase tracking-[0.12em] mt-1">
                Credits Contributed (Approved)
              </p>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Approved Contributions Table */}
      <div className="flex flex-col gap-4 mt-2">
        <div>
          <h2 className="font-serif text-xl tracking-[-0.02em] text-[#24231f]">
            Approved Contributions
          </h2>
          <p className="text-[#645d52] text-[10px] font-bold uppercase tracking-[0.12em]">
            Verified contributions that have been added to their campaigns.
          </p>
        </div>

        {approvedContributions.length === 0 ? (
          <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
            <Card.Content className="p-8 text-center text-xs font-bold uppercase tracking-wider text-[#776f63]">
              No approved contributions yet.
            </Card.Content>
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-none border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#ebe3d5] border-b border-[#bfb5a3] text-left">
                  <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Campaign Title</th>
                  <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Contributed</th>
                  <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Creator</th>
                  <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#cfc6b7]/50">
                {approvedContributions.map((contrib) => (
                  <tr key={contrib._id} className="hover:bg-[#ebe3d5]/30 transition-colors">
                    <td className="px-4 py-3 font-bold text-[#24231f]">
                      {contrib.campaign_title}
                    </td>
                    <td className="px-4 py-3 font-extrabold text-[#9a3412]">
                      {contrib.contribution_amount} Cr
                    </td>
                    <td className="px-4 py-3 text-[#645d52] font-semibold">
                      {contrib.creator_name}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 border border-green-200 text-[9px] font-bold uppercase bg-green-50/50 text-green-700">
                        {contrib.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
