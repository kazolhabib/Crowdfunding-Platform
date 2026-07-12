"use client";

import React, { useState, useEffect } from "react";
import { Card, Input, Button, Spinner, Select, Label, ListBox } from "@heroui/react";
import { DollarSign, AlertTriangle } from "lucide-react";

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
    fetchData();
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
    if (s === "approved") return "text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400";
    return "text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Spinner size="lg" color="primary" label="Loading withdrawal data..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">Withdrawals</h1>
        <p className="text-zinc-500 text-xs mt-1">
          Request fund withdrawals from your campaign earnings. 20 Credits = $1 USD.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <Card.Content className="p-5 text-center">
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Total Raised</p>
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">{totalRaised} Cr</span>
            <p className="text-zinc-400 text-[10px]">${(totalRaised / 20).toFixed(2)} USD</p>
          </Card.Content>
        </Card>
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <Card.Content className="p-5 text-center">
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Withdrawn / Pending</p>
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">{totalWithdrawn} Cr</span>
            <p className="text-zinc-400 text-[10px]">${(totalWithdrawn / 20).toFixed(2)} USD</p>
          </Card.Content>
        </Card>
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <Card.Content className="p-5 text-center">
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Available</p>
            <span className="text-2xl font-extrabold text-green-600 dark:text-green-400">{availableCredits} Cr</span>
            <p className="text-zinc-400 text-[10px]">${(availableCredits / 20).toFixed(2)} USD</p>
          </Card.Content>
        </Card>
      </div>

      {/* Withdrawal Form */}
      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <Card.Content className="p-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-5">Request Withdrawal</h2>

          {availableCredits < 200 && (
            <div className="mb-5 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-xs font-medium border border-amber-100 dark:border-amber-900/30 flex items-center gap-2">
              <AlertTriangle size={14} />
              Insufficient credits. Minimum 200 credits ($10 USD) required for withdrawal.
            </div>
          )}

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-medium border border-red-100 dark:border-red-900/30">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 text-xs font-medium border border-green-100 dark:border-green-900/30">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                isRequired
                type="number"
                label="Credits to Withdraw"
                placeholder="Min 200"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                variant="bordered"
                min={200}
                max={availableCredits}
                isDisabled={availableCredits < 200}
              />
              <Input
                isReadOnly
                label="Withdraw Amount ($)"
                value={`$${usdAmount}`}
                variant="bordered"
                startContent={<DollarSign size={16} className="text-green-500" />}
              />
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
                <Label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                  Payment System
                </Label>
                <Select.Trigger className="w-full flex items-center justify-between border border-zinc-200 dark:border-zinc-800 rounded-medium px-3 h-10 bg-transparent text-sm hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-medium shadow-lg p-1">
                    {PAYMENT_SYSTEMS.map((ps) => (
                      <ListBox.Item
                        key={ps.id}
                        id={ps.id}
                        textValue={ps.label}
                        className="px-3 py-2 rounded-small text-sm cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        {ps.label}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            <Input
              isRequired
              label="Account Number"
              placeholder="Enter your account/wallet number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              variant="bordered"
              isDisabled={availableCredits < 200}
            />

            <Button
              type="submit"
              color="primary"
              className="w-full font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white h-11 mt-2"
              isLoading={submitting}
              isDisabled={availableCredits < 200}
            >
              Submit Withdrawal Request
            </Button>
          </form>
        </Card.Content>
      </Card>

      {/* Withdrawal History */}
      {withdrawals.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Withdrawal History</h2>
          <div className="overflow-x-auto rounded-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-left">
                  <th className="px-4 py-3 font-bold text-xs text-zinc-500 uppercase tracking-wider">Credits</th>
                  <th className="px-4 py-3 font-bold text-xs text-zinc-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 font-bold text-xs text-zinc-500 uppercase tracking-wider">Payment</th>
                  <th className="px-4 py-3 font-bold text-xs text-zinc-500 uppercase tracking-wider">Account</th>
                  <th className="px-4 py-3 font-bold text-xs text-zinc-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 font-bold text-xs text-zinc-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {withdrawals.map((w) => (
                  <tr key={w._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-zinc-800 dark:text-white">{w.withdrawal_credit}</td>
                    <td className="px-4 py-3 text-green-600 font-bold">${w.withdrawal_amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{w.payment_system}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{w.account_number}</td>
                    <td className="px-4 py-3 text-zinc-500 text-xs">
                      {new Date(w.withdraw_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColor(w.status)}`}>
                        {w.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
