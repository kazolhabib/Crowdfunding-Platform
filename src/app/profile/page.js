"use client";

import React, { useState } from "react";
import { Avatar, Button, Card } from "@heroui/react";
import { Check, ImagePlus, ShieldCheck, Upload, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const MAX_FILE_SIZE = 1_000_000;

export default function ProfilePage() {
  const { user, updateProfilePhoto } = useAuth();
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const hasProfilePhoto = Boolean(user?.photoURL) && !user.photoURL.includes("images.unsplash.com");

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setError("");
    setSuccess("");

    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Please choose an image smaller than 1 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result?.toString() || "");
    reader.readAsDataURL(file);
  };

  const savePhoto = async () => {
    if (!preview) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await updateProfilePhoto(preview);
      setPreview("");
      setSuccess("Profile picture saved successfully.");
    } catch (saveError) {
      setError(saveError.message || "Unable to save your picture.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const imageSource = preview || (hasProfilePhoto ? user.photoURL : "");

  return (
    <div className="min-h-[calc(100vh-10rem)] bg-[#f4f0e8] px-5 py-14 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9a3412]">Account settings</p>
        <h1 className="mt-3 font-serif text-5xl tracking-[-0.07em] text-[#24231f]">Your profile</h1>
        <p className="mt-3 max-w-lg text-sm leading-6 text-[#665e53]">Choose the image that represents you. Your profile picture only changes after you save it.</p>

        <Card className="mt-10 border border-[#d8cdbc] bg-[#fdfaf4] shadow-[10px_10px_0_#ded4c4]">
          <Card.Content className="grid gap-8 p-6 sm:p-9 md:grid-cols-[180px_1fr] md:items-center">
            <div className="flex flex-col items-center gap-4">
              <Avatar size="lg" className="h-36 w-36 rounded-[1.5rem] bg-[#24231f] text-[#f4f0e8] ring-4 ring-[#eadfce]">
                {imageSource && <Avatar.Image src={imageSource} alt={user.name} />}
                <Avatar.Fallback><UserRound size={48} strokeWidth={1.4} /></Avatar.Fallback>
              </Avatar>
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#786f63]">Profile preview</span>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[#24231f]"><ImagePlus size={20} className="text-[#9a3412]" /><h2 className="font-serif text-3xl tracking-[-0.05em]">Profile picture</h2></div>
              <p className="mt-3 text-sm leading-6 text-[#665e53]">Upload a JPG, PNG, or WebP file from your computer. Maximum file size: 1 MB.</p>
              <label className="mt-6 flex cursor-pointer items-center justify-between gap-4 border border-dashed border-[#b9ac99] bg-[#f7f0e3] p-4 transition-colors hover:border-[#9a3412] hover:bg-[#f4ead9]">
                <span className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center bg-[#24231f] text-[#f4f0e8]"><Upload size={18} /></span><span><span className="block text-sm font-bold text-[#24231f]">Choose image</span><span className="mt-0.5 block text-xs text-[#786f63]">Select a file from your computer</span></span></span>
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="sr-only" />
              </label>
              {error && <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>}
              {success && <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-700"><Check size={16} />{success}</p>}
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Button onPress={savePhoto} isDisabled={!preview} isLoading={saving} className="h-11 rounded-none bg-[#24231f] px-5 text-xs font-bold uppercase tracking-[0.12em] text-[#f4f0e8] hover:bg-[#9a3412]">Save picture</Button>
                <span className="flex items-center gap-1.5 text-xs text-[#786f63]"><ShieldCheck size={15} className="text-[#9a3412]" />Saved to your account</span>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
