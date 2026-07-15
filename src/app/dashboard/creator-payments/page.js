"use client";

import React, { useState, useEffect } from "react";
import { Card, Spinner } from "@heroui/react";

export default function CreatorPaymentsPage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWithdrawals = async () => {
    try {
      const res = await fetch("/api/creator/withdrawals");
      const data = await res.json();
      if (data.success) {
        setWithdrawals(data.withdrawals);
      }
    } catch (err) {
      console.error("Fetch payments history error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchWithdrawals();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  const statusColor = (s) => {
    if (s === "approved") return "text-green-700 bg-green-50/50 border-green-200";
    return "text-amber-700 bg-amber-50/50 border-amber-200";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Spinner size="lg" color="warning" label="Loading payout history..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">
          Payment History
        </h1>
        <p className="text-[#645d52] text-xs font-bold uppercase tracking-[0.14em] mt-1">
          View your complete payout and transaction records.
        </p>
      </div>

      {withdrawals.length === 0 ? (
        <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
          <Card.Content className="p-8 text-center text-xs font-bold uppercase tracking-wider text-[#776f63]">
            No payout transactions found.
          </Card.Content>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-none border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#ebe3d5] border-b border-[#bfb5a3] text-left">
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Date</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Payment System</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Account Info</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Credits Redeemed</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">USD Amount</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cfc6b7]/50">
              {withdrawals.map((w) => (
                <tr key={w._id} className="hover:bg-[#ebe3d5]/30 transition-colors">
                  <td className="px-4 py-3 text-[#776f63] font-medium text-xs">
                    {new Date(w.withdraw_date).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-[#24231f] font-bold uppercase text-[10px] tracking-wider">
                    {w.payment_system}
                  </td>
                  <td className="px-4 py-3 text-[#645d52] font-semibold">
                    {w.account_number}
                  </td>
                  <td className="px-4 py-3 font-extrabold text-[#24231f]">
                    {w.withdrawal_credit} Cr
                  </td>
                  <td className="px-4 py-3 font-extrabold text-green-700">
                    ${w.withdrawal_amount.toFixed(2)} USD
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 border text-[9px] font-bold uppercase rounded-none ${statusColor(w.status)}`}>
                      {w.status}
                    </span>
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
