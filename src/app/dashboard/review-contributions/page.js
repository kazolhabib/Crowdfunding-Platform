"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Spinner } from "@heroui/react";
import { Eye, Check, XCircle, X } from "lucide-react";

export default function ReviewContributionsPage() {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [viewContrib, setViewContrib] = useState(null);

  const fetchContributions = async () => {
    try {
      const res = await fetch("/api/creator/contributions");
      const data = await res.json();
      if (data.success) setContributions(data.contributions);
    } catch (err) {
      console.error("Fetch contributions error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchContributions();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleAction = async (id, action) => {
    setProcessing(id);
    try {
      const res = await fetch("/api/creator/contributions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contributionId: id, action }),
      });
      const data = await res.json();
      if (data.success) {
        fetchContributions();
        if (viewContrib && viewContrib._id === id) setViewContrib(null);
      }
    } catch (err) {
      console.error("Action error:", err);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Spinner size="lg" color="warning" label="Loading contributions..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">
          Contributions to Review
        </h1>
        <p className="text-[#645d52] text-xs font-bold uppercase tracking-[0.14em] mt-1">
          Approve or reject pending supporter contributions to your campaigns.
        </p>
      </div>

      {contributions.length === 0 ? (
        <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
          <Card.Content className="p-8 text-center text-xs font-bold uppercase tracking-wider text-[#776f63]">
            No pending contributions to review.
          </Card.Content>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-none border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#ebe3d5] border-b border-[#bfb5a3] text-left">
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Supporter</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Campaign</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Amount</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Date</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cfc6b7]/50">
              {contributions.map((contrib) => (
                <tr key={contrib._id} className="hover:bg-[#ebe3d5]/30 transition-colors">
                  <td className="px-4 py-3 font-bold text-[#24231f]">
                    {contrib.supporter_name}
                  </td>
                  <td className="px-4 py-3 text-[#645d52] font-semibold max-w-[200px] truncate">
                    {contrib.campaign_title}
                  </td>
                  <td className="px-4 py-3 font-bold text-[#9a3412]">
                    {contrib.contribution_amount} Cr
                  </td>
                  <td className="px-4 py-3 text-[#776f63] font-medium text-xs">
                    {new Date(contrib.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewContrib(contrib)}
                        className="p-2 border border-[#bfb5a3] bg-[#ebe3d5] text-[#24231f] hover:bg-[#24231f] hover:text-[#f4f0e8] hover:border-[#24231f] cursor-pointer transition-colors shadow-[1px_1px_0_#24231f]"
                        title="View Details"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => handleAction(contrib._id, "approve")}
                        disabled={processing === contrib._id}
                        className="p-2 border border-[#bfb5a3] bg-[#ebe3d5] text-green-700 hover:bg-green-700 hover:text-white hover:border-green-750 cursor-pointer transition-colors disabled:opacity-50 shadow-[1px_1px_0_#24231f]"
                        title="Approve"
                      >
                        <Check size={13} />
                      </button>
                      <button
                        onClick={() => handleAction(contrib._id, "reject")}
                        disabled={processing === contrib._id}
                        className="p-2 border border-[#bfb5a3] bg-[#ebe3d5] text-red-700 hover:bg-red-750 hover:text-white hover:border-red-750 cursor-pointer transition-colors disabled:opacity-50 shadow-[1px_1px_0_#24231f]"
                        title="Reject & Refund"
                      >
                        <XCircle size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Details Modal */}
      {viewContrib && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 animate-fade-in">
          <Card className="w-full max-w-md border border-[#bfb5a3] bg-[#fdfaf4] shadow-[6px_6px_0_#24231f] rounded-none">
            <Card.Content className="p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-[#cfc6b7] pb-3">
                <h2 className="font-serif text-xl tracking-[-0.02em] text-[#24231f]">Contribution Details</h2>
                <button
                  onClick={() => setViewContrib(null)}
                  className="p-1 border border-[#bfb5a3] bg-[#ebe3d5] text-[#24231f] hover:bg-[#24231f] hover:text-[#f4f0e8] hover:border-[#24231f] cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="flex flex-col gap-3 text-xs uppercase tracking-wide">
                <div className="flex justify-between border-b border-[#cfc6b7]/30 pb-2">
                  <span className="text-[#776f63] font-bold">Supporter</span>
                  <span className="font-bold text-[#24231f]">{viewContrib.supporter_name}</span>
                </div>
                <div className="flex justify-between border-b border-[#cfc6b7]/30 pb-2">
                  <span className="text-[#776f63] font-bold">Email</span>
                  <span className="font-bold text-[#24231f] lowercase">{viewContrib.supporter_email}</span>
                </div>
                <div className="flex justify-between border-b border-[#cfc6b7]/30 pb-2">
                  <span className="text-[#776f63] font-bold">Campaign</span>
                  <span className="font-bold text-[#24231f] max-w-[200px] truncate">{viewContrib.campaign_title}</span>
                </div>
                <div className="flex justify-between border-b border-[#cfc6b7]/30 pb-2">
                  <span className="text-[#776f63] font-bold">Amount</span>
                  <span className="font-extrabold text-[#9a3412]">{viewContrib.contribution_amount} Credits</span>
                </div>
                <div className="flex justify-between border-b border-[#cfc6b7]/30 pb-2">
                  <span className="text-[#776f63] font-bold">Date</span>
                  <span className="text-[#24231f] font-semibold">
                    {new Date(viewContrib.date).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-[#cfc6b7]">
                <Button
                  color="danger"
                  className="rounded-none border border-red-200 bg-red-50 text-red-700 font-bold uppercase text-xs h-10 px-4"
                  onClick={() => handleAction(viewContrib._id, "reject")}
                  isLoading={processing === viewContrib._id}
                  startContent={<XCircle size={14} />}
                >
                  Reject & Refund
                </Button>
                <Button
                  color="success"
                  className="rounded-none bg-[#9a3412] hover:bg-[#b45309] text-[#f7f0e3] font-bold uppercase text-xs h-10 px-4"
                  onClick={() => handleAction(viewContrib._id, "approve")}
                  isLoading={processing === viewContrib._id}
                  startContent={<Check size={14} />}
                >
                  Approve
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>
      )}
    </div>
  );
}
