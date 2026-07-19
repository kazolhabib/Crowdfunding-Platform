"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { Link, Button, Avatar, Spinner, Label } from "@heroui/react";
import { FaSignOutAlt } from "react-icons/fa";
import {
  Home,
  Compass,
  HeartHandshake,
  CreditCard,
  History,
  PlusCircle,
  FolderGit,
  DollarSign,
  FileText,
  BarChart2,
  Bell,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Coins,
  Shield,
  UserRound,
  Users,
  Settings,
  ListChecks,
} from "lucide-react";
import Footer from "@/components/Footer";

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
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleNotifications = () => {
    setShowNotifications((prev) => {
      const next = !prev;
      if (next) {
        fetchNotifications();
      }
      return next;
    });
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
      <div className="min-h-screen flex items-center justify-center bg-[#f4f0e8]">
        <Spinner size="lg" color="warning" label="Loading dashboard layout..." />
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
          { label: "Contributions to Review", href: "/dashboard/review-contributions", icon: ListChecks },
          { label: "Withdrawals", href: "/dashboard/withdrawals", icon: DollarSign },
          { label: "Payment History", href: "/dashboard/creator-payments", icon: History },
        ];
      case "Admin":
        return [
          { label: "Home", href: "/dashboard/admin", icon: Home },
          { label: "Campaign Approvals", href: "/dashboard/campaign-approvals", icon: ListChecks },
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
    <div className="min-h-screen flex flex-col bg-[#f4f0e8] text-[#24231f]">
      
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-40 w-full h-[72px] bg-[#f4f0e8]/95 backdrop-blur-md border-b border-[#d9d1c3] px-4 sm:px-7 flex items-center justify-between shadow-[0_10px_30px_rgba(54,45,32,0.06)]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 -ml-2 rounded-md hover:bg-[#ebe3d5] md:hidden text-[#565148] cursor-pointer"
            aria-label="Open sidebar drawer"
          >
            <Menu size={20} />
          </button>
          
          <Link href="/" className="group flex items-center gap-3 text-[#24231f]">
            <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-[0.8rem] bg-[#9a3412] font-serif text-[15px] font-semibold tracking-[-0.2em] text-[#f7f0e3] shadow-[3px_3px_0_#24231f] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0_#24231f]">
              <span className="relative z-10">C<span className="ml-[-1px] text-[#e8c67a]">F</span></span>
              <span className="absolute inset-1 rounded-[0.55rem] border border-[#f7f0e3]/25" />
            </span>
            <span className="hidden sm:block">
              <span className="block font-serif text-lg leading-none tracking-[-0.07em]">Crowdfunding</span>
              <span className="mt-0.5 block text-[7px] font-bold uppercase tracking-[0.22em] text-[#9a3412]">Platform</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* User Credits badge */}
          <div className="flex items-center gap-1.5 border border-[#bfb5a3] bg-[#ebe3d5] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#565148] shadow-[2px_2px_0_rgba(36,35,31,0.08)]">
            <Coins size={14} className="text-[#b45309]" />
            <span>{user.credits} Credits</span>
          </div>

          {/* Floating Notification pop-up */}
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              className="relative grid h-10 w-10 place-items-center border border-[#bfb5a3] bg-[#ebe3d5] text-[#24231f] shadow-[2px_2px_0_rgba(36,35,31,0.08)] transition-all hover:-translate-y-0.5 hover:border-[#24231f] hover:shadow-[3px_3px_0_#9a3412] cursor-pointer outline-none"
              onClick={toggleNotifications}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#9a3412] rounded-full flex items-center justify-center text-[8px] font-bold text-white ring-1 ring-[#f4f0e8]">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 border border-[#bfb5a3] bg-[#fdfaf4] shadow-[0_15px_35px_rgba(54,45,32,0.15)] overflow-hidden p-0 rounded-none z-50 text-[#24231f]">
                <div className="flex justify-between items-center px-4 py-3 bg-[#ebe3d5]/70 border-b border-[#cfc6b7]">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6b6459]">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#9a3412] hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto divide-y divide-[#cfc6b7]/50">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        onClick={() => {
                          if (notif.actionRoute) {
                            router.push(notif.actionRoute);
                            setShowNotifications(false);
                          }
                        }}
                        className={`p-4 hover:bg-[#ebe3d5]/35 transition-colors flex flex-col gap-1 cursor-pointer ${
                          !notif.read ? "bg-[#f5ead8]/40" : ""
                        }`}
                      >
                        <p className="text-xs font-semibold text-[#24231f] leading-normal">
                          {notif.message}
                        </p>
                        <span className="text-[9px] text-[#776f63] font-medium">
                          {new Date(notif.time).toLocaleDateString()} at{" "}
                          {new Date(notif.time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-[10px] font-bold uppercase tracking-wider text-[#776f63]">
                      No notifications
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User badge + profile */}
          <div className="hidden sm:flex items-center gap-3 border-l border-[#d9d1c3] pl-4">
            <div className="text-right">
              <p className="text-xs font-bold text-[#24231f]">{user.name}</p>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#9a3412] uppercase tracking-[0.14em]">
                <Shield size={10} />
                {user.role}
              </span>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full border border-[#bfb5a3] bg-[#ebe3d5] shadow-[2px_2px_0_rgba(36,35,31,0.08)]">
              <Avatar size="sm" className="rounded-full bg-[#24231f] text-[#f4f0e8]">
                {hasProfilePhoto && <Avatar.Image src={user.photoURL} alt={user.name} />}
                <Avatar.Fallback><UserRound size={15} /></Avatar.Fallback>
              </Avatar>
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex relative">
        
        {/* 2. Desktop Sidebar */}
        <aside
          className={`hidden md:flex flex-col justify-between bg-[#f4f0e8] border-r border-[#d9d1c3] min-h-[calc(100vh-4.5rem)] sticky top-[72px] z-30 transition-all duration-300 ${
            isSidebarCollapsed ? "w-16" : "w-64"
          }`}
        >
          <div className="py-6 flex flex-col gap-1.5 px-3">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3.5 py-3 border border-transparent text-[11px] font-bold uppercase tracking-[0.14em] transition-all cursor-pointer select-none ${
                    isActive
                      ? "bg-[#ebe3d5] text-[#9a3412] border-[#bfb5a3] shadow-[2px_2px_0_rgba(36,35,31,0.08)]"
                      : "text-[#565148] hover:bg-[#ebe3d5]/50 hover:text-[#9a3412]"
                  }`}
                >
                  <Icon size={16} className="shrink-0 w-4 h-4" />
                  {!isSidebarCollapsed && <span>{link.label}</span>}
                </Link>
              );
            })}
          </div>

          <div className="p-3 border-t border-[#d9d1c3] bg-[#ebe3d5]/20 flex flex-col gap-1">
            <div className="flex items-center justify-between w-full">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3.5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-danger hover:bg-red-50 cursor-pointer transition-colors border-0 outline-none flex-1"
              >
                <FaSignOutAlt className="shrink-0 w-4 h-4 text-danger" />
                {!isSidebarCollapsed && <span>Sign Out</span>}
              </button>

              {!isSidebarCollapsed && (
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="flex items-center justify-center p-2 text-[#776f63] hover:text-[#9a3412] hover:bg-[#ebe3d5]/50 cursor-pointer transition-colors select-none outline-none border-0"
                  title="Collapse Sidebar"
                >
                  <PanelLeftClose size={18} className="shrink-0 w-[18px] h-[18px]" />
                </button>
              )}
            </div>

            {isSidebarCollapsed && (
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="mt-1 flex items-center justify-center p-2 text-[#776f63] hover:text-[#9a3412] hover:bg-[#ebe3d5]/50 cursor-pointer transition-colors select-none outline-none border-0"
                title="Expand Sidebar"
              >
                <PanelLeftOpen size={18} className="shrink-0 w-[18px] h-[18px]" />
              </button>
            )}
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
            <aside className="relative flex flex-col justify-between w-64 max-w-xs bg-[#f4f0e8] h-full p-4 z-10 border-r border-[#d9d1c3] shadow-2xl animate-slide-in-right">
              <div>
                <div className="flex justify-between items-center pb-4 border-b border-[#d9d1c3]">
                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-[#bfb5a3] bg-[#ebe3d5]">
                      <Avatar size="sm" className="rounded-full bg-[#24231f] text-[#f4f0e8]">
                        {hasProfilePhoto && <Avatar.Image src={user.photoURL} alt={user.name} />}
                        <Avatar.Fallback><UserRound size={15} /></Avatar.Fallback>
                      </Avatar>
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#24231f]">{user.name}</p>
                      <p className="text-[10px] text-[#9a3412] font-semibold uppercase tracking-wider">{user.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="p-2 text-[#776f63] hover:text-[#9a3412] cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="py-6 flex flex-col gap-1.5">
                  {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-3 border border-transparent text-[11px] font-bold uppercase tracking-[0.14em] transition-all cursor-pointer select-none ${
                          isActive
                            ? "bg-[#ebe3d5] text-[#9a3412] border-[#bfb5a3] shadow-[2px_2px_0_rgba(36,35,31,0.08)]"
                            : "text-[#565148] hover:bg-[#ebe3d5]/50 hover:text-[#9a3412]"
                        }`}
                      >
                        <Icon size={16} />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-[#d9d1c3] flex flex-col gap-2">
                <div className="flex items-center justify-between px-3.5 py-2 border border-[#bfb5a3] bg-[#ebe3d5] text-[10px] font-bold uppercase tracking-[0.08em] text-[#565148] shadow-[2px_2px_0_rgba(36,35,31,0.08)]">
                  <Coins size={14} className="text-[#b45309]" />
                  <span>{user.credits} Credits Available</span>
                </div>
                <button
                  onClick={() => {
                    setIsMobileOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3 w-full px-3.5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-danger hover:bg-red-50 cursor-pointer transition-colors border-0 outline-none"
                >
                  <FaSignOutAlt className="shrink-0 w-4 h-4 text-danger" />
                  <span>Sign Out</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* 4. Main content slot */}
        <main className="flex-1 min-h-[calc(100vh-4.5rem)] bg-[#f4f0e8] overflow-x-hidden flex flex-col justify-between">
          <div className="flex-1 p-6 md:p-8 pb-10">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
