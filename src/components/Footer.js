"use client";

import React from "react";
import { Link } from "@heroui/react";
import { usePathname } from "next/navigation";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import { ArrowUp } from "lucide-react";

const discoverLinks = [
  { href: "/campaigns", label: "Explore campaigns" },
  { href: "/register", label: "Start a project" },
  { href: "/dashboard", label: "Your dashboard" },
  { href: "/profile", label: "Your profile" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/terms", label: "Terms" },
];

const socials = [
  { href: "https://www.linkedin.com/in/kazol-habib", label: "LinkedIn", Icon: FaLinkedin },
  { href: "https://github.com/kazolhabib", label: "GitHub", Icon: FaGithub },
  { href: "https://www.facebook.com/kazollhabib/", label: "Facebook", Icon: FaFacebook },
];

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <footer className="mt-auto bg-[#171713] px-5 pt-16 pb-8 text-[#f7f0e3] sm:px-8 lg:px-12 lg:pt-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 pb-14 md:grid-cols-[1.4fr_0.6fr_0.5fr_0.6fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="group flex items-center gap-3 text-[#f7f0e3]">
              <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-[0.9rem] bg-[#9a3412] font-serif text-[17px] font-semibold tracking-[-0.2em] text-[#f7f0e3] shadow-[4px_4px_0_#e8c67a] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[6px_6px_0_#e8c67a]">
                <span className="relative z-10">
                  C<span className="ml-[-1px] text-[#e8c67a]">F</span>
                </span>
              </span>
              <span>
                <span className="block font-serif text-2xl leading-none tracking-[-0.07em]">Crowdfunding</span>
                <span className="mt-1 block text-[8px] font-bold uppercase tracking-[0.22em] text-[#e8c67a]">Platform</span>
              </span>
            </Link>
            <p className="mt-6 text-sm leading-6 text-[#bdb5a8]">For ideas worth keeping. A transparent, credit-based home for creators and the backers who show up for them.</p>
          </div>

          {/* Discover */}
          <nav aria-label="Discover">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#e8c67a]">Discover</p>
            <ul className="mt-5 flex flex-col gap-3 text-sm text-[#d5cdc1]">
              {discoverLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="transition-colors text-[#d5cdc1] hover:text-[#e8c67a]">{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#e8c67a]">Company</p>
            <ul className="mt-5 flex flex-col gap-3 text-sm text-[#d5cdc1]">
              {companyLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="transition-colors hover:text-[#e8c67a]">{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#e8c67a]">Follow the work</p>
            <div className="mt-5 flex items-center gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center border border-[#38362e] bg-[#1f1e19] text-[#d5cdc1] shadow-[3px_3px_0_#38362e] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#e8c67a] hover:text-[#e8c67a] hover:shadow-[4px_4px_0_#e8c67a]"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Ticket-tear divider */}
        <div className="flex items-center gap-3" aria-hidden="true">
          <span className="h-px flex-1 border-t border-dashed border-white/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#e8c67a]" />
          <span className="h-px flex-1 border-t border-dashed border-white/15" />
        </div>

        <div className="flex flex-col gap-4 pt-6 text-[10px] font-bold uppercase tracking-[0.12em] text-[#827b70] sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {currentYear} Crowdfunding Platform &middot; Built for meaningful work</p>
          <a
            href="#"
            className="inline-flex items-center gap-2 self-start text-[#827b70] transition-colors hover:text-[#e8c67a] sm:self-auto"
          >
            Back to top
            <ArrowUp size={12} />
          </a>
        </div>
      </div>
    </footer>
  );
}