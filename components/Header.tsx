"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, X, User, LogIn, LogOut, Bell, Briefcase, GraduationCap, 
  FileText, CheckCircle2, BookOpen, Bot, LayoutDashboard, Sparkles, Shield
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AuthModal from "./AuthModal";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    // Check current session
    supabase.auth.getUser().then(({ data }: any) => {
      setUser(data?.user || null);
      setLoadingUser(false);
    }).catch(() => {
      setLoadingUser(false);
    });

    // Listen to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  };

  const navLinks = [
    { name: "Home", href: "/", icon: Sparkles },
    { name: "Jobs", href: "/jobs", icon: Briefcase },
    { name: "Admissions", href: "/admissions", icon: GraduationCap },
    { name: "Exams", href: "/exams", icon: FileText },
    { name: "Results", href: "/results", icon: CheckCircle2 },
    { name: "Study Notes", href: "/study-material", icon: BookOpen },
    { name: "Mock Tests", href: "/mock-tests", icon: FileText },
    { name: "Tools", href: "/tools", icon: Sparkles },
    { name: "AI Help", href: "/ai-help", icon: Bot, badge: "AI" },
  ];

  return (
    <>
      {/* Top Banner Alert */}
      <div className="bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 text-navy py-1 px-4 text-xs font-semibold text-center flex items-center justify-center gap-2 shadow-inner">
        <span className="bg-navy text-gold text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">नया अपडेट</span>
        <span>सत्र 2026-27 के सभी Sarkari Jobs, Navodaya Entrance & Board Exam फॉर्म लाइव हैं!</span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-navy/95 backdrop-blur border-b border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold via-yellow-500 to-amber-600 p-0.5 shadow-md shadow-gold/20 group-hover:scale-105 transition transform">
                <div className="w-full h-full bg-navy rounded-[10px] flex items-center justify-center">
                  <span className="text-gold font-black text-xl tracking-tighter star-glow">5★</span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight text-white group-hover:text-gold transition">
                    5tar<span className="text-gold">Result</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-gold/20 text-gold border border-gold/40 rounded font-semibold">.com</span>
                </div>
                <span className="text-[10px] text-gray-400 font-medium hidden sm:inline">
                  आपके सपनों की तैयारी, एक ही जगह!
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 relative ${
                      isActive
                        ? "bg-navyLight text-gold border border-gold/30 shadow-sm"
                        : "text-gray-300 hover:text-white hover:bg-navyLight/60"
                    }`}
                  >
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="text-[9px] px-1.5 py-0.2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Auth Actions */}
            <div className="flex items-center gap-2">
              {!loadingUser && (
                <>
                  {user ? (
                    <div className="flex items-center gap-2">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-navyLight hover:bg-gray-800 text-white border border-gray-700 transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-gold" />
                        <span className="hidden sm:inline">Dashboard</span>
                      </Link>
                      <Link
                        href="/profile"
                        className="p-1.5 rounded-lg bg-navyLight text-gray-300 hover:text-white border border-gray-700 transition"
                        title="Profile"
                      >
                        <User className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="p-1.5 rounded-lg bg-red-950/40 text-red-300 hover:bg-red-900/60 border border-red-800/40 transition"
                        title="Logout"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setAuthMode("login");
                          setAuthModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-gray-200 hover:text-white hover:bg-navyLight transition"
                      >
                        लॉगिन
                      </button>
                      <button
                        onClick={() => {
                          setAuthMode("signup");
                          setAuthModalOpen(true);
                        }}
                        className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-400 hover:to-gold text-navy shadow-md shadow-gold/20 transition transform active:scale-95"
                      >
                        रजिस्टर
                      </button>
                      <Link
                        href="/admin"
                        className="p-1.5 rounded-lg bg-navyLight hover:bg-gold/10 text-gray-400 hover:text-gold border border-gray-700 transition hidden sm:inline-flex"
                        title="व्यवस्थापक पैनल (Admin)"
                      >
                        <Shield className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-navyLight"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-navyLight border-b border-gray-800 px-4 pt-2 pb-5 space-y-1">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 py-1">
              नेविगेशन मेनू
            </div>
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-navy text-gold border border-gold/30 font-semibold"
                      : "text-gray-200 hover:bg-navy/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-gold" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 bg-purple-600 text-white rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            
            {user && (
              <div className="pt-2 border-t border-gray-700/60 mt-2 space-y-1">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gold hover:bg-navy rounded-lg"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>My Dashboard</span>
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-200 hover:bg-navy rounded-lg"
                >
                  <User className="w-4 h-4" />
                  <span>Profile Settings</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}
