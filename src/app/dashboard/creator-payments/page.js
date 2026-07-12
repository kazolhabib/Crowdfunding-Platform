"use client";

import React from "react";
import { Card } from "@heroui/react";

export default function CreatorPaymentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
          Payment History
        </h1>
        <p className="text-zinc-500 text-xs mt-1">View your complete payout and transaction records.</p>
      </div>

      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <Card.Content className="p-8">
          <p className="text-sm text-zinc-700 dark:text-zinc-350">
            Track all withdrawal payouts, cleared contributions, and fee deductions.
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}
