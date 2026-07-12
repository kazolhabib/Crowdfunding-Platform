"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";
import { Button, Card, Link } from "@heroui/react";
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
  ArrowUpRight,
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

const CAMPAIGN_FALLBACK_IMAGES = {
  Tech: HERO_SLIDES[0].image,
  Art: HERO_SLIDES[1].image,
  Health: HERO_SLIDES[2].image,
  Community: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=1200",
  default: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200",
};

const TESTIMONIALS = [
  {
    quote:
      "Crowdfunding made it possible for us to manufacture our first batch of SolarGrid kits. The credit-based system is transparent, secure, and incredibly user-friendly.",
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
      "As a visual artist, raising capital for public works is difficult. Crowdfunding connected me directly to neighborhood patrons who funded our library mural in days.",
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

  function nextHeroSlide() {
    setHeroDirection(1);
    setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }

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
      <section className="overflow-hidden bg-[#f4f0e8] px-5 pb-16 pt-10 text-[#24231f] sm:px-8 lg:px-12 lg:pb-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 flex items-center justify-between border-y border-[#cfc6b7] py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6b6459]">
            <span>Independent ideas. Meaningful change.</span>
            <span className="hidden sm:block">Est. 2024 — Global</span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(390px,0.98fr)] lg:items-center lg:gap-16">
            <div className="max-w-3xl py-4 lg:py-10">
              <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#9a3412]">The art of collective belief</p>
              <h1 className="font-serif text-[clamp(3.8rem,8vw,7.9rem)] leading-[0.82] tracking-[-0.085em] text-[#24231f]">
                Back ideas<br />that <em className="font-normal text-[#9a3412]">endure.</em>
              </h1>
              <p className="mt-9 max-w-md text-base leading-7 text-[#645d52] sm:text-lg sm:leading-8">
                Crowdfunding brings discerning backers and remarkable creators together to shape the work that moves culture forward.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <Button as={Link} href="/campaigns" size="lg" className="h-14 rounded-none bg-[#24231f] px-6 text-xs font-bold uppercase tracking-[0.12em] text-[#f4f0e8] transition-colors hover:bg-[#9a3412]" endContent={<ArrowUpRight size={17} />}>
                  Explore the collection
                </Button>
                <Link href="/register" className="border-b border-[#24231f] pb-1 text-xs font-bold uppercase tracking-[0.12em] text-[#24231f] transition-colors hover:border-[#9a3412] hover:text-[#9a3412]">
                  Launch a project
                </Link>
              </div>
              <div className="mt-14 grid max-w-xl grid-cols-3 border-t border-[#cfc6b7] pt-5">
                {[["$2.4m", "directed to ideas"], ["12k", "active patrons"], ["48", "countries reached"]].map(([value, label]) => (
                  <div key={label} className="border-r border-[#cfc6b7] px-4 first:pl-0 last:border-r-0">
                    <p className="font-serif text-3xl tracking-[-0.06em]">{value}</p>
                    <p className="mt-1 text-[9px] font-bold uppercase leading-4 tracking-[0.11em] text-[#6b6459]">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div className="absolute -right-5 -top-5 hidden h-28 w-28 rounded-full border border-[#b9ac99] lg:block" />
              <AnimatePresence initial={false} custom={heroDirection} mode="wait">
                <motion.article key={heroIndex} custom={heroDirection} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45 }} className="relative overflow-hidden bg-[#24231f] p-3 shadow-[18px_18px_0_#d8cfbf]">
                  <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]">
                    <img src={HERO_SLIDES[heroIndex].image} alt="Featured campaign" className="h-full w-full object-cover grayscale-[15%] transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
                      <div className="flex items-center justify-between border-b border-white/35 pb-3 text-[10px] font-bold uppercase tracking-[0.16em]">
                        <span>Featured story / 0{heroIndex + 1}</span><span>Open now</span>
                      </div>
                      <h2 className="mt-4 max-w-md font-serif text-3xl leading-[0.94] tracking-[-0.055em] sm:text-4xl">{HERO_SLIDES[heroIndex].title}</h2>
                      <Link href={HERO_SLIDES[heroIndex].ctaLink} className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-white hover:text-[#e8c67a]">View campaign <ArrowRight size={15} /></Link>
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>
              <div className="mt-7 flex items-center justify-between">
                <div className="flex gap-2">
                  {HERO_SLIDES.map((_, index) => <button key={index} onClick={() => setHeroIndex(index)} aria-label={`Go to slide ${index + 1}`} className={`h-2 transition-all ${index === heroIndex ? "w-10 bg-[#9a3412]" : "w-2 bg-[#b9ac99] hover:bg-[#24231f]"}`} />)}
                </div>
                <div className="flex gap-2">
                  <button onClick={prevHeroSlide} className="grid h-10 w-10 place-items-center border border-[#24231f]/30 transition-colors hover:bg-[#24231f] hover:text-[#f4f0e8]" aria-label="Previous slide"><ChevronLeft size={18} /></button>
                  <button onClick={nextHeroSlide} className="grid h-10 w-10 place-items-center border border-[#24231f]/30 transition-colors hover:bg-[#24231f] hover:text-[#f4f0e8]" aria-label="Next slide"><ChevronRight size={18} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Campaign Collection */}
      <section className="bg-[#24231f] px-5 py-20 text-[#f7f0e3] sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-8 border-b border-white/15 pb-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#e8c67a]"><TrendingUp size={14} />The featured collection</p>
              <h2 className="mt-5 font-serif text-5xl leading-[0.9] tracking-[-0.07em] sm:text-6xl lg:text-7xl">Ideas with<br /><em className="font-normal text-[#d78b63]">real momentum.</em></h2>
            </div>
            <div className="max-w-sm lg:text-right">
              <p className="text-sm leading-6 text-[#c7beb0]">A considered selection of independent projects gathering the strongest support from our community.</p>
              <Link href="/campaigns" className="mt-5 inline-flex items-center gap-2 border-b border-[#e8c67a] pb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#e8c67a] transition-colors hover:border-white hover:text-white">View all campaigns <ArrowRight size={14} /></Link>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-b border-white/15 pb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`border-b pb-1 text-[10px] font-bold uppercase tracking-[0.16em] transition-colors ${activeCategory === cat ? "border-[#e8c67a] text-[#e8c67a]" : "border-transparent text-[#b4aa9b] hover:text-white"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
            <AnimatePresence mode="wait">
              {filteredCampaigns.length > 0 ? (
                filteredCampaigns.map((camp, index) => {
                  const percent = Math.min(100, Math.round((camp.amount_raised / camp.funding_goal) * 100));
                  const campaignFallbackImage = CAMPAIGN_FALLBACK_IMAGES[camp.category] || CAMPAIGN_FALLBACK_IMAGES.default;
                  const campaignImage = camp.image_url || campaignFallbackImage;
                  const cardSize = index === 0 ? "lg:col-span-6 lg:row-span-2 lg:min-h-[570px]" : index < 3 ? "lg:col-span-3 lg:min-h-[278px]" : "lg:col-span-4 lg:min-h-[340px]";
                  return (
                    <motion.article
                      key={camp._id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -18 }}
                      transition={{ duration: 0.38, delay: Math.min(index * 0.045, 0.16) }}
                      className={`group relative min-h-[340px] overflow-hidden bg-[#3a3832] ${cardSize}`}
                    >
                      <img
                        src={campaignImage}
                        alt={camp.title}
                        onError={(event) => {
                          if (event.currentTarget.dataset.fallbackApplied) return;
                          event.currentTarget.dataset.fallbackApplied = "true";
                          event.currentTarget.src = campaignFallbackImage;
                        }}
                        className="absolute inset-0 h-full w-full object-cover grayscale-[22%] transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#171713] via-[#171713]/35 to-transparent" />
                      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-5">
                        <span className="bg-[#f7f0e3] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#24231f]">{camp.category}</span>
                        <span className="border border-white/35 bg-black/15 px-2 py-1 text-[9px] font-bold tracking-[0.12em] text-white backdrop-blur-sm">0{index + 1}</span>
                      </div>
                      <Link href={`/campaigns/${camp._id}`} className="absolute inset-0 z-10" aria-label={`View ${camp.title}`} />
                      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                        <div className="mb-4 flex items-end justify-between gap-3 border-b border-white/25 pb-3">
                          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#e8c67a]">{percent}% funded</span>
                          <span className="text-[10px] font-semibold text-white/80">{camp.amount_raised.toLocaleString()} Cr</span>
                        </div>
                        <h3 className={`font-serif leading-[0.95] tracking-[-0.05em] text-white ${index === 0 ? "text-3xl sm:text-5xl" : "text-2xl"}`}>{camp.title}</h3>
                        <div className="mt-5 flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white/75">
                          <span>Goal {camp.funding_goal.toLocaleString()} Cr</span>
                          <span className="flex items-center gap-1 text-[#e8c67a]">Discover <ArrowUpRight size={14} /></span>
                        </div>
                        <div className="mt-3 h-px w-full bg-white/25"><div className="h-full bg-[#e8c67a] transition-all duration-500" style={{ width: `${percent}%` }} /></div>
                      </div>
                    </motion.article>
                  );
                })
              ) : (
                <div className="col-span-full border border-white/15 py-20 text-center text-sm text-[#c7beb0]">No campaigns found in this category.</div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 3. The Crowdfunding Process */}
      <section className="overflow-hidden bg-[#fdfaf4] px-5 py-20 text-[#24231f] sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:h-fit">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9a3412]"><Sparkles size={14} />A clear path to impact</p>
            <h2 className="mt-5 max-w-md font-serif text-5xl leading-[0.88] tracking-[-0.07em] sm:text-6xl">Built for<br /><em className="font-normal text-[#9a3412]">belief.</em></h2>
            <p className="mt-7 max-w-sm text-sm leading-7 text-[#665e53]">From the first promise to a funded idea, every step is designed to make backing work feel transparent, personal and direct.</p>
            <div className="mt-10 flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#24231f] text-[#e8c67a]"><ShieldCheck size={21} /></span>
              <p className="text-[10px] font-bold uppercase leading-5 tracking-[0.13em] text-[#786f63]">Transparent process<br />for every contribution</p>
            </div>
          </div>

          <div className="relative grid gap-4 before:absolute before:bottom-10 before:left-8 before:top-10 before:w-px before:bg-[#d8cdbc] sm:before:left-10">
            {[
              {
                step: "01",
                title: "Choose your place in the story",
                desc: "Join as a supporter or creator. Every account begins with a clear role and the tools that make sense for it.",
                note: "Supporters receive 50 credits",
              },
              {
                step: "02",
                title: "Share an idea or back one",
                desc: "Creators present the work they want to make. Supporters discover projects and direct credits toward the ideas they believe in.",
                note: "Back projects with confidence",
              },
              {
                step: "03",
                title: "Watch momentum become impact",
                desc: "Funding progress remains visible from first contribution through to approval, fulfilment and creator withdrawal.",
                note: "Every step stays accountable",
              },
            ].map((step, index) => (
              <motion.article
                key={step.step}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="relative grid grid-cols-[64px_1fr] gap-4 border border-[#ded4c4] bg-[#f7f0e3] p-5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[7px_7px_0_#d8cdbc] sm:grid-cols-[80px_1fr] sm:gap-7 sm:p-7"
              >
                <span className="relative z-10 grid h-10 w-10 place-items-center rounded-full border border-[#b9ac99] bg-[#fdfaf4] font-serif text-lg tracking-[-0.08em] text-[#9a3412] sm:h-12 sm:w-12 sm:text-xl">{step.step}</span>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#9a3412]">{step.note}</p>
                  <h3 className="mt-3 font-serif text-2xl leading-none tracking-[-0.05em] text-[#24231f] sm:text-3xl">{step.title}</h3>
                  <p className="mt-4 max-w-lg text-sm leading-6 text-[#665e53]">{step.desc}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Platform Impact */}
      <section className="bg-[#9a3412] px-5 py-20 text-[#f7f0e3] sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col justify-between gap-6 border-b border-[#f7f0e3]/35 pb-8 lg:flex-row lg:items-end">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f2c79c]">The reach of belief</p><h2 className="mt-4 font-serif text-5xl tracking-[-0.07em] sm:text-6xl">Impact, in motion.</h2></div>
            <p className="max-w-sm text-sm leading-6 text-[#f7dfc4]">A growing network of creators and supporters directing resources toward work with real-world potential.</p>
          </div>
          <div className="grid divide-y divide-[#f7f0e3]/25 md:grid-cols-3 md:divide-x md:divide-y-0">
            {[["$24.5M+", "capital directed"], ["1,420+", "projects funded"], ["120K+", "people reached"]].map(([value, label]) => (
              <div key={label} className="py-9 first:pl-0 md:px-9 md:py-12 md:first:pl-0">
                <p className="font-serif text-5xl tracking-[-0.07em] sm:text-6xl">{value}</p>
                <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#f2c79c]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Community Notes */}
      <section className="bg-[#f7f0e3] px-5 py-20 text-[#24231f] sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9a3412]">In their own words</p><h2 className="mt-5 font-serif text-5xl leading-[0.88] tracking-[-0.07em]">People make<br /><em className="font-normal text-[#9a3412]">possibility.</em></h2></div>
          <div className="border-t border-[#cfc2af] pt-7">
            <AnimatePresence mode="wait">
              <motion.div key={testimonialIndex} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35 }}>
                <span className="font-serif text-7xl leading-none text-[#9a3412]">“</span>
                <p className="-mt-6 max-w-2xl font-serif text-3xl leading-[1.06] tracking-[-0.045em] sm:text-4xl">{TESTIMONIALS[testimonialIndex].quote}</p>
                <div className="mt-9 flex items-center justify-between border-t border-[#cfc2af] pt-5">
                  <div><p className="font-bold text-[#24231f]">{TESTIMONIALS[testimonialIndex].author}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.13em] text-[#786f63]">{TESTIMONIALS[testimonialIndex].role}</p></div>
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-[#24231f] font-serif text-base text-[#f2c79c]">{TESTIMONIALS[testimonialIndex].author.split(" ").map((name) => name[0]).join("")}</span>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="mt-8 flex gap-2">{TESTIMONIALS.map((_, idx) => <button key={idx} onClick={() => setTestimonialIndex(idx)} aria-label={`Go to testimonial ${idx + 1}`} className={`h-1.5 transition-all ${idx === testimonialIndex ? "w-10 bg-[#9a3412]" : "w-4 bg-[#cfc2af] hover:bg-[#786f63]"}`} />)}</div>
          </div>
        </div>
      </section>

      {/* 6. Bottom CTA */}
      <section className="bg-[#f7f0e3] px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28">
        <div className="mx-auto max-w-[1440px] overflow-hidden bg-[#24231f] px-6 py-14 text-[#f7f0e3] sm:px-10 lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16 lg:px-16 lg:py-20">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e8c67a]">Start where you are</p><h2 className="mt-5 max-w-3xl font-serif text-5xl leading-[0.88] tracking-[-0.07em] sm:text-6xl lg:text-7xl">Make room for<br /><em className="font-normal text-[#d78b63]">the remarkable.</em></h2><p className="mt-7 max-w-xl text-sm leading-7 text-[#c7beb0]">Whether you are shaping a new idea or looking for one to stand behind, there is a place for you here.</p></div>
          <div className="mt-10 flex flex-col gap-3 lg:mt-0"><Button as={Link} href="/register" size="lg" className="h-12 rounded-none bg-[#f7f0e3] px-5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#24231f] hover:bg-[#e8c67a]" endContent={<ArrowUpRight size={15} />}>Create your account</Button><Link href="/campaigns" className="border-b border-white/25 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-[#f7f0e3] transition-colors hover:border-[#e8c67a] hover:text-[#e8c67a]">Explore campaigns</Link></div>
        </div>
      </section>
    </div>
  );
}
