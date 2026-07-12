"use client";

import React from "react";
import { Card } from "@heroui/react";

export default function ReviewContributionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
          Contributions to Review
        </h1>
        <p className="text-zinc-500 text-xs mt-1">Review and manage incoming supporter contributions.</p>
      </div>

      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <Card.Content className="p-8">
          <p className="text-sm text-zinc-700 dark:text-zinc-350">
            Accept or decline contributions from supporters backing your campaigns.
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}
