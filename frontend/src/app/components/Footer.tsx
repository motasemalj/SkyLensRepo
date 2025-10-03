"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 mt-auto">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">SkyLens</h3>
            <p className="text-neutral-400 text-sm sm:text-base">
              Premium drone filming services for real estate, tourism, events, and more.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/" className="block text-neutral-400 hover:text-cyan-400 transition-colors text-sm sm:text-base">
                Home
              </Link>
              <Link href="/services" className="block text-neutral-400 hover:text-cyan-400 transition-colors text-sm sm:text-base">
                Services
              </Link>
              <Link href="/about" className="block text-neutral-400 hover:text-cyan-400 transition-colors text-sm sm:text-base">
                About
              </Link>
              <Link href="/#contact" className="block text-neutral-400 hover:text-cyan-400 transition-colors text-sm sm:text-base">
                Contact
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Services</h4>
            <div className="space-y-2">
              <span className="block text-neutral-400 text-sm sm:text-base">Aerial Photography</span>
              <span className="block text-neutral-400 text-sm sm:text-base">Video Production</span>
              <span className="block text-neutral-400 text-sm sm:text-base">3D Mapping</span>
              <span className="block text-neutral-400 text-sm sm:text-base">Industrial Inspection</span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact</h4>
            <div className="space-y-2">
              <a 
                href="tel:+971505196895" 
                className="block text-neutral-400 hover:text-cyan-400 transition-colors text-sm sm:text-base"
              >
                +971 50 519 6895
              </a>
              <a 
                href="mailto:info@skylensuae.com" 
                className="block text-neutral-400 hover:text-cyan-400 transition-colors text-sm sm:text-base break-all"
              >
                info@skylensuae.com
              </a>
              <p className="text-neutral-400 text-sm sm:text-base">
                Sustainable City,<br />
                Block E, Office 106
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-neutral-500 text-sm">
              © 2024 SkyLens. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-neutral-500 hover:text-cyan-400 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-neutral-500 hover:text-cyan-400 transition-colors text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
