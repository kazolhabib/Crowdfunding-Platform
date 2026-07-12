"use client";

import React from "react";
import { Card } from "@heroui/react";

export default function MyCampaignsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
          My Campaigns
        </h1>
        <p className="text-zinc-500 text-xs mt-1">Manage all campaigns you have created.</p>
      </div>

      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <Card.Content className="p-8">
          <p className="text-sm text-zinc-700 dark:text-zinc-350">
            View, edit, and monitor the performance of your active and past campaigns.
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}
