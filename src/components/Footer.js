import React from "react";
import { Link } from "@heroui/react";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-[#171713] px-5 py-14 text-[#f7f0e3] sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 border-b border-white/15 pb-12 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
          <div className="max-w-md">
            <Link href="/" className="flex items-center gap-3 text-[#f7f0e3]"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#9a3412] font-serif text-sm tracking-[-0.15em] text-[#f7f0e3]">CF</span><span><span className="block font-serif text-2xl leading-none tracking-[-0.07em]">Crowdfunding</span><span className="mt-1 block text-[8px] font-bold uppercase tracking-[0.2em] text-[#e8c67a]">Platform</span></span></Link>
            <p className="mt-6 text-sm leading-6 text-[#bdb5a8]">A home for independent ideas and the people prepared to make them possible.</p>
          </div>
          <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#e8c67a]">Discover</p><div className="mt-5 flex flex-col gap-3 text-sm text-[#d5cdc1]"><Link href="/campaigns" className="hover:text-[#e8c67a]">Explore campaigns</Link><Link href="/register" className="hover:text-[#e8c67a]">Start a project</Link><Link href="/dashboard" className="hover:text-[#e8c67a]">Your dashboard</Link></div></div>
          <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#e8c67a]">Follow the work</p><div className="mt-5 flex items-center gap-4">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#bdb5a8] transition-colors hover:text-[#e8c67a]"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={20} />
            </a>
            <a
              href="https://github.com/kazolhabib/Crowdfunding-Platform"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#bdb5a8] transition-colors hover:text-[#e8c67a]"
              aria-label="GitHub"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#bdb5a8] transition-colors hover:text-[#e8c67a]"
              aria-label="Facebook"
            >
              <FaFacebook size={20} />
            </a>
          </div></div>
        </div>
        <div className="flex flex-col gap-4 pt-6 text-[10px] font-bold uppercase tracking-[0.12em] text-[#827b70] sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {currentYear} Crowdfunding Platform</p>
          <div className="flex gap-5"><Link href="/about" className="hover:text-[#e8c67a]">About</Link><Link href="/terms" className="hover:text-[#e8c67a]">Terms</Link><span>Built for meaningful work</span></div>
        </div>
      </div>
    </footer>
  );
}
