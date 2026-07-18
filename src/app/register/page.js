"use client";

import React, { useState } from "react";
import { Card, Input, Button, Select, Label, ListBox } from "@heroui/react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Image as ImageIcon, UserCheck, Upload } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Supporter");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Live email validation
  const validateEmail = (value) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);
  const isEmailInvalid = email !== "" && !validateEmail(email);

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "None", color: "bg-zinc-200", text: "text-zinc-400" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Za-z]/.test(pass) && /\d/.test(pass)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score += 1;

    if (score <= 1) return { score, label: "Weak", color: "bg-red-500", text: "text-red-500" };
    if (score === 2) return { score, label: "Fair", color: "bg-orange-500", text: "text-orange-500" };
    if (score === 3) return { score, label: "Good", color: "bg-blue-500", text: "text-blue-500" };
    return { score, label: "Strong", color: "bg-green-500", text: "text-green-500" };
  };

  const strength = getPasswordStrength(password);
  const isPasswordWeak = password !== "" && (password.length < 6 || strength.score < 2);

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
        setPhotoURL(data.data.url);
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
    if (!name || !email || !password || !role || isEmailInvalid) {
      setError("Please fill in all fields correctly.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (strength.score < 2) {
      setError("Password is too weak. Use at least 8 characters, or mix letters and numbers.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await register({ name, email, photoURL, password, role });
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-6 sm:py-8 px-4 bg-[#f4f0e8] dark:bg-zinc-950">
      <Card className="w-full max-w-md border-2 border-[#24231f] bg-[#fdfaf4] dark:bg-zinc-900 shadow-[4px_4px_0_#24231f] rounded-none">
        <Card.Content className="p-5 sm:p-6">
          <div className="flex flex-col items-center mb-4 text-center">
            <Link
              href="/"
              className="font-extrabold text-2xl text-[#24231f] dark:text-[#f7f0e3] mb-1 font-mono tracking-tighter"
            >
              Crowdfunding
            </Link>
            <h2 className="text-sm font-bold text-[#565148] dark:text-zinc-400 uppercase tracking-widest">Create an account</h2>
            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">
              Start raising funds or backing creative ideas today
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-semibold border-2 border-red-200 dark:border-red-900/30">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#565148] dark:text-zinc-400 px-0.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  required
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 pl-10 pr-3 border border-[#bfb5a3] bg-[#f4f0e8]/30 dark:bg-zinc-800/40 text-sm rounded-none focus:outline-none focus:border-[#9a3412] focus:bg-[#fdfaf4] transition-all placeholder:text-[#888173] text-[#24231f] dark:text-zinc-100 font-semibold"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#776f63]">
                  <User size={18} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#565148] dark:text-zinc-400 px-0.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  required
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full h-10 pl-10 pr-3 border bg-[#f4f0e8]/30 dark:bg-zinc-800/40 text-sm rounded-none focus:outline-none transition-all placeholder:text-[#888173] text-[#24231f] dark:text-zinc-100 font-semibold ${
                    isEmailInvalid
                      ? "border-danger focus:border-danger bg-red-50/10"
                      : "border-[#bfb5a3] focus:border-[#9a3412] focus:bg-[#fdfaf4]"
                  }`}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#776f63]">
                  <Mail size={18} />
                </div>
              </div>
            </div>
            {isEmailInvalid && (
              <p className="text-[11px] text-danger font-semibold mt-0.5 px-1">
                Please enter a valid email address
              </p>
            )}

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#565148] dark:text-zinc-400 px-0.5">
                Profile Picture URL or Upload
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="url"
                    placeholder="Paste image URL..."
                    value={photoURL}
                    onChange={(e) => {
                      setPhotoURL(e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    className="w-full h-10 pl-10 pr-3 border border-[#bfb5a3] bg-[#f4f0e8]/30 dark:bg-zinc-800/40 text-sm rounded-none focus:outline-none focus:border-[#9a3412] focus:bg-[#fdfaf4] transition-all placeholder:text-[#888173] text-[#24231f] dark:text-zinc-100 font-semibold"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#776f63]">
                    <ImageIcon size={18} />
                  </div>
                </div>
                <div className="relative shrink-0">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <Button
                    type="button"
                    variant="bordered"
                    className="h-10 border border-[#bfb5a3] dark:border-zinc-850 hover:bg-[#ebe3d5]/30 text-xs font-bold uppercase tracking-wider text-[#24231f] dark:text-zinc-200 transition-colors rounded-none shadow-[1px_1px_0_#24231f]"
                    isLoading={uploading}
                    startContent={!uploading && <Upload size={14} />}
                  >
                    Upload
                  </Button>
                </div>
                {imagePreview && (
                  <div className="w-10 h-10 rounded-full border border-[#bfb5a3] dark:border-zinc-800 overflow-hidden shrink-0">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setImagePreview("")}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#565148] dark:text-zinc-400 px-0.5">
                Password
              </label>
              <div className="relative">
                <input
                  required
                  type="password"
                  placeholder="Min 6 chars · mix letters & numbers"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full h-10 pl-10 pr-3 border bg-[#f4f0e8]/30 dark:bg-zinc-800/40 text-sm rounded-none focus:outline-none transition-all placeholder:text-[#888173] text-[#24231f] dark:text-zinc-100 font-semibold ${
                    isPasswordWeak
                      ? "border-danger focus:border-danger bg-red-50/10"
                      : "border-[#bfb5a3] focus:border-[#9a3412] focus:bg-[#fdfaf4]"
                  }`}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#776f63]">
                  <Lock size={18} />
                </div>
              </div>
            </div>
            {isPasswordWeak && (
              <p className="text-[11px] text-danger font-semibold mt-0.5 px-1">
                Use at least 6 characters; stronger passwords mix letters and numbers.
              </p>
            )}
            {password && (
              <div className="px-1 flex flex-col gap-1">
                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider">
                  <span className="text-[#776f63]">Password Strength:</span>
                  <span className={strength.text}>{strength.label}</span>
                </div>
                <div className="h-1.5 w-full bg-[#ebe3d5] dark:bg-zinc-850 rounded-none overflow-hidden">
                  <div
                    className={`h-full ${strength.color === "bg-red-500" ? "bg-red-600" : strength.color === "bg-orange-500" ? "bg-amber-600" : "bg-green-600"} transition-all duration-300`}
                    style={{ width: `${(strength.score / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <Select
                selectedKeys={[role]}
                onSelectionChange={(keys) => {
                  const val = typeof keys === "string" ? keys : Array.from(keys)[0];
                  if (val) setRole(val);
                }}
                className="w-full"
              >
                <Label className="text-[10px] font-bold uppercase tracking-wider text-[#565148] dark:text-zinc-400 mb-1">
                  Select Role
                </Label>
                <Select.Trigger className="w-full flex items-center justify-between border border-[#bfb5a3] dark:border-zinc-800 rounded-none px-3.5 h-10 bg-[#f4f0e8]/30 dark:bg-zinc-800/40 text-sm font-semibold hover:border-[#9a3412] focus:bg-[#fdfaf4] transition-colors text-[#24231f] dark:text-zinc-200">
                  <div className="flex items-center gap-2">
                    <UserCheck className="text-[#776f63]" size={18} />
                    <Select.Value />
                  </div>
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox className="bg-[#fdfaf4] dark:bg-zinc-900 border border-[#bfb5a3] dark:border-zinc-800 rounded-none shadow-lg p-1">
                    <ListBox.Item
                      id="Supporter"
                      textValue="Supporter"
                      className="px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#ebe3d5] text-[#24231f] dark:text-zinc-300 rounded-none"
                    >
                      Supporter (Starts with 50 credits)
                    </ListBox.Item>
                    <ListBox.Item
                      id="Creator"
                      textValue="Creator"
                      className="px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#ebe3d5] text-[#24231f] dark:text-zinc-300 rounded-none"
                    >
                      Creator (Starts with 20 credits)
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-[#9a3412] hover:bg-[#b45309] text-[#f7f0e3] font-bold uppercase tracking-wider text-xs rounded-none transition-all shadow-[2px_2px_0_#24231f] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none mt-2"
              isLoading={loading}
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-xs text-[#565148] dark:text-zinc-400 font-bold uppercase tracking-wider mt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#9a3412] dark:text-orange-400 hover:underline hover:text-[#b45309]"
            >
              Sign in here
            </Link>
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}
