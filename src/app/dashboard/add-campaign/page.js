"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import { Card, Input, Button, Link, Select, Label, ListBox } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { PlusCircle, Upload, Image as ImageIcon } from "lucide-react";

const CATEGORIES = [
  { id: "Technology", label: "Technology" },
  { id: "Art", label: "Art" },
  { id: "Community", label: "Community" },
  { id: "Health", label: "Health" },
];

export default function AddCampaignPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [category, setCategory] = useState("Technology");
  const [fundingGoal, setFundingGoal] = useState("");
  const [minContribution, setMinContribution] = useState("");
  const [deadline, setDeadline] = useState("");
  const [rewardInfo, setRewardInfo] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY || "demo"}`,
        { method: "POST", body: formData }
      );
      const data = await res.json();

      if (data.success) {
        setImageUrl(data.data.url);
        setImagePreview(data.data.url);
      } else {
        setError("Image upload failed. Please paste a URL instead.");
      }
    } catch (err) {
      console.error("ImgBB upload error:", err);
      setError("Image upload failed. Please paste a URL instead.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !story || !category || !fundingGoal || !minContribution || !deadline) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/creator/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          story,
          category,
          funding_goal: Number(fundingGoal),
          minimum_contribution: Number(minContribution),
          deadline,
          reward_info: rewardInfo,
          image_url: imageUrl || imagePreview,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create campaign.");

      setSuccess("Campaign submitted successfully! It is now pending admin approval.");
      // Reset form
      setTitle("");
      setStory("");
      setFundingGoal("");
      setMinContribution("");
      setDeadline("");
      setRewardInfo("");
      setImageUrl("");
      setImagePreview("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
          Add New Campaign
        </h1>
        <p className="text-zinc-500 text-xs mt-1">
          Fill in the details below to submit your campaign for admin review.
        </p>
      </div>

      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <Card.Content className="p-8">
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-medium border border-red-100 dark:border-red-900/30">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 text-xs font-medium border border-green-100 dark:border-green-900/30">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              isRequired
              label="Campaign Title"
              placeholder="Enter a compelling title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="bordered"
            />

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Campaign Story <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                placeholder="Tell your story. Why should supporters fund this campaign?"
                value={story}
                onChange={(e) => setStory(e.target.value)}
                rows={5}
                className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-medium bg-transparent text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-blue-500 resize-y transition-colors placeholder:text-zinc-400"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Select
                selectedKeys={[category]}
                onSelectionChange={(keys) => {
                  const val = Array.from(keys)[0];
                  if (val) setCategory(val);
                }}
                className="w-full"
              >
                <Label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select.Trigger className="w-full flex items-center justify-between border border-zinc-200 dark:border-zinc-800 rounded-medium px-3 h-10 bg-transparent text-sm hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-medium shadow-lg p-1">
                    {CATEGORIES.map((cat) => (
                      <ListBox.Item
                        key={cat.id}
                        id={cat.id}
                        textValue={cat.label}
                        className="px-3 py-2 rounded-small text-sm cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        {cat.label}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                isRequired
                type="number"
                label="Funding Goal (Credits)"
                placeholder="e.g. 5000"
                value={fundingGoal}
                onChange={(e) => setFundingGoal(e.target.value)}
                variant="bordered"
                min={1}
              />
              <Input
                isRequired
                type="number"
                label="Min Contribution (Credits)"
                placeholder="e.g. 10"
                value={minContribution}
                onChange={(e) => setMinContribution(e.target.value)}
                variant="bordered"
                min={1}
              />
            </div>

            <Input
              isRequired
              type="date"
              label="Deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              variant="bordered"
            />

            <Input
              label="Reward Info"
              placeholder="Describe what backers will receive"
              value={rewardInfo}
              onChange={(e) => setRewardInfo(e.target.value)}
              variant="bordered"
            />

            {/* Image upload section */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Campaign Cover Image
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="url"
                  placeholder="Paste image URL or upload below"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImagePreview(e.target.value);
                  }}
                  variant="bordered"
                  startContent={<ImageIcon size={16} className="text-zinc-400" />}
                  className="flex-1"
                />
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <Button
                    type="button"
                    variant="bordered"
                    size="sm"
                    className="h-10 font-semibold text-xs"
                    isLoading={uploading}
                    startContent={!uploading && <Upload size={14} />}
                  >
                    Upload to ImgBB
                  </Button>
                </div>
              </div>
              {imagePreview && (
                <div className="relative w-full h-48 rounded-medium overflow-hidden border border-zinc-200 dark:border-zinc-800">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => setImagePreview("")}
                  />
                </div>
              )}
            </div>

            <Button
              type="submit"
              color="primary"
              className="w-full font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white h-11 mt-2"
              isLoading={loading}
              startContent={!loading && <PlusCircle size={18} />}
            >
              Submit Campaign for Review
            </Button>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}
