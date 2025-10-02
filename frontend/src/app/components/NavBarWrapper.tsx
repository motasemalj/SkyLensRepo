"use client";
import dynamic from "next/dynamic";

const NavBar = dynamic(() => import("./NavBar"), { 
  ssr: false,
  loading: () => (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/10 backdrop-blur-md border-b border-white/10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="h-16 sm:h-20 flex items-center justify-between">
          <div className="text-xl sm:text-2xl font-bold text-white">SkyLens</div>
          <div className="w-8 h-8 bg-neutral-700 rounded animate-pulse"></div>
        </div>
      </div>
    </nav>
  )
});

export default function NavBarWrapper() {
  return <NavBar />;
}
