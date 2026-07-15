"use client";

import React, { useState } from "react";
import { Card, Input, Button, Link } from "@heroui/react";
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
            <h2 className="text-xl font-bold text-zinc-800 dark:text-white">Welcome back</h2>
            <p className="text-zinc-500 text-sm mt-1">
              Please enter your credentials to access your dashboard
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

            <Input
              isRequired
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              startContent={<Lock className="text-zinc-450" size={18} />}
              variant="bordered"
            />

            <Button
              type="submit"
              color="primary"
              className="w-full font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white mt-2 h-11"
              isLoading={loading}
              startContent={!loading && <LogIn size={18} />}
            >
              Sign In
            </Button>

            <div className="relative flex items-center justify-center my-2">
              <div className="absolute border-t border-zinc-200 dark:border-zinc-800 w-full" />
              <span className="relative px-3 bg-white dark:bg-zinc-900 text-zinc-400 text-xs font-semibold uppercase">
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
                  shape="rectangular"
                  width="360"
                />
              </div>
            ) : (
              <Button
                type="button"
                variant="bordered"
                className="w-full font-semibold border-zinc-200 dark:border-zinc-800 h-11 opacity-80"
                startContent={<FaGoogle size={16} className="text-red-500" />}
                onClick={() =>
                  setError(
                    "Google Sign-In is not configured. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to .env.local (Google Cloud Console → OAuth 2.0 Client ID)."
                  )
                }
              >
                Google Account
              </Button>
            )}
          </form>

          <p className="text-center text-sm text-zinc-550 mt-8">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Register here
            </Link>
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}
