"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Card, Button, Spinner } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle, CreditCard, Coins } from "lucide-react";

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
        <h1 className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">
          Purchase Credit
        </h1>
        <p className="text-[#645d52] text-xs font-bold uppercase tracking-[0.14em] mt-1">
          Buy credits securely via Stripe to support your favorite campaigns.
        </p>
      </div>

      {message && (
        <Card className="border border-green-200 bg-green-50/50 rounded-none shadow-[2px_2px_0_#24231f]">
          <Card.Content className="p-4 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-green-700">
            <CheckCircle size={16} />
            {message}
          </Card.Content>
        </Card>
      )}

      {error && (
        <Card className="border border-red-200 bg-red-50/50 rounded-none shadow-[2px_2px_0_#24231f]">
          <Card.Content className="p-4 text-xs font-bold uppercase tracking-wider text-red-700">
            {error}
          </Card.Content>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {PACKAGES.map((pkg) => (
          <Card
            key={pkg.id}
            className={`border rounded-none relative overflow-hidden bg-[#fdfaf4] ${
              pkg.popular
                ? "border-[#9a3412] shadow-[6px_6px_0_#24231f]"
                : "border-[#bfb5a3] shadow-[4px_4px_0_#24231f]"
            }`}
          >
            {pkg.popular && (
              <div className="absolute top-0 right-0 bg-[#9a3412] text-[#f7f0e3] text-[9px] font-bold px-3 py-1 uppercase tracking-wider">
                Best Value
              </div>
            )}
            <Card.Content className="p-6 flex flex-col items-center gap-4 text-center">
              <div className="p-3 bg-[#ebe3d5] text-[#9a3412] border border-[#bfb5a3] rounded-none">
                <Coins size={24} />
              </div>
              <div>
                <p className="font-serif text-4xl tracking-[-0.04em] text-[#24231f]">
                  {pkg.credits}
                </p>
                <p className="text-[#645d52] text-[10px] font-bold uppercase tracking-wider mt-1">
                  Credits
                </p>
              </div>
              <p className="font-serif text-2xl text-[#9a3412]">
                ${pkg.amountUsd}
              </p>
              <Button
                className="w-full h-11 bg-[#9a3412] hover:bg-[#b45309] text-[#f7f0e3] font-bold uppercase tracking-wider text-xs rounded-none transition-all shadow-[2px_2px_0_#24231f]"
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
          <Spinner size="lg" color="warning" label="Loading packages..." />
        </div>
      }
    >
      <PurchaseCreditContent />
    </Suspense>
  );
}
