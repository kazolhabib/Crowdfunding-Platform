"use client";

import React, { useState } from "react";
import { Button, Dropdown, Avatar, Label } from "@heroui/react";
import Link from "next/link";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  Coins,
  User as UserIcon,
  LayoutDashboard,
  ChevronDown,
  Menu,
  X,
  ArrowUpRight,
  UserRound,
  Settings,
  Code2,
} from "lucide-react";

const CLIENT_GITHUB_REPO = "https://github.com/kazolhabib/Crowdfunding-Platform";

export default function Navbar() {
  const pathname = usePathname();
  const { user, loginMockRole, logout, currentRole } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const hasProfilePhoto = Boolean(user?.photoURL) && !user.photoURL.includes("images.unsplash.com");

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled((current) => {
      if (latest > 80) return true;
      if (latest < 20) return false;
      return current;
    });
  });

  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <motion.header
      initial={{ opacity: 0, y: -28 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 360, damping: 30, mass: 0.7 }}
      className={`sticky top-0 z-50 origin-top border-b border-[#d9d1c3] bg-[#f4f0e8]/95 px-4 backdrop-blur-md sm:px-7 ${isScrolled ? "shadow-[0_10px_30px_rgba(54,45,32,0.12)]" : ""}`}
    >
      <motion.div
        initial={false}
        animate={{ height: isScrolled ? 0 : 32, opacity: isScrolled ? 0 : 1, y: isScrolled ? -10 : 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto hidden max-w-[1440px] items-center justify-between overflow-hidden border-b border-[#d9d1c3] text-[9px] font-bold uppercase tracking-[0.16em] text-[#6b6459] lg:flex"
      >
        <span>An independent crowdfunding platform</span>
        <span className="text-[#9a3412]">For ideas worth keeping</span>
        <span>Global projects · considered backing</span>
      </motion.div>
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between">
        <div className="flex items-center gap-5 lg:gap-10">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="grid h-10 w-10 place-items-center rounded-full border border-[#24231f]/15 text-[#24231f] transition-colors hover:bg-[#24231f] hover:text-[#f4f0e8] md:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <Link href="/" className="group flex items-center gap-3 text-[#24231f]">
            <span className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-[0.9rem] bg-[#9a3412] font-serif text-[17px] font-semibold tracking-[-0.2em] text-[#f7f0e3] shadow-[4px_4px_0_#24231f] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[6px_6px_0_#24231f]">
              <span className="relative z-10">C<span className="ml-[-1px] text-[#e8c67a]">F</span></span>
              <span className="absolute inset-1 rounded-[0.65rem] border border-[#f7f0e3]/25" />
            </span>
            <span>
              <span className="block font-serif text-2xl leading-none tracking-[-0.07em]">Crowdfunding</span>
              <span className="mt-1 block text-[8px] font-bold uppercase tracking-[0.22em] text-[#9a3412]">Platform</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            <Link href="/campaigns" className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#565148] transition-colors hover:text-[#9a3412]">
              Explore Campaigns
            </Link>
            {user && (
              <Link href="/dashboard" className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#565148] transition-colors hover:text-[#9a3412]">
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user && (
            <div className="flex items-center gap-1.5 border-r border-[#24231f]/15 pr-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#565148] sm:pr-4">
              <Coins size={14} className="text-[#b45309]" />
              <span>{user.credits}</span>
              <span className="hidden sm:inline">credits</span>
            </div>
          )}

          <a
            href={CLIENT_GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-10 items-center gap-1.5 border border-[#bfb5a3] bg-[#ebe3d5] px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#24231f] shadow-[2px_2px_0_rgba(36,35,31,0.12)] transition-all hover:-translate-y-0.5 hover:border-[#24231f] hover:shadow-[3px_3px_0_#9a3412] md:inline-flex"
          >
            <Code2 size={14} className="text-[#9a3412]" />
            Join as Developer
          </a>

          <Dropdown placement="bottom-end">
            <Dropdown.Trigger>
              <span role="button" className="hidden h-11 cursor-pointer items-center gap-2 border border-[#bfb5a3] bg-[#ebe3d5] py-1 pl-3 pr-1 text-[#24231f] shadow-[2px_2px_0_rgba(36,35,31,0.12)] transition-all hover:-translate-y-0.5 hover:border-[#24231f] hover:shadow-[3px_3px_0_#9a3412] xl:inline-flex">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#24231f] text-[9px] font-black text-[#f4f0e8]">{currentRole[0]}</span>
                <span className="leading-none">
                  <span className="block text-[8px] font-bold uppercase tracking-[0.14em] text-[#776f63]">Viewing as</span>
                  <span className="mt-0.5 block text-[11px] font-bold uppercase tracking-[0.08em]">{currentRole}</span>
                </span>
                <span className="ml-1 grid h-8 w-8 place-items-center border-l border-[#bfb5a3] text-[#9a3412]"><ChevronDown size={15} /></span>
              </span>
            </Dropdown.Trigger>
            <Dropdown.Popover>
              <Dropdown.Menu aria-label="Mock Session Selector" variant="flat" onAction={(key) => loginMockRole(key)}>
                {[
                  ["Visitor", "Guest / Visitor"],
                  ["Supporter", "Supporter — 50 credits"],
                  ["Creator", "Creator — 20 credits"],
                  ["Admin", "Administrator"],
                ].map(([role, label]) => (
                  <Dropdown.Item key={role} id={role} textValue={label} className={currentRole === role ? "bg-[#f5ead8] text-[#9a3412]" : ""}>
                    <Label className={currentRole === role ? "font-bold text-[#9a3412]" : ""}>{label}</Label>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>

          {!user ? (
            <div className="flex items-center gap-2">
              <Link href="/login" className="hidden h-10 items-center justify-center px-3 text-[11px] font-bold uppercase tracking-[0.1em] text-[#24231f] hover:text-[#9a3412] transition-colors sm:flex">
                Login
              </Link>
              <Link href="/register" className="h-10 rounded-none bg-[#24231f] px-3.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#f4f0e8] transition-colors hover:bg-[#9a3412] sm:px-5 inline-flex items-center justify-center gap-1.5 shadow-[2px_2px_0_rgba(36,35,31,0.12)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#9a3412] border border-[#24231f]/10">
                <span>Register</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          ) : (
            <Dropdown placement="bottom-end">
              <Dropdown.Trigger>
                <span className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-[#bfb5a3] bg-[#ebe3d5] shadow-[2px_2px_0_rgba(36,35,31,0.12)] transition-all hover:-translate-y-0.5 hover:border-[#24231f] hover:shadow-[3px_3px_0_#9a3412]">
                  <Avatar size="sm" className="rounded-full bg-[#24231f] text-[#f4f0e8]">
                    {hasProfilePhoto && <Avatar.Image src={user.photoURL} alt={user.name} />}
                    <Avatar.Fallback><UserRound size={17} /></Avatar.Fallback>
                  </Avatar>
                </span>
              </Dropdown.Trigger>
              <Dropdown.Popover className="min-w-64 rounded-[1.4rem] border border-[#ded4c4] bg-[#fdfaf4] p-2 shadow-[0_18px_45px_rgba(54,45,32,0.2)]">
                <Dropdown.Menu aria-label="Profile Actions" variant="flat">
                  <Dropdown.Item id="profile_info" textValue="Profile information" className="mb-1 h-auto rounded-2xl bg-[#f4ead9] px-3 py-3">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#786f63]">Your account</p>
                    <p className="mt-1 text-sm font-bold text-[#24231f]">{user.name}</p>
                    <p className="mt-0.5 text-xs font-semibold text-[#9a3412]">{user.email}</p>
                  </Dropdown.Item>
                  <Dropdown.Item id="role_display" textValue="Role" className="rounded-xl px-3 py-2.5 text-xs text-[#665e53]">Role <span className="ml-1 font-bold text-[#24231f]">{user.role}</span><span className="ml-2 text-[#9a3412]">•</span><span className="ml-2 font-bold text-[#9a3412]">{user.credits} credits</span></Dropdown.Item>
                  <Dropdown.Item id="profile" textValue="My Profile" startContent={<UserIcon size={15} />} href="/profile" className="rounded-xl px-3 py-2.5 font-semibold text-[#24231f]"><Label>My Profile</Label></Dropdown.Item>
                  <Dropdown.Item id="dashboard" textValue="Dashboard" startContent={<LayoutDashboard size={15} />} href="/dashboard" className="rounded-xl px-3 py-2.5 font-semibold text-[#24231f]"><Label>Dashboard</Label></Dropdown.Item>
                  <Dropdown.Item id="settings" textValue="Profile settings" startContent={<Settings size={15} />} href="/profile" className="rounded-xl px-3 py-2.5 font-semibold text-[#24231f]"><Label>Profile settings</Label></Dropdown.Item>
                  <Dropdown.Item id="logout" textValue="Logout" color="danger" className="mt-1 rounded-xl border-t border-[#e6ddcf] px-3 py-2.5 text-danger" startContent={<FaSignOutAlt className="shrink-0 w-[15px] h-[15px]" />} onAction={logout}><Label className="text-danger">Log Out</Label></Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="mt-3 border-t border-[#d9d1c3] bg-[#f4f0e8] pt-4 md:hidden">
          <nav className="flex flex-col border-b border-[#d9d1c3] pb-4">
            <Link href="/campaigns" onClick={() => setIsMenuOpen(false)} className="px-1 py-3 text-xl font-serif text-[#24231f]">
              Explore Campaigns
            </Link>
            {user && (
              <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="px-1 py-3 text-xl font-serif text-[#24231f]">
                Dashboard
              </Link>
            )}
            <a
              href={CLIENT_GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="px-1 py-3 text-xl font-serif text-[#9a3412]"
            >
              Join as Developer
            </a>
          </nav>
          <div className="flex items-center justify-between py-4">
            {user ? (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#565148]">
                <Coins size={14} className="text-[#b45309]" />
                {user.credits} credits
              </span>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#565148]">Guest</span>
            )}
            {!user ? (
              <div className="flex items-center gap-4">
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#24231f]">
                  Login
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)} className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9a3412]">
                  Register
                </Link>
              </div>
            ) : (
              <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9a3412]">
                Profile
              </Link>
            )}
          </div>
        </div>
      )}
    </motion.header>
  );
}
