"use client";

import React, { useState, useEffect } from "react";
import { Card, Spinner, Select, Label, ListBox } from "@heroui/react";
import { DollarSign, AlertTriangle, Coins, History, ArrowUpRight } from "lucide-react";

const PAYMENT_SYSTEMS = [
  { id: "Stripe", label: "Stripe" },
  { id: "Bkash", label: "Bkash" },
  { id: "Nagad", label: "Nagad" },
  { id: "Rocket", label: "Rocket" },
];

export default function WithdrawalsPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [totalRaised, setTotalRaised] = useState(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [availableCredits, setAvailableCredits] = useState(0);
  const [withdrawals, setWithdrawals] = useState([]);

  const [credits, setCredits] = useState("");
  const [paymentSystem, setPaymentSystem] = useState("Stripe");
  const [accountNumber, setAccountNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const usdAmount = credits ? (Number(credits) / 20).toFixed(2) : "0.00";

  const fetchData = async () => {
    try {
      const res = await fetch("/api/creator/withdrawals");
      const data = await res.json();
      if (data.success) {
        setTotalRaised(data.totalRaised);
        setTotalWithdrawn(data.totalWithdrawn);
        setAvailableCredits(data.availableCredits);
        setWithdrawals(data.withdrawals);
      }
    } catch (err) {
      console.error("Fetch withdrawals error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchData();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const creditsNum = Number(credits);
    if (!credits || !accountNumber) {
      setError("All fields are required.");
      return;
    }
    if (creditsNum < 200) {
      setError("Minimum withdrawal is 200 credits ($10 USD).");
      return;
    }
    if (creditsNum > availableCredits) {
      setError("Cannot withdraw more than available credits.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/creator/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credits: creditsNum,
          payment_system: paymentSystem,
          account_number: accountNumber,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Withdrawal failed.");

      setSuccess("Withdrawal request submitted! Admin will review it shortly.");
      setCredits("");
      setAccountNumber("");
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const statusColor = (s) => {
    if (s === "approved") return "text-green-700 bg-green-50/50 border-green-200";
    return "text-amber-700 bg-amber-50/50 border-amber-200";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Spinner size="lg" color="warning" label="Loading withdrawal data..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div>
        <h1 className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">Withdrawals</h1>
        <p className="text-[#645d52] text-xs font-bold uppercase tracking-[0.14em] mt-1">
          Request fund withdrawals from your campaign earnings. 20 Credits = $1 USD.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
          <Card.Content className="p-6 text-center">
            <p className="text-[#645d52] text-[10px] font-bold uppercase tracking-[0.12em] mb-2">Total Raised</p>
            <span className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">{totalRaised} Cr</span>
            <p className="text-[#776f63] text-[10px] font-bold mt-1">${(totalRaised / 20).toFixed(2)} USD</p>
          </Card.Content>
        </Card>
        <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
          <Card.Content className="p-6 text-center">
            <p className="text-[#645d52] text-[10px] font-bold uppercase tracking-[0.12em] mb-2">Withdrawn / Pending</p>
            <span className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">{totalWithdrawn} Cr</span>
            <p className="text-[#776f63] text-[10px] font-bold mt-1">${(totalWithdrawn / 20).toFixed(2)} USD</p>
          </Card.Content>
        </Card>
        <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
          <Card.Content className="p-6 text-center">
            <p className="text-[#645d52] text-[10px] font-bold uppercase tracking-[0.12em] mb-2">Available</p>
            <span className="font-serif text-3xl tracking-[-0.04em] text-[#15803d]">{availableCredits} Cr</span>
            <p className="text-[#776f63] text-[10px] font-bold mt-1">${(availableCredits / 20).toFixed(2)} USD</p>
          </Card.Content>
        </Card>
      </div>

      {/* Withdrawal Form */}
      <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
        <Card.Content className="p-6">
          <h2 className="font-serif text-xl text-[#24231f] mb-5">Request Withdrawal</h2>

          {availableCredits < 200 && (
            <div className="mb-5 p-4 border border-amber-200 bg-amber-50/50 text-amber-700 text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-none">
              <AlertTriangle size={14} />
              Insufficient credits. Minimum 200 credits ($10 USD) required for withdrawal.
            </div>
          )}

          {error && (
            <div className="mb-5 p-4 border border-red-200 bg-red-50/50 text-red-700 text-xs font-bold uppercase tracking-wider rounded-none">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 p-4 border border-green-200 bg-green-50/50 text-green-700 text-xs font-bold uppercase tracking-wider rounded-none">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#565148]">
                  Credits to Withdraw
                </label>
                <input
                  required
                  type="number"
                  placeholder="Min 200"
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                  className="w-full px-3.5 py-3 border border-[#bfb5a3] bg-[#f4f0e8]/50 text-sm text-[#24231f] focus:outline-none focus:border-[#9a3412] focus:bg-[#fdfaf4] transition-all font-semibold rounded-none disabled:opacity-50"
                  min={200}
                  max={availableCredits}
                  disabled={availableCredits < 200}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#565148]">
                  Withdraw Amount ($)
                </label>
                <div className="relative flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-[#bfb5a3] bg-[#ebe3d5] text-[#24231f] font-bold rounded-none">
                    $
                  </span>
                  <input
                    readOnly
                    value={usdAmount}
                    className="w-full px-3.5 py-3 border border-[#bfb5a3] bg-[#ebe3d5]/40 text-sm text-[#24231f] focus:outline-none font-bold rounded-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <Select
                selectedKeys={[paymentSystem]}
                onSelectionChange={(keys) => {
                  const val = Array.from(keys)[0];
                  if (val) setPaymentSystem(val);
                }}
                className="w-full"
                isDisabled={availableCredits < 200}
              >
                <Label className="text-xs font-bold uppercase tracking-wider text-[#565148] mb-1">
                  Payment System
                </Label>
                <Select.Trigger className="w-full flex items-center justify-between border border-[#bfb5a3] bg-[#f4f0e8]/50 px-3.5 h-11 text-sm font-semibold rounded-none text-[#24231f] hover:bg-[#ebe3d5]/30 transition-all disabled:opacity-50">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox className="bg-[#fdfaf4] border border-[#bfb5a3] shadow-lg p-1 rounded-none">
                    {PAYMENT_SYSTEMS.map((ps) => (
                      <ListBox.Item
                        key={ps.id}
                        id={ps.id}
                        textValue={ps.label}
                        className="px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#ebe3d5] text-[#24231f] rounded-none"
                      >
                        {ps.label}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#565148]">
                {paymentSystem === "Stripe" ? "Stripe Account Email" : "Account Number"} <span className="text-[#9a3412]">*</span>
              </label>
              <input
                required
                type={paymentSystem === "Stripe" ? "email" : "text"}
                placeholder={paymentSystem === "Stripe" ? "e.g. stripe@yourdomain.com" : "e.g. Bkash / Nagad wallet number"}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3.5 py-3 border border-[#bfb5a3] bg-[#f4f0e8]/50 text-sm text-[#24231f] focus:outline-none focus:border-[#9a3412] focus:bg-[#fdfaf4] transition-all font-semibold rounded-none disabled:opacity-50"
                disabled={availableCredits < 200}
              />
            </div>

            {availableCredits < 200 ? (
              <div className="w-full text-center py-3.5 border border-red-200 bg-red-50/50 text-red-700 font-extrabold uppercase text-xs tracking-wider rounded-none select-none">
                Insufficient credit
              </div>
            ) : (
              <Button
                type="submit"
                className="w-full h-12 bg-[#9a3412] hover:bg-[#b45309] text-[#f7f0e3] font-bold uppercase tracking-wider text-xs rounded-none mt-2 transition-all shadow-[2px_2px_0_#24231f]"
                isLoading={submitting}
              >
                Submit Withdrawal Request
              </Button>
            )}
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}
