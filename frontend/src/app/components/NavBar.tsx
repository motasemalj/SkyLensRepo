"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function NavBar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    router.push("/");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-40 bg-white/10 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="h-16 sm:h-20 flex items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center text-xl sm:text-2xl font-bold text-white hover:text-cyan-400 transition-colors duration-300">
            SkyLens
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            <Link 
              href="/" 
              className="text-[17px] font-medium text-white hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all duration-300"
            >
              <span className="uppercase tracking-wide">Home</span>
            </Link>
            <Link 
              href="/services" 
              className="text-[17px] font-medium text-white hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all duration-300"
            >
              <span className="uppercase tracking-wide">Services</span>
            </Link>
            <Link 
              href="/about" 
              className="text-[17px] font-medium text-white hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all duration-300"
            >
              <span className="uppercase tracking-wide">About</span>
            </Link>
            <Link 
              href="/#contact" 
              className="text-[17px] font-medium text-white hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all duration-300"
            >
              <span className="uppercase tracking-wide">Contact</span>
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {user ? (
              <>
                {!user.isAdmin && (
                  <Link 
                    href="/dashboard" 
                    className="text-[17px] font-medium text-white hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all duration-300"
                  >
                    <span className="uppercase tracking-wide">Dashboard</span>
                  </Link>
                )}
                {user.isAdmin && (
                  <Link 
                    href="/admin" 
                    className="text-[17px] font-medium text-white hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all duration-300"
                  >
                    <span className="uppercase tracking-wide">Admin</span>
                  </Link>
                )}
                <button 
                  onClick={handleLogout} 
                  className="text-[17px] font-medium text-white hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all duration-300"
                >
                  <span className="uppercase tracking-wide">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/signin" 
                  className="text-[17px] font-medium text-white hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all duration-300"
                >
                  <span className="uppercase tracking-wide">Sign In</span>
                </Link>
                <Link 
                  href="/signup" 
                  className="text-[17px] font-semibold bg-cyan-500 text-black px-6 lg:px-8 py-3 rounded-full hover:bg-cyan-400 hover:scale-105 hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.6)] transition-all duration-300 uppercase tracking-wide"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-white hover:text-cyan-400 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 animate-fadeIn">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <div className="absolute top-0 right-0 h-full w-[280px] max-w-[85vw] bg-neutral-950 backdrop-blur-xl border-l border-cyan-500/50 shadow-2xl animate-slideInRight">
              <div className="flex flex-col h-full">
                {/* Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-neutral-700/80 bg-neutral-900">
                  <h2 className="text-lg font-bold text-white">Menu</h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 px-4 py-4 space-y-1 bg-neutral-950">
                  <Link 
                    href="/" 
                    className="flex items-center px-3 py-2.5 text-white hover:bg-cyan-500/20 hover:text-cyan-400 rounded-lg transition-all duration-200 group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-2.5 text-neutral-300 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="font-medium text-sm">Home</span>
                  </Link>
                  
                  <Link 
                    href="/services" 
                    className="flex items-center px-3 py-2.5 text-white hover:bg-cyan-500/20 hover:text-cyan-400 rounded-lg transition-all duration-200 group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-2.5 text-neutral-300 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span className="font-medium text-sm">Services</span>
                  </Link>
                  
                  <Link 
                    href="/about" 
                    className="flex items-center px-3 py-2.5 text-white hover:bg-cyan-500/20 hover:text-cyan-400 rounded-lg transition-all duration-200 group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-2.5 text-neutral-300 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium text-sm">About</span>
                  </Link>
                  
                  <Link 
                    href="/#contact" 
                    className="flex items-center px-3 py-2.5 text-white hover:bg-cyan-500/20 hover:text-cyan-400 rounded-lg transition-all duration-200 group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-2.5 text-neutral-300 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium text-sm">Contact</span>
                  </Link>
                </div>

                {/* Auth Section */}
                <div className="p-4 border-t border-neutral-700/80 bg-neutral-900 space-y-1">
                  {user ? (
                    <>
                      {!user.isAdmin && (
                        <Link 
                          href="/dashboard" 
                          className="flex items-center px-3 py-2.5 text-white hover:bg-cyan-500/20 hover:text-cyan-400 rounded-lg transition-all duration-200 group"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <svg className="w-4 h-4 mr-2.5 text-neutral-300 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span className="font-medium text-sm">Dashboard</span>
                        </Link>
                      )}
                      {user.isAdmin && (
                        <Link 
                          href="/admin" 
                          className="flex items-center px-3 py-2.5 text-white hover:bg-cyan-500/20 hover:text-cyan-400 rounded-lg transition-all duration-200 group"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <svg className="w-4 h-4 mr-2.5 text-neutral-300 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="font-medium text-sm">Admin</span>
                        </Link>
                      )}
                      <button 
                        onClick={handleLogout} 
                        className="flex items-center w-full px-3 py-2.5 text-red-300 hover:bg-red-500/20 hover:text-red-200 rounded-lg transition-all duration-200 group"
                      >
                        <svg className="w-4 h-4 mr-2.5 text-red-300 group-hover:text-red-200 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-medium text-sm">Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        href="/signin" 
                        className="flex items-center px-3 py-2.5 text-white hover:bg-cyan-500/20 hover:text-cyan-400 rounded-lg transition-all duration-200 group"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-2.5 text-neutral-300 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-medium text-sm">Sign In</span>
                      </Link>
                      <Link 
                        href="/signup" 
                        className="flex items-center justify-center w-full bg-cyan-500 text-black py-2.5 rounded-lg font-semibold hover:bg-cyan-400 transition-all duration-200 group mt-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <span className="text-sm">Sign Up</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 