"use client";

import React from "react";
import { Card } from "@heroui/react";

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
          Reports
        </h1>
        <p className="text-zinc-500 text-xs mt-1">Platform analytics and performance reports.</p>
      </div>

      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <Card.Content className="p-8">
          <p className="text-sm text-zinc-700 dark:text-zinc-350">
            Generate and view detailed reports on platform metrics, user growth, and funding trends.
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}
