"use client";

import React, { useState } from "react";
import { Card, Input, Button, Select, Label, ListBox } from "@heroui/react";
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
        <h1 className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">
          Add New Campaign
        </h1>
        <p className="text-[#645d52] text-xs font-bold uppercase tracking-[0.14em] mt-1">
          Fill in the details below to submit your campaign for admin review.
        </p>
      </div>

      <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
        <Card.Content className="p-8">
          {error && (
            <div className="mb-6 p-4 border border-red-200 bg-red-50/50 text-red-700 text-xs font-bold uppercase tracking-wider rounded-none">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 border border-green-200 bg-green-50/50 text-green-700 text-xs font-bold uppercase tracking-wider rounded-none">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#565148]">
                Campaign Title <span className="text-[#9a3412]">*</span>
              </label>
              <input
                required
                type="text"
                placeholder="Enter a compelling title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-3 border border-[#bfb5a3] bg-[#f4f0e8]/50 text-sm text-[#24231f] focus:outline-none focus:border-[#9a3412] focus:bg-[#fdfaf4] transition-all font-semibold rounded-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#565148]">
                Campaign Story <span className="text-[#9a3412]">*</span>
              </label>
              <textarea
                required
                placeholder="Tell your story. Why should supporters fund this campaign?"
                value={story}
                onChange={(e) => setStory(e.target.value)}
                rows={5}
                className="w-full px-3.5 py-3 border border-[#bfb5a3] bg-[#f4f0e8]/50 text-sm text-[#24231f] focus:outline-none focus:border-[#9a3412] focus:bg-[#fdfaf4] resize-y transition-all font-semibold rounded-none"
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
                <Label className="text-xs font-bold uppercase tracking-wider text-[#565148] mb-1">
                  Category <span className="text-[#9a3412]">*</span>
                </Label>
                <Select.Trigger className="w-full flex items-center justify-between border border-[#bfb5a3] bg-[#f4f0e8]/50 px-3.5 h-11 text-sm font-semibold rounded-none text-[#24231f] hover:bg-[#ebe3d5]/30 transition-all">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox className="bg-[#fdfaf4] border border-[#bfb5a3] shadow-lg p-1 rounded-none">
                    {CATEGORIES.map((cat) => (
                      <ListBox.Item
                        key={cat.id}
                        id={cat.id}
                        textValue={cat.label}
                        className="px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#ebe3d5] text-[#24231f] rounded-none"
                      >
                        {cat.label}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#565148]">
                  Funding Goal (Credits) <span className="text-[#9a3412]">*</span>
                </label>
                <input
                  required
                  type="number"
                  placeholder="e.g. 5000"
                  value={fundingGoal}
                  onChange={(e) => setFundingGoal(e.target.value)}
                  className="w-full px-3.5 py-3 border border-[#bfb5a3] bg-[#f4f0e8]/50 text-sm text-[#24231f] focus:outline-none focus:border-[#9a3412] focus:bg-[#fdfaf4] transition-all font-semibold rounded-none"
                  min={1}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#565148]">
                  Min Contribution (Credits) <span className="text-[#9a3412]">*</span>
                </label>
                <input
                  required
                  type="number"
                  placeholder="e.g. 10"
                  value={minContribution}
                  onChange={(e) => setMinContribution(e.target.value)}
                  className="w-full px-3.5 py-3 border border-[#bfb5a3] bg-[#f4f0e8]/50 text-sm text-[#24231f] focus:outline-none focus:border-[#9a3412] focus:bg-[#fdfaf4] transition-all font-semibold rounded-none"
                  min={1}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#565148]">
                Deadline <span className="text-[#9a3412]">*</span>
              </label>
              <input
                required
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-3 border border-[#bfb5a3] bg-[#f4f0e8]/50 text-sm text-[#24231f] focus:outline-none focus:border-[#9a3412] focus:bg-[#fdfaf4] transition-all font-semibold rounded-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#565148]">
                Reward Info
              </label>
              <input
                type="text"
                placeholder="Describe what backers will receive"
                value={rewardInfo}
                onChange={(e) => setRewardInfo(e.target.value)}
                className="w-full px-3.5 py-3 border border-[#bfb5a3] bg-[#f4f0e8]/50 text-sm text-[#24231f] focus:outline-none focus:border-[#9a3412] focus:bg-[#fdfaf4] transition-all font-semibold rounded-none"
              />
            </div>

            {/* Image upload section */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#565148]">
                Campaign Cover Image
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-[#bfb5a3] bg-[#ebe3d5] text-[#776f63] rounded-none">
                    <ImageIcon size={16} />
                  </span>
                  <input
                    type="url"
                    placeholder="Paste image URL or upload to the right"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    className="w-full px-3.5 py-3 border border-[#bfb5a3] bg-[#f4f0e8]/50 text-sm text-[#24231f] focus:outline-none focus:border-[#9a3412] focus:bg-[#fdfaf4] transition-all font-semibold rounded-none"
                  />
                </div>
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
                    className="h-[46px] border border-[#bfb5a3] bg-[#ebe3d5] text-[#24231f] font-bold text-xs uppercase tracking-wider rounded-none hover:bg-[#24231f] hover:text-[#f4f0e8] transition-all"
                    isLoading={uploading}
                    startContent={!uploading && <Upload size={14} />}
                  >
                    Upload Image
                  </Button>
                </div>
              </div>
              {imagePreview && (
                <div className="relative w-full h-48 border border-[#bfb5a3] rounded-none overflow-hidden">
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
              className="w-full h-12 bg-[#9a3412] hover:bg-[#b45309] text-[#f7f0e3] font-bold uppercase tracking-wider text-xs rounded-none mt-2 transition-all shadow-[2px_2px_0_#24231f]"
              isLoading={loading}
              startContent={!loading && <PlusCircle size={16} />}
            >
              Submit Campaign for Review
            </Button>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}
