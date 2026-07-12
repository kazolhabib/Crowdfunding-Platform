"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Card, Button, Spinner } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle, CreditCard } from "lucide-react";

const PACKAGES = [
  { id: "tier1", credits: 100, amountUsd: 10, popular: false },
  { id: "tier2", credits: 300, amountUsd: 25, popular: true },
  { id: "tier3", credits: 800, amountUsd: 60, popular: false },
  { id: "tier4", credits: 1500, amountUsd: 110, popular: false },
];

function PurchaseCreditContent() {
  const { refreshSession } = useAuth();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    const sessionId = searchParams.get("session_id");

    if (canceled === "true") {
      const timeoutId = setTimeout(() => {
        setError("Payment was canceled. No credits were charged.");
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    if (success === "true" && sessionId) {
      const verifyPayment = async () => {
        try {
          const res = await fetch("/api/supporter/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          });
          const data = await res.json();
          if (data.success) {
            await refreshSession();
            setMessage(
              data.alreadyProcessed
                ? "Payment already processed. Your credits are up to date."
                : `Payment successful! ${data.creditsAdded} credits added to your account.`
            );
          } else {
            setError(data.error || "Failed to verify payment.");
          }
        } catch (err) {
          console.error("Verify payment error:", err);
          setError("Failed to verify payment. Credits may take a moment to appear.");
        }
      };
      void verifyPayment();
    }
  }, [searchParams, refreshSession]);

  const handlePurchase = async (packageId) => {
    setLoading(packageId);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/supporter/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });
      const data = await res.json();
      if (data.success && data.url) {
        window.location.assign(data.url);
      } else {
        setError(data.error || "Failed to start checkout.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Failed to connect to payment service. Is the backend server running?");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
          Purchase Credit
        </h1>
        <p className="text-zinc-500 text-xs mt-1">
          Buy credits securely via Stripe to support your favorite campaigns.
        </p>
      </div>

      {message && (
        <Card className="border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30">
          <Card.Content className="p-4 flex items-center gap-3 text-sm text-green-700 dark:text-green-300">
            <CheckCircle size={18} />
            {message}
          </Card.Content>
        </Card>
      )}

      {error && (
        <Card className="border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30">
          <Card.Content className="p-4 text-sm text-red-700 dark:text-red-300">{error}</Card.Content>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {PACKAGES.map((pkg) => (
          <Card
            key={pkg.id}
            className={`border bg-white dark:bg-zinc-900 shadow-sm relative overflow-hidden ${
              pkg.popular
                ? "border-indigo-300 dark:border-indigo-700 ring-2 ring-indigo-500/20"
                : "border-zinc-200 dark:border-zinc-800"
            }`}
          >
            {pkg.popular && (
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                Best Value
              </div>
            )}
            <Card.Content className="p-6 flex flex-col items-center gap-4 text-center">
              <div className="p-3 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                <CreditCard size={24} />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                  {pkg.credits}
                </p>
                <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mt-1">
                  Credits
                </p>
              </div>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                ${pkg.amountUsd}
              </p>
              <Button
                color="primary"
                className="w-full font-semibold"
                isLoading={loading === pkg.id}
                onPress={() => handlePurchase(pkg.id)}
              >
                Buy Now
              </Button>
            </Card.Content>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function PurchaseCreditPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[40vh]">
          <Spinner size="lg" color="primary" label="Loading..." />
        </div>
      }
    >
      <PurchaseCreditContent />
    </Suspense>
  );
}
