"use client";

import React from "react";
import { Card } from "@heroui/react";

export default function AddCampaignPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
          Add New Campaign
        </h1>
        <p className="text-zinc-500 text-xs mt-1">Design and launch your crowdfunding campaign.</p>
      </div>

      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <Card.Content className="p-8">
          <p className="text-sm text-zinc-700 dark:text-zinc-350">
            Submit campaign details including title, funding goal, categories, and cover photo for admin review.
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}
