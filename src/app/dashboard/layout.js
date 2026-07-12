"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { Link, Button, Avatar, Popover, Spinner, Label } from "@heroui/react";
import {
  Home,
  Compass,
  HeartHandshake,
  CreditCard,
  History,
  PlusCircle,
  FolderGit,
  ListChecks,
  DollarSign,
  CheckSquare,
  Users,
  Settings,
  FileText,
  BarChart2,
  Bell,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Coins,
  Shield,
  UserRound,
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Sidebar collapsible / drawer state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        const unread = data.notifications.filter((n) => !n.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Fetch notifications error:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const timeoutId = setTimeout(() => {
        void fetchNotifications();
      }, 0);
      // Poll every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => {
        clearTimeout(timeoutId);
        clearInterval(interval);
      };
    }
    return undefined;
  }, [user, fetchNotifications]);

  const handleBellClick = () => {
    fetchNotifications();
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications", { method: "PUT" });
      const data = await res.json();
      if (data.success) {
        setUnreadCount(0);
        // Refresh local items
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (error) {
      console.error("Mark read error:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <Spinner size="lg" color="primary" label="Loading dashboard layout..." />
      </div>
    );
  }

  if (!user) return null; // Let middleware handle redirection

  const hasProfilePhoto = Boolean(user.photoURL) && !user.photoURL.includes("images.unsplash.com");

  // Define sidebar links based on role
  const getSidebarLinks = () => {
    switch (user.role) {
      case "Supporter":
        return [
          { label: "Home", href: "/dashboard/supporter", icon: Home },
          { label: "Explore Campaigns", href: "/dashboard/explore", icon: Compass },
          { label: "My Contributions", href: "/dashboard/my-contributions", icon: HeartHandshake },
          { label: "Purchase Credit", href: "/dashboard/purchase-credit", icon: CreditCard },
          { label: "Payment History", href: "/dashboard/payment-history", icon: History },
        ];
      case "Creator":
        return [
          { label: "Home", href: "/dashboard/creator", icon: Home },
          { label: "Add New Campaign", href: "/dashboard/add-campaign", icon: PlusCircle },
          { label: "My Campaigns", href: "/dashboard/my-campaigns", icon: FolderGit },
          {
            label: "Contributions to Review",
            href: "/dashboard/review-contributions",
            icon: ListChecks,
          },
          { label: "Withdrawals", href: "/dashboard/withdrawals", icon: DollarSign },
          { label: "Payment History", href: "/dashboard/creator-payments", icon: History },
        ];
      case "Admin":
        return [
          { label: "Home", href: "/dashboard/admin", icon: Home },
          { label: "Campaign Approvals", href: "/dashboard/campaign-approvals", icon: CheckSquare },
          { label: "Manage Users", href: "/dashboard/manage-users", icon: Users },
          { label: "Manage Campaigns", href: "/dashboard/manage-campaigns", icon: Settings },
          { label: "Withdrawal Requests", href: "/dashboard/admin-withdrawals", icon: FileText },
          { label: "Reports", href: "/dashboard/reports", icon: BarChart2 },
        ];
      default:
        return [];
    }
  };

  const links = getSidebarLinks();

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-40 w-full h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 -ml-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 md:hidden text-zinc-600 dark:text-zinc-400 cursor-pointer"
            aria-label="Open sidebar drawer"
          >
            <Menu size={20} />
          </button>
          <Link
            href="/"
            className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
          >
            Crowdfunding
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* User Credits badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold text-xs border border-indigo-100 dark:border-indigo-900/30">
            <Coins size={14} className="text-amber-500 animate-pulse" />
            <span>{user.credits} Credits</span>
          </div>

          {/* Floating Notification pop-up */}
          <Popover>
            <Popover.Trigger>
              <button
                type="button"
                className="relative p-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer outline-none transition-colors"
                onClick={handleBellClick}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white ring-2 ring-white dark:ring-zinc-900">
                    {unreadCount}
                  </span>
                )}
              </button>
            </Popover.Trigger>
            <Popover.Content
              placement="bottom-end"
              className="w-80 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-medium shadow-xl overflow-hidden p-0"
            >
              <Popover.Dialog>
                <div className="flex justify-between items-center px-4 py-3 bg-zinc-50/80 dark:bg-zinc-950/80 border-b border-zinc-150 dark:border-zinc-800">
                  <Popover.Heading className="text-sm font-bold text-zinc-800 dark:text-white">
                    Notifications
                  </Popover.Heading>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        onClick={() => {
                          if (notif.actionRoute) router.push(notif.actionRoute);
                        }}
                        className={`p-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors flex flex-col gap-1 cursor-pointer ${
                          !notif.read ? "bg-blue-50/30 dark:bg-blue-950/10" : ""
                        }`}
                      >
                        <p className="text-xs text-zinc-700 dark:text-zinc-350 leading-normal">
                          {notif.message}
                        </p>
                        <span className="text-[9px] text-zinc-400 font-medium">
                          {new Date(notif.time).toLocaleDateString()} at{" "}
                          {new Date(notif.time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-xs text-zinc-400">
                      No notifications available
                    </div>
                  )}
                </div>
              </Popover.Dialog>
            </Popover.Content>
          </Popover>

          {/* User badge + profile */}
          <div className="hidden sm:flex items-center gap-3 border-l border-zinc-200 dark:border-zinc-800 pl-4">
            <div className="text-right">
              <p className="text-xs font-bold text-zinc-850 dark:text-white">{user.name}</p>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                <Shield size={10} />
                {user.role}
              </span>
            </div>
            <Avatar size="sm" className="rounded-full ring-2 ring-zinc-200 dark:ring-zinc-800">
              {hasProfilePhoto && <Avatar.Image src={user.photoURL} alt={user.name} />}
              <Avatar.Fallback><UserRound size={15} /></Avatar.Fallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex-1 flex relative">
        
        {/* 2. Desktop Sidebar */}
        <aside
          className={`hidden md:flex flex-col justify-between bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 min-h-[calc(100vh-4rem)] sticky top-16 z-30 transition-all duration-300 ${
            isSidebarCollapsed ? "w-16" : "w-64"
          }`}
        >
          <div className="py-6 flex flex-col gap-1 px-3">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-medium font-semibold text-sm transition-colors cursor-pointer select-none ${
                    isActive
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                      : "text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  {!isSidebarCollapsed && <span>{link.label}</span>}
                </Link>
              );
            })}
          </div>

          <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-1">
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-medium font-semibold text-sm text-danger hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer transition-colors border-0 outline-none`}
            >
              <LogOut size={18} />
              {!isSidebarCollapsed && <span>Sign Out</span>}
            </button>

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="mt-2 flex items-center justify-center p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white cursor-pointer select-none"
            >
              {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
        </aside>

        {/* 3. Mobile Sidebar Drawer */}
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMobileOpen(false)}
            />
            {/* Content Drawer */}
            <aside className="relative flex flex-col justify-between w-64 max-w-xs bg-white dark:bg-zinc-900 h-full p-4 z-10 shadow-xl animate-slide-in-right">
              <div>
                <div className="flex justify-between items-center pb-4 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Avatar size="sm" className="rounded-full">
                      {hasProfilePhoto && <Avatar.Image src={user.photoURL} alt={user.name} />}
                      <Avatar.Fallback><UserRound size={15} /></Avatar.Fallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-white">{user.name}</p>
                      <p className="text-[10px] text-zinc-500 font-semibold uppercase">{user.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="p-2 text-zinc-450 hover:text-zinc-800 dark:hover:text-white cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="py-6 flex flex-col gap-1">
                  {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-medium font-semibold text-sm transition-colors cursor-pointer select-none ${
                          isActive
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                            : "text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                        }`}
                      >
                        <Icon size={18} />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-2">
                <div className="flex items-center justify-between px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold text-xs border border-indigo-100 dark:border-indigo-900/30">
                  <Coins size={14} className="text-amber-500" />
                  <span>{user.credits} Credits Available</span>
                </div>
                <button
                  onClick={() => {
                    setIsMobileOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-medium font-semibold text-sm text-danger hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer transition-colors border-0 outline-none"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* 4. Main content slot */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] p-6 md:p-8 bg-zinc-50 dark:bg-zinc-950 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
