"use client";

import React, { useState, useEffect } from "react";
import { Button, Card, Link, Chip } from "@heroui/react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Coins,
  ShieldCheck,
  Flame,
  Users,
  Award,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const HERO_SLIDES = [
  {
    title: "Empower Innovation: Back the Future of Green Tech",
    description:
      "Help clean energy pioneers build next-gen solar rigs and off-grid power solutions for disaster-struck zones.",
    ctaText: "Explore Tech Projects",
    ctaLink: "/campaigns?category=Tech",
    bgGradient: "from-blue-600/20 via-indigo-600/10 to-transparent",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "Art that Inspires: Sponsor Community Masterpieces",
    description:
      "Support local muralists and street artists transforming grey urban spaces into visual narratives of hope.",
    ctaText: "Support Art & Murals",
    ctaLink: "/campaigns?category=Art",
    bgGradient: "from-purple-600/20 via-pink-650/10 to-transparent",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "Clean Water for All: Fund Water Filtration Units",
    description:
      "Help construct gravity-powered EcoFilter kits for rural schools, securing safe drinking water for children.",
    ctaText: "Fund Health Systems",
    ctaLink: "/campaigns?category=Health",
    bgGradient: "from-teal-650/20 via-cyan-600/10 to-transparent",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "FundFlow made it possible for us to manufacture our first batch of SolarGrid kits. The credit-based system is transparent, secure, and incredibly user-friendly.",
    author: "Sarah Chen",
    role: "Founder, SolarGrid",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
  },
  {
    quote:
      "Sponsoring EcoFilter water systems for remote schools was simple and gratifying. Being able to track exactly how my contributions cleared gave me peace of mind.",
    author: "Mark Jenkins",
    role: "Philanthropist & Supporter",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
  },
  {
    quote:
      "As a visual artist, raising capital for public works is difficult. FundFlow connected me directly to neighborhood patrons who funded our library mural in days.",
    author: "Elena Rostova",
    role: "Lead Muralist, ArtHope",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
  },
];

const MOCK_FALLBACK_CAMPAIGNS = [
  {
    _id: "1",
    title: "SolarGrid: Portable Solar Kits for Emergency Relief",
    category: "Tech",
    amount_raised: 6850,
    funding_goal: 8000,
    image_url:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=600",
  },
  {
    _id: "2",
    title: "EcoFilter: Clean Water for Rural Schools",
    category: "Health",
    amount_raised: 4200,
    funding_goal: 5000,
    image_url:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600",
  },
  {
    _id: "3",
    title: "SensiArm: 3D-Printed Prosthetics for Children",
    category: "Tech",
    amount_raised: 9200,
    funding_goal: 12000,
    image_url:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600",
  },
  {
    _id: "4",
    title: "Project ReGrow: Community Urban Agroforestry",
    category: "Community",
    amount_raised: 2900,
    funding_goal: 3000,
    image_url:
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=600",
  },
  {
    _id: "5",
    title: "Visualizing Hope: Community Art Murals",
    category: "Art",
    amount_raised: 800,
    funding_goal: 1500,
    image_url:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=600",
  },
  {
    _id: "6",
    title: "ReCycle Hub: Waste Collectors Tricycles",
    category: "Community",
    amount_raised: 1500,
    funding_goal: 6000,
    image_url:
      "https://images.unsplash.com/photo-1532996127610-534f49d52bb5?auto=format&fit=crop&q=80&w=600",
  },
];

export default function Home() {
  // Hero Slider State
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroDirection, setHeroDirection] = useState(0);

  // Testimonial State
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Campaign State
  const [campaigns, setCampaigns] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  // Fetch campaigns
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const res = await fetch("/api/campaigns");
        const data = await res.json();
        if (data.success && data.campaigns.length > 0) {
          setCampaigns(data.campaigns);
        } else {
          setCampaigns(MOCK_FALLBACK_CAMPAIGNS);
        }
      } catch (err) {
        console.error("Fetch campaigns error, using mock fallback:", err);
        setCampaigns(MOCK_FALLBACK_CAMPAIGNS);
      }
    };
    loadCampaigns();
  }, []);

  // Hero auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      nextHeroSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [heroIndex]);

  // Testimonial auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextHeroSlide = () => {
    setHeroDirection(1);
    setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevHeroSlide = () => {
    setHeroDirection(-1);
    setHeroIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  // Filter campaigns by category
  const filteredCampaigns =
    activeCategory === "All"
      ? campaigns
      : campaigns.filter((c) => c.category === activeCategory);

  const categories = ["All", "Tech", "Art", "Community", "Health"];

  return (
    <div className="flex-1 flex flex-col justify-start">
      {/* 1. Hero Slider Section */}
      <section className="relative h-[550px] lg:h-[650px] overflow-hidden bg-zinc-950 text-white">
        <AnimatePresence initial={false} custom={heroDirection}>
          <motion.div
            key={heroIndex}
            custom={heroDirection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8) 30%, rgba(0, 0, 0, 0.4)), url(${HERO_SLIDES[heroIndex].image})`,
            }}
          >
            {/* Ambient Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${HERO_SLIDES[heroIndex].bgGradient}`}
            />

            <div className="max-w-7xl mx-auto px-6 h-full flex flex-col justify-center relative z-10">
              <div className="max-w-2xl flex flex-col items-start">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-xs font-semibold mb-6 uppercase tracking-wider backdrop-blur-md">
                  <Sparkles size={12} className="text-amber-400" />
                  Featured Initiatives
                </span>
                <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
                  {HERO_SLIDES[heroIndex].title}
                </h1>
                <p className="text-zinc-300 text-base lg:text-lg mb-8 leading-relaxed">
                  {HERO_SLIDES[heroIndex].description}
                </p>
                <Button
                  as={Link}
                  href={HERO_SLIDES[heroIndex].ctaLink}
                  color="primary"
                  size="lg"
                  className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all"
                  endContent={<ArrowRight size={16} />}
                >
                  {HERO_SLIDES[heroIndex].ctaText}
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <button
          onClick={prevHeroSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-white cursor-pointer transition-colors backdrop-blur-sm"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextHeroSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-white cursor-pointer transition-colors backdrop-blur-sm"
          aria-label="Next Slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setHeroIndex(index)}
              className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                index === heroIndex ? "bg-blue-600 w-8" : "bg-white/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. Top Funded Campaigns */}
      <section className="py-24 px-6 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                <TrendingUp size={14} />
                Trending
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-zinc-900 dark:text-white">
                Top Funded Campaigns
              </h2>
            </div>

            {/* Interactive Category Chips */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Chip
                  key={cat}
                  as="button"
                  onClick={() => setActiveCategory(cat)}
                  variant={activeCategory === cat ? "solid" : "bordered"}
                  color={activeCategory === cat ? "primary" : "default"}
                  className="font-medium text-xs py-1 px-3 border-zinc-200 dark:border-zinc-800 cursor-pointer select-none hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  {cat}
                </Chip>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {filteredCampaigns.length > 0 ? (
                filteredCampaigns.map((camp) => {
                  const percent = Math.min(
                    100,
                    Math.round((camp.amount_raised / camp.funding_goal) * 100)
                  );
                  return (
                    <motion.div
                      key={camp._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden hover:-translate-y-1.5 transition-transform duration-300 h-full flex flex-col justify-between shadow-sm">
                        <Card.Content className="p-0 flex flex-col h-full justify-between">
                          {/* Image */}
                          <div className="relative h-48 w-full bg-zinc-200 dark:bg-zinc-800">
                            <img
                              src={camp.image_url}
                              alt={camp.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 left-4">
                              <span className="px-2.5 py-1 text-[10px] font-bold uppercase bg-blue-600 text-white rounded-md tracking-wider">
                                {camp.category}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 line-clamp-1">
                                {camp.title}
                              </h3>
                              <p className="text-zinc-650 dark:text-zinc-400 text-xs line-clamp-2 leading-relaxed mb-6">
                                {camp.story}
                              </p>
                            </div>

                            {/* Fund details */}
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between items-center text-xs font-bold text-zinc-850 dark:text-zinc-350">
                                <span>{percent}% Funded</span>
                                <span>{camp.amount_raised} Credits</span>
                              </div>
                              {/* Progress bar */}
                              <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                              <div className="flex justify-between items-center text-[10px] text-zinc-400 font-semibold mt-1">
                                <span>Goal: {camp.funding_goal} Cr</span>
                                <span>Min contribution: {camp.minimum_contribution} Cr</span>
                              </div>
                            </div>
                          </div>
                        </Card.Content>
                      </Card>
                    </motion.div>
                  );
                })
              ) : (
                <div className="col-span-full py-16 text-center text-zinc-500">
                  No campaigns found in this category.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="py-24 px-6 bg-white dark:bg-black border-t border-zinc-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center flex flex-col items-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-zinc-900 dark:text-white mb-4">
              How FundFlow Works
            </h2>
            <p className="max-w-xl text-zinc-500 text-sm">
              We connect visionaries with patrons through a simple, credit-based crowdfunding
              workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Register & Pick Role",
                desc: "Sign up and choose to join as a Supporter or Creator. Supporters receive 50 initial credits, and Creators get 20 credits to seed their campaigns.",
                color: "text-blue-600 dark:text-blue-400",
              },
              {
                step: "02",
                title: "Launch or Back Campaigns",
                desc: "Creators configure funding goals, deadlines, and rewards. Supporters use their credits to back initiatives they care about directly from the platform.",
                color: "text-indigo-600 dark:text-indigo-400",
              },
              {
                step: "03",
                title: "Approve & Withdraw Funds",
                desc: "Once a campaign succeeds and the community verifies milestones, the funds clear. Creators request withdrawals while supporters track rewards.",
                color: "text-teal-650 dark:text-teal-400",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-4 relative md:border-r border-zinc-100 dark:border-zinc-900 last:border-0 pr-0 md:pr-8"
              >
                <span className={`text-5xl font-black ${step.color} tracking-tighter`}>
                  {step.step}
                </span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Platform Impact in Numbers */}
      <section className="py-24 px-6 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-150 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
              <Card.Content className="p-8 flex items-center gap-6">
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100/60 dark:border-blue-900/30">
                  <Coins size={32} />
                </div>
                <div>
                  <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                    $24.5M+
                  </span>
                  <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-1">
                    Total Capital Raised
                  </p>
                </div>
              </Card.Content>
            </Card>

            <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
              <Card.Content className="p-8 flex items-center gap-6">
                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/60 dark:border-indigo-900/30">
                  <Award size={32} />
                </div>
                <div>
                  <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                    1,420+
                  </span>
                  <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-1">
                    Projects Funded
                  </p>
                </div>
              </Card.Content>
            </Card>

            <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
              <Card.Content className="p-8 flex items-center gap-6">
                <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-650 dark:text-teal-400 border border-teal-100/60 dark:border-teal-900/30">
                  <Users size={32} />
                </div>
                <div>
                  <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                    120K+
                  </span>
                  <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-1">
                    Lives Impacted
                  </p>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. Testimonials Section */}
      <section className="py-24 px-6 bg-white dark:bg-black border-t border-zinc-100 dark:border-zinc-900 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30 text-xs font-semibold mb-6">
            <Award size={14} className="text-amber-500" />
            Testimonials
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-zinc-900 dark:text-white mb-12">
            Success Stories from FundFlow
          </h2>

          <div className="w-full relative min-h-[220px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center max-w-2xl"
              >
                <p className="text-zinc-650 dark:text-zinc-400 text-lg lg:text-xl italic leading-relaxed mb-8">
                  "{TESTIMONIALS[testimonialIndex].quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-600/40">
                    <img
                      src={TESTIMONIALS[testimonialIndex].avatar}
                      alt={TESTIMONIALS[testimonialIndex].author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-zinc-850 dark:text-white text-sm">
                      {TESTIMONIALS[testimonialIndex].author}
                    </h4>
                    <p className="text-zinc-500 text-xs">
                      {TESTIMONIALS[testimonialIndex].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-2 mt-8">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setTestimonialIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  idx === testimonialIndex ? "bg-blue-600 w-6" : "bg-zinc-300 dark:bg-zinc-800"
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Bottom CTA Section */}
      <section className="py-24 px-6 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-150 dark:border-zinc-900">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900/60 dark:to-indigo-900/60 p-8 lg:p-16 text-center text-white relative overflow-hidden shadow-xl shadow-blue-100 dark:shadow-none">
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
                className="w-full sm:w-auto font-semibold bg-white text-blue-700 hover:bg-blue-50 transition-colors shadow-md animate-pulse"
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
