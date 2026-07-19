"use client";

import React, { useEffect, useState } from "react";
import { Button, Card, Spinner } from "@heroui/react";

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const response = await fetch("/api/admin/withdrawals");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load withdrawals.");
      setWithdrawals(data.withdrawals);
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

  const approve = async (withdrawalId) => {
    setProcessing(withdrawalId);
    setError("");
    try {
      const response = await fetch("/api/admin/withdrawals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ withdrawalId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to process withdrawal.");
      setWithdrawals((items) => items.filter((item) => item._id !== withdrawalId));
    } catch (actionError) {
      setError(actionError.message);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner size="lg" color="warning" label="Loading withdrawal requests..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">
          Withdrawal Requests
        </h1>
        <p className="text-[#645d52] text-xs font-bold uppercase tracking-[0.14em] mt-1">
          Confirm completed creator payouts.
        </p>
      </div>

      {error && (
        <Card className="border border-red-200 bg-red-50/50 rounded-none shadow-[2px_2px_0_#24231f]">
          <Card.Content className="p-4 text-xs font-bold uppercase tracking-wider text-red-700">
            {error}
          </Card.Content>
        </Card>
      )}

      {withdrawals.length === 0 ? (
        <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
          <Card.Content className="p-8 text-center text-xs font-bold uppercase tracking-wider text-[#776f63]">
            No pending withdrawal requests.
          </Card.Content>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-none border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#ebe3d5] border-b border-[#bfb5a3] text-left">
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Creator</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Credits</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Payout</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Payment Details</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Requested</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cfc6b7]/50">
              {withdrawals.map((item) => (
                <tr key={item._id} className="hover:bg-[#ebe3d5]/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-bold text-[#24231f]">{item.creator_name}</p>
                    <p className="text-xs font-semibold text-[#645d52]">{item.creator_email}</p>
                  </td>
                  <td className="px-4 py-3 font-extrabold text-[#9a3412]">{item.withdrawal_credit} Cr</td>
                  <td className="px-4 py-3 font-extrabold text-[#15803d]">${item.withdrawal_amount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className="font-bold uppercase text-[10px] tracking-wider text-[#24231f]">{item.payment_system}</span>
                    <p className="text-xs text-[#645d52] font-semibold">{item.account_number}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#645d52] font-semibold">
                    {new Date(item.withdraw_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      className="bg-[#15803d] hover:bg-[#166534] text-white font-bold uppercase tracking-wider text-[10px] rounded-none shadow-[2px_2px_0_#24231f] transition-all cursor-pointer"
                      isLoading={processing === item._id}
                      onPress={() => approve(item._id)}
                    >
                      Payment Success
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
