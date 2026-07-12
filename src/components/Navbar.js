"use client";

import React, { useState } from "react";
import { Link, Button, Dropdown, Avatar, Label } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";
import { Coins, LogOut, User as UserIcon, LayoutDashboard, ChevronDown, Menu, X } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function Navbar() {
  const { user, loginMockRole, logout, currentRole } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const gitHubUrl = "https://github.com/kazolhabib/Crowdfunding-Platform";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 dark:border-zinc-800/80 dark:bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand logo & Desktop Menu Toggle */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 -ml-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 sm:hidden text-zinc-600 dark:text-zinc-400"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link
              href="/"
              className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
            >
              FundFlow
            </Link>
          </div>

          {/* Center Links (Desktop only) */}
          <nav className="hidden sm:flex items-center gap-6">
            <Link
              color="foreground"
              href="/campaigns"
              className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-sm"
            >
              Explore Campaigns
            </Link>
            {user && (
              <Link
                color="foreground"
                href="/dashboard"
                className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-sm flex items-center gap-1.5"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          
          {/* Available Credits Badge (Logged in only) */}
          {user && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold text-xs border border-indigo-100/60 dark:border-indigo-900/30">
              <Coins size={14} className="text-amber-500 animate-pulse" />
              <span>{user.credits} Credits</span>
            </div>
          )}

          {/* Join as Developer (GitHub redirection) */}
          <Button
            as={Link}
            href={gitHubUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="flat"
            color="primary"
            size="sm"
            startContent={<FaGithub size={14} />}
            className="hidden lg:flex font-medium text-xs h-9"
          >
            Join as Developer
          </Button>

          {/* Role Selector (Demo Tool) */}
          <Dropdown placement="bottom-end">
            <Dropdown.Trigger>
              <span
                role="button"
                className="inline-flex items-center justify-center font-semibold text-xs h-8 px-2.5 rounded-medium border border-warning/50 hover:bg-warning-50 dark:hover:bg-warning-950/20 text-warning cursor-pointer select-none"
              >
                Role: {currentRole} <ChevronDown size={10} className="ml-0.5" />
              </span>
            </Dropdown.Trigger>
            <Dropdown.Popover>
              <Dropdown.Menu
                aria-label="Mock Session Selector"
                variant="flat"
                onAction={(key) => loginMockRole(key)}
              >
                <Dropdown.Item id="Visitor" textValue="Guest/Visitor">
                  <Label className={currentRole === "Visitor" ? "text-primary font-semibold" : ""}>
                    Guest/Visitor
                  </Label>
                </Dropdown.Item>
                <Dropdown.Item id="Supporter" textValue="Supporter (50 credits)">
                  <Label className={currentRole === "Supporter" ? "text-primary font-semibold" : ""}>
                    Supporter (50 credits)
                  </Label>
                </Dropdown.Item>
                <Dropdown.Item id="Creator" textValue="Creator (20 credits)">
                  <Label className={currentRole === "Creator" ? "text-primary font-semibold" : ""}>
                    Creator (20 credits)
                  </Label>
                </Dropdown.Item>
                <Dropdown.Item id="Admin" textValue="Admin">
                  <Label className={currentRole === "Admin" ? "text-primary font-semibold" : ""}>
                    Admin
                  </Label>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>

          {/* Auth Actions */}
          {!user ? (
            <div className="flex items-center gap-2">
              <Button
                as={Link}
                href="/login"
                variant="light"
                size="sm"
                className="hidden sm:flex font-medium text-xs h-9"
              >
                Login
              </Button>
              <Button
                as={Link}
                href="/register"
                color="primary"
                size="sm"
                className="font-medium text-xs h-9 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm hover:shadow-md transition-all duration-200"
              >
                Register
              </Button>
            </div>
          ) : (
            <Dropdown placement="bottom-end">
              <Dropdown.Trigger>
                <span className="flex items-center justify-center cursor-pointer select-none">
                  <Avatar
                    className="transition-transform ring-2 ring-blue-600 dark:ring-blue-400 ring-offset-2 ring-offset-white dark:ring-offset-black rounded-full"
                    size="sm"
                  >
                    <Avatar.Image src={user.photoURL} alt={user.name} />
                    <Avatar.Fallback>{user.name[0]}</Avatar.Fallback>
                  </Avatar>
                </span>
              </Dropdown.Trigger>
              <Dropdown.Popover>
                <Dropdown.Menu aria-label="Profile Actions" variant="flat">
                  <Dropdown.Item id="profile_info" textValue="Profile Info" className="h-14 gap-2">
                    <p className="font-semibold text-xs text-zinc-500">Signed in as</p>
                    <p className="font-semibold text-sm text-blue-600 dark:text-blue-400">{user.email}</p>
                  </Dropdown.Item>
                  <Dropdown.Item id="role_display" textValue="Role Display" className="text-zinc-500 text-xs">
                    Role: <span className="font-bold text-zinc-700 dark:text-zinc-300">{user.role}</span>
                  </Dropdown.Item>
                  <Dropdown.Item id="credits_display" textValue="Credits Display" className="text-zinc-500 text-xs md:hidden">
                    Credits: <span className="font-bold text-indigo-600 dark:text-indigo-400">{user.credits}</span>
                  </Dropdown.Item>
                  <Dropdown.Item id="profile" textValue="My Profile" startContent={<UserIcon size={14} />} href="/profile">
                    <Label>My Profile</Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="dashboard" textValue="Dashboard" startContent={<LayoutDashboard size={14} />} href="/dashboard">
                    <Label>Dashboard</Label>
                  </Dropdown.Item>
                  <Dropdown.Item
                    id="logout"
                    textValue="Logout"
                    color="danger"
                    className="text-danger"
                    startContent={<LogOut size={14} />}
                    onAction={logout}
                  >
                    <Label className="text-danger">Log Out</Label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          )}
        </div>
      </div>

      {/* Mobile Drawer (Semantic Menu list) */}
      {isMenuOpen && (
        <div className="sm:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-black/95 backdrop-blur-md py-4 px-6 flex flex-col gap-4 animate-fade-in">
          <nav className="flex flex-col gap-3">
            <Link
              color="foreground"
              className="text-base py-1.5 font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400"
              href="/campaigns"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore Campaigns
            </Link>
            {user && (
              <Link
                color="foreground"
                className="text-base py-1.5 font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400"
                href="/dashboard"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
          </nav>
          
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-4">
            <Link
              href={gitHubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaGithub size={18} />
              Join as Developer
            </Link>

            {user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Avatar size="sm" className="rounded-full">
                    <Avatar.Image src={user.photoURL} alt={user.name} />
                    <Avatar.Fallback>{user.name[0]}</Avatar.Fallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">{user.name}</p>
                    <p className="text-xs text-zinc-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold text-xs border border-indigo-100/60 dark:border-indigo-900/30 w-fit">
                  <Coins size={14} className="text-amber-500" />
                  <span>{user.credits} Credits Available</span>
                </div>
                <Button
                  color="danger"
                  variant="flat"
                  size="sm"
                  startContent={<LogOut size={14} />}
                  className="w-full text-xs font-semibold"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                >
                  Log Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  as={Link}
                  href="/login"
                  variant="bordered"
                  size="sm"
                  className="w-full font-medium text-xs h-9"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Button>
                <Button
                  as={Link}
                  href="/register"
                  color="primary"
                  size="sm"
                  className="w-full font-medium text-xs h-9 bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
