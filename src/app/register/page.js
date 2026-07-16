"use client";

import React, { useState } from "react";
import { Card, Input, Button, Link, Select, Label, ListBox } from "@heroui/react";
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
    <div className="flex-1 flex items-center justify-center py-20 px-4 bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
      <Card className="w-full max-w-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl">
        <Card.Content className="p-8">
          <div className="flex flex-col items-center mb-8 text-center">
            <Link
              href="/"
              className="font-extrabold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-2"
            >
              Crowdfunding
            </Link>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-white">Create an account</h2>
            <p className="text-zinc-500 text-sm mt-1">
              Start raising funds or backing creative ideas today
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-medium border border-red-100 dark:border-red-900/30">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              isRequired
              type="text"
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              startContent={<User className="text-zinc-450" size={18} />}
              variant="bordered"
            />

            <Input
              isRequired
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={isEmailInvalid}
              errorMessage={isEmailInvalid && "Please enter a valid email address"}
              startContent={<Mail className="text-zinc-450" size={18} />}
              variant="bordered"
              color={isEmailInvalid ? "danger" : "default"}
            />

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Profile Picture URL or Upload
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="url"
                    placeholder="Paste image URL or upload to the right"
                    value={photoURL}
                    onChange={(e) => {
                      setPhotoURL(e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    startContent={<ImageIcon className="text-zinc-450" size={18} />}
                    variant="bordered"
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
                    className="h-10 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors rounded-medium"
                    isLoading={uploading}
                    startContent={!uploading && <Upload size={14} />}
                  >
                    Upload Image
                  </Button>
                </div>
              </div>
              {imagePreview && (
                <div className="relative w-full h-32 border border-zinc-200 dark:border-zinc-800 rounded-medium overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => setImagePreview("")}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Input
                isRequired
                type="password"
                label="Password"
                placeholder="Min 6 chars · mix letters & numbers"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={isPasswordWeak}
                errorMessage={
                  isPasswordWeak
                    ? "Use at least 6 characters; stronger passwords mix letters and numbers."
                    : undefined
                }
                startContent={<Lock className="text-zinc-450" size={18} />}
                variant="bordered"
                color={isPasswordWeak ? "danger" : "default"}
              />
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

          <p className="text-center text-sm text-zinc-550 mt-8">
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
