"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, Spinner } from "@heroui/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function MyContributionsPage() {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchContributions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/supporter/contributions?page=${page}&limit=${limit}`);
      const data = await res.json();
      if (data.success) {
        setContributions(data.contributions);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("Fetch contributions error:", err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchContributions();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [fetchContributions]);

  const statusColor = (s) => {
    if (s === "approved") return "text-green-700 bg-green-50/50 border-green-200";
    if (s === "rejected") return "text-red-700 bg-red-50/50 border-red-200";
    return "text-amber-700 bg-amber-50/50 border-amber-200";
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">
          My Contributions
        </h1>
        <p className="text-[#645d52] text-xs font-bold uppercase tracking-[0.14em] mt-1">
          Track the campaigns you have supported.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Spinner size="lg" color="warning" label="Loading contributions..." />
        </div>
      ) : contributions.length === 0 ? (
        <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
          <Card.Content className="p-8 text-center text-xs font-bold uppercase tracking-wider text-[#776f63]">
            You have not made any contributions yet. Explore campaigns to get started!
          </Card.Content>
        </Card>
      ) : (
        <>
          <div className="overflow-x-auto rounded-none border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#ebe3d5] border-b border-[#bfb5a3] text-left">
                  <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Campaign</th>
                  <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Creator</th>
                  <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Amount</th>
                  <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Date</th>
                  <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#cfc6b7]/50">
                {contributions.map((contrib) => (
                  <tr key={contrib._id} className="hover:bg-[#ebe3d5]/30 transition-colors">
                    <td className="px-4 py-3 font-bold text-[#24231f] max-w-[220px] truncate">
                      {contrib.campaign_title}
                    </td>
                    <td className="px-4 py-3 text-[#645d52] font-semibold">
                      {contrib.creator_name}
                    </td>
                    <td className="px-4 py-3 font-extrabold text-[#9a3412]">
                      {contrib.contribution_amount} Cr
                    </td>
                    <td className="px-4 py-3 text-[#776f63] font-medium text-xs">
                      {new Date(contrib.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 border text-[9px] font-bold uppercase rounded-none ${statusColor(contrib.status)}`}>
                        {contrib.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 border border-[#bfb5a3] bg-[#ebe3d5] text-[#24231f] disabled:opacity-50 hover:bg-[#24231f] hover:text-[#f4f0e8] hover:border-[#24231f] transition-all cursor-pointer shadow-[1px_1px_0_#24231f]"
              >
                <ArrowLeft size={14} />
              </button>
              <span className="text-xs font-bold uppercase tracking-wider text-[#645d52]">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 border border-[#bfb5a3] bg-[#ebe3d5] text-[#24231f] disabled:opacity-50 hover:bg-[#24231f] hover:text-[#f4f0e8] hover:border-[#24231f] transition-all cursor-pointer shadow-[1px_1px_0_#24231f]"
              >
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
