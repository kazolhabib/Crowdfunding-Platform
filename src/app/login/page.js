"use client";

import React, { useState } from "react";
import { Card, Input, Button } from "@heroui/react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function LoginPage() {
  const { login, loginGoogle } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (value) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);
  const isEmailInvalid = email !== "" && !validateEmail(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || isEmailInvalid) {
      setError("Please fill in all fields correctly.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await login(email, password);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      setError("Google Sign-In did not return a credential. Please try again.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await loginGoogle({ googleCredential: credentialResponse.credential });
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err.message || "Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google Sign-In was cancelled or failed. Please try again.");
  };

  return (
    <div className="flex-1 flex items-center justify-center py-8 px-4 bg-[#f4f0e8] dark:bg-zinc-950">
      <Card className="w-full max-w-md border-2 border-[#24231f] bg-[#fdfaf4] dark:bg-zinc-900 shadow-[4px_4px_0_#24231f] rounded-none">
        <Card.Content className="p-5 sm:p-6">
          <div className="flex flex-col items-center mb-4 text-center">
            <Link
              href="/"
              className="font-extrabold text-2xl text-[#24231f] dark:text-[#f7f0e3] mb-1 font-mono tracking-tighter"
            >
              Crowdfunding
            </Link>
            <h2 className="text-sm font-bold text-[#565148] dark:text-zinc-400 uppercase tracking-widest">
              Welcome back
            </h2>
            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">
              Enter credentials to access your dashboard
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

            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#565148] dark:text-zinc-400 px-0.5">
                Password
              </label>
              <div className="relative">
                <input
                  required
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 pl-10 pr-3 border border-[#bfb5a3] bg-[#f4f0e8]/30 dark:bg-zinc-800/40 text-sm rounded-none focus:outline-none focus:border-[#9a3412] focus:bg-[#fdfaf4] transition-all placeholder:text-[#888173] text-[#24231f] dark:text-zinc-100 font-semibold"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#776f63]">
                  <Lock size={18} />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-[#9a3412] hover:bg-[#b45309] text-[#f7f0e3] font-bold uppercase tracking-wider text-xs rounded-none transition-all shadow-[2px_2px_0_#24231f] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none mt-2"
              isLoading={loading}
              startContent={!loading && <LogIn size={14} />}
            >
              Sign In
            </Button>

            <div className="relative flex items-center justify-center my-2">
              <div className="absolute border-t border-[#cfc6b7] dark:border-zinc-800 w-full" />
              <span className="relative px-3 bg-[#fdfaf4] dark:bg-zinc-900 text-[#776f63] text-[9px] font-bold uppercase tracking-wider">
                Or continue with
              </span>
            </div>

            {googleClientId ? (
              <div className="flex w-full justify-center min-h-[44px]">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap={false}
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="square"
                  width="360"
                />
              </div>
            ) : (
              <Button
                type="button"
                variant="bordered"
                className="w-full font-bold border border-[#bfb5a3] dark:border-zinc-800 rounded-none h-11 opacity-90 hover:bg-[#ebe3d5]/30 text-xs uppercase tracking-wider text-[#24231f] dark:text-zinc-200 transition-all shadow-[2px_2px_0_#24231f] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                startContent={<FaGoogle size={14} className="text-red-500 shrink-0" />}
                onClick={() =>
                  setError(
                    "Google Sign-In is not configured. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to .env.local."
                  )
                }
              >
                Google Account
              </Button>
            )}
          </form>

          <p className="text-center text-xs text-[#565148] dark:text-zinc-400 font-bold uppercase tracking-wider mt-4">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-[#9a3412] dark:text-orange-400 hover:underline hover:text-[#b45309]"
            >
              Register here
            </Link>
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}
