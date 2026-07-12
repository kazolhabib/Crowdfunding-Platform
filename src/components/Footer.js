import React from "react";
import { Link } from "@heroui/react";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Brand & Description */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-sm">
          <Link
            href="/"
            className="font-bold text-xl text-zinc-900 dark:text-white mb-3"
          >
            FundFlow
          </Link>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
            Empowering visionaries, creators, and supporters to bring game-changing ideas to
            life. Connect, back, and build the future together.
          </p>
        </div>

        {/* Links & Socials */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={20} />
            </a>
            <a
              href="https://github.com/kazolhabib/Crowdfunding-Platform"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-blue-700 dark:hover:text-blue-500 transition-colors"
              aria-label="Facebook"
            >
              <FaFacebook size={20} />
            </a>
          </div>

          <div className="flex gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <Link href="/campaigns" className="hover:underline text-xs text-zinc-500">
              Explore
            </Link>
            <span>•</span>
            <Link href="/about" className="hover:underline text-xs text-zinc-500">
              About Us
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:underline text-xs text-zinc-500">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center">
        <p className="text-zinc-500 dark:text-zinc-500 text-xs">
          &copy; {currentYear} FundFlow. All rights reserved. Built with passion for
          developers and creators.
        </p>
      </div>
    </footer>
  );
}
