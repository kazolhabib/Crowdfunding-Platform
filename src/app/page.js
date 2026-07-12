"use client";

import React from "react";
import { Button, Card, Link } from "@heroui/react";
import { ArrowRight, ShieldCheck, Flame, Users, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col justify-start">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32 bg-gradient-to-b from-blue-50/50 via-white to-zinc-50 dark:from-zinc-950 dark:via-black dark:to-zinc-950">
        {/* Ambient background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 opacity-30 dark:opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[350px] h-[350px] rounded-full bg-blue-400 blur-[100px]" />
          <div className="absolute top-[-5%] right-[20%] w-[300px] h-[300px] rounded-full bg-indigo-500 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30 text-xs font-semibold mb-6">
            <Sparkles size={14} className="text-amber-500" />
            Empowering the Next Generation of Creators
          </div>

          {/* Heading */}
          <h1 className="max-w-4xl text-5xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1] mb-6">
            Where Big Ideas Find{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Passionate Backers
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed mb-10">
            FundFlow is a transparent, credit-based crowdfunding ecosystem where creators
            publish their vision, and supporters turn dreams into reality. Secure,
            authenticated, and built for builders.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
            <Button
              as={Link}
              href="/campaigns"
              color="primary"
              size="lg"
              className="w-full sm:w-auto font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-indigo-300 dark:hover:shadow-none transition-all"
              endContent={<ArrowRight size={16} />}
            >
              Explore Campaigns
            </Button>
            <Button
              as={Link}
              href="/dashboard"
              variant="bordered"
              size="lg"
              className="w-full sm:w-auto font-semibold border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              Start a Campaign
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-black border-y border-zinc-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              value: "$24.5M+",
              label: "Total Funds Raised",
              desc: "Contributed by backers across 120 countries.",
            },
            {
              value: "1,420+",
              label: "Successful Campaigns",
              desc: "Innovative products and creative works brought to life.",
            },
            {
              value: "98.2%",
              label: "Completion Rate",
              desc: "High success rates for approved campaign goals.",
            },
          ].map((stat, i) => (
            <div key={i} className="text-center flex flex-col items-center p-4">
              <span className="text-4xl lg:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2">
                {stat.value}
              </span>
              <span className="text-zinc-800 dark:text-zinc-200 font-semibold mb-1">
                {stat.label}
              </span>
              <span className="text-zinc-500 dark:text-zinc-500 text-sm max-w-xs">
                {stat.desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Core Features / Pitch */}
      <section className="py-20 lg:py-28 bg-zinc-50 dark:bg-zinc-950 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center flex flex-col items-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-zinc-900 dark:text-white mb-4">
              Built for Transparency & Engagement
            </h2>
            <p className="max-w-xl text-zinc-600 dark:text-zinc-400 text-sm lg:text-base">
              We provide the tools and security layer needed to ensure supporters can fund with
              confidence, and creators can withdraw resources smoothly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card
              shadow="sm"
              className="border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:-translate-y-1 transition-transform duration-300"
            >
              <Card.Content className="p-8 flex flex-col items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Secure Contributions
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Support projects directly with platform credits. Contribution verification
                  workflow guarantees your funds only clear once goals or rewards are vetted.
                </p>
              </Card.Content>
            </Card>

            <Card
              shadow="sm"
              className="border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:-translate-y-1 transition-transform duration-300"
            >
              <Card.Content className="p-8 flex flex-col items-start gap-4">
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                  <Flame size={28} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Creator Incentives
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Creators start with 20 base credits to seed their initiatives. Set targets,
                  share reward tiers, and request withdrawals transparently.
                </p>
              </Card.Content>
            </Card>

            <Card
              shadow="sm"
              className="border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:-translate-y-1 transition-transform duration-300"
            >
              <Card.Content className="p-8 flex flex-col items-start gap-4">
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                  <Users size={28} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Active Community
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Real-time notification system keeps supporters and creators aligned on
                  milestones, approval updates, contributions, and reward releases.
                </p>
              </Card.Content>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 lg:py-28 bg-white dark:bg-black px-6 border-t border-zinc-100 dark:border-zinc-900">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900/60 dark:to-indigo-900/60 p-8 lg:p-16 text-center text-white relative overflow-hidden shadow-xl shadow-blue-100 dark:shadow-none">
          {/* Glow decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-3xl lg:text-5xl font-extrabold mb-6 leading-tight max-w-2xl">
              Ready to bring your creative projects to life?
            </h2>
            <p className="text-blue-100 text-base lg:text-lg mb-10 max-w-xl">
              Join thousands of creators who are funding their tech products, artwork, films,
              and businesses on FundFlow today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button
                as={Link}
                href="/register"
                size="lg"
                className="w-full sm:w-auto font-semibold bg-white text-blue-700 hover:bg-blue-50 transition-colors shadow-md"
              >
                Sign Up Now
              </Button>
              <Button
                as={Link}
                href="/campaigns"
                size="lg"
                variant="bordered"
                className="w-full sm:w-auto font-semibold text-white border-white/40 hover:bg-white/10 transition-colors"
              >
                See Current Campaigns
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
