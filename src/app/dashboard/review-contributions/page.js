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
        <Spinner size="lg" color="primary" label="Loading contributions..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
          Contributions to Review
        </h1>
        <p className="text-zinc-500 text-xs mt-1">
          Approve or reject pending supporter contributions to your campaigns.
        </p>
      </div>

      {contributions.length === 0 ? (
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <Card.Content className="p-8 text-center text-sm text-zinc-500">
            No pending contributions to review.
          </Card.Content>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-left">
                <th className="px-4 py-3 font-bold text-xs text-zinc-500 uppercase tracking-wider">Supporter</th>
                <th className="px-4 py-3 font-bold text-xs text-zinc-500 uppercase tracking-wider">Campaign</th>
                <th className="px-4 py-3 font-bold text-xs text-zinc-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 font-bold text-xs text-zinc-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 font-bold text-xs text-zinc-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {contributions.map((contrib) => (
                <tr key={contrib._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-3 font-semibold text-zinc-800 dark:text-white">
                    {contrib.supporter_name}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 max-w-[180px] truncate">
                    {contrib.campaign_title}
                  </td>
                  <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">
                    {contrib.contribution_amount} Cr
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">
                    {new Date(contrib.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewContrib(contrib)}
                        className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 cursor-pointer transition-colors"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleAction(contrib._id, "approve")}
                        disabled={processing === contrib._id}
                        className="p-1.5 rounded-md hover:bg-green-50 dark:hover:bg-green-950/30 text-green-600 dark:text-green-400 cursor-pointer transition-colors disabled:opacity-50"
                        title="Approve"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => handleAction(contrib._id, "reject")}
                        disabled={processing === contrib._id}
                        className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 cursor-pointer transition-colors disabled:opacity-50"
                        title="Reject"
                      >
                        <XCircle size={14} />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl">
            <Card.Content className="p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Contribution Details</h2>
                <button
                  onClick={() => setViewContrib(null)}
                  className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Supporter</span>
                  <span className="font-semibold text-zinc-800 dark:text-white">{viewContrib.supporter_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Email</span>
                  <span className="font-semibold text-zinc-800 dark:text-white">{viewContrib.supporter_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Campaign</span>
                  <span className="font-semibold text-zinc-800 dark:text-white">{viewContrib.campaign_title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Amount</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{viewContrib.contribution_amount} Credits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Date</span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {new Date(viewContrib.date).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-3 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                <Button
                  color="danger"
                  variant="flat"
                  size="sm"
                  onClick={() => handleAction(viewContrib._id, "reject")}
                  isLoading={processing === viewContrib._id}
                  startContent={<XCircle size={14} />}
                >
                  Reject & Refund
                </Button>
                <Button
                  color="success"
                  size="sm"
                  onClick={() => handleAction(viewContrib._id, "approve")}
                  isLoading={processing === viewContrib._id}
                  startContent={<Check size={14} />}
                  className="font-semibold"
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
