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
    <div className="flex-1 flex items-center justify-center py-6 sm:py-8 px-4 bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
      <Card className="w-full max-w-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl">
        <Card.Content className="p-5 sm:p-6">
          <div className="flex flex-col items-center mb-4 text-center">
            <Link
              href="/"
              className="font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-1"
            >
              Crowdfunding
            </Link>
            <h2 className="text-lg font-bold text-zinc-800 dark:text-white">Create an account</h2>
            <p className="text-zinc-500 text-xs mt-0.5">
              Start raising funds or backing creative ideas today
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-medium border border-red-100 dark:border-red-900/30">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1 text-left">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 px-0.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  required
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 pl-10 pr-3 border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm rounded-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-400 text-zinc-800 dark:text-zinc-100"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  <User size={18} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1 text-left">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 px-0.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  required
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full h-10 pl-10 pr-3 border bg-transparent text-sm rounded-medium focus:outline-none focus:ring-1 transition-all placeholder:text-zinc-400 text-zinc-800 dark:text-zinc-100 ${
                    isEmailInvalid
                      ? "border-danger focus:border-danger focus:ring-danger"
                      : "border-zinc-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
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
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 px-0.5">
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
                    className="w-full h-10 pl-10 pr-3 border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm rounded-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-400 text-zinc-800 dark:text-zinc-100"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
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
                    className="h-10 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors rounded-medium"
                    isLoading={uploading}
                    startContent={!uploading && <Upload size={14} />}
                  >
                    Upload
                  </Button>
                </div>
                {imagePreview && (
                  <div className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 overflow-hidden shrink-0">
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
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 px-0.5">
                Password
              </label>
              <div className="relative">
                <input
                  required
                  type="password"
                  placeholder="Min 6 chars · mix letters & numbers"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full h-10 pl-10 pr-3 border bg-transparent text-sm rounded-medium focus:outline-none focus:ring-1 transition-all placeholder:text-zinc-400 text-zinc-800 dark:text-zinc-100 ${
                    isPasswordWeak
                      ? "border-danger focus:border-danger focus:ring-danger"
                      : "border-zinc-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  <Lock size={18} />
                </div>
              </div>
            {isPasswordWeak && (
              <p className="text-[11px] text-danger font-semibold mt-0.5 px-1">
                Use at least 6 characters; stronger passwords mix letters and numbers.
              </p>
            )}
              {password && (
                <div className="px-1 flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-zinc-400">Password Strength:</span>
                    <span className={strength.text}>{strength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-150 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${(strength.score / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Select
                selectedKeys={[role]}
                onSelectionChange={(keys) => {
                  const val = Array.from(keys)[0];
                  if (val) setRole(val);
                }}
                className="w-full"
              >
                <Label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                  Select Role
                </Label>
                <Select.Trigger className="w-full flex items-center justify-between border border-zinc-200 dark:border-zinc-800 rounded-medium px-3 h-10 bg-transparent text-sm hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors">
                  <div className="flex items-center gap-2">
                    <UserCheck className="text-zinc-400" size={18} />
                    <Select.Value />
                  </div>
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-medium shadow-lg p-1">
                    <ListBox.Item
                      id="Supporter"
                      textValue="Supporter"
                      className="px-3 py-2 rounded-small text-sm cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-750 dark:text-zinc-300"
                    >
                      Supporter (Starts with 50 credits)
                    </ListBox.Item>
                    <ListBox.Item
                      id="Creator"
                      textValue="Creator"
                      className="px-3 py-2 rounded-small text-sm cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-750 dark:text-zinc-300"
                    >
                      Creator (Starts with 20 credits)
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            <Button
              type="submit"
              color="primary"
              className="w-full font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white mt-2 h-11"
              isLoading={loading}
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-zinc-550 mt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}
