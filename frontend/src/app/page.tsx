"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getImageUrl, IMAGES } from "@/lib/imageConfig";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main className="relative w-full min-h-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden pb-16 sm:pb-32">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={getImageUrl(IMAGES.hero)}
          alt="Drone Filming"
          fill
          priority
          className="object-cover"
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 flex flex-col items-center">
        {/* Logo Section */}
        <div className="mb-8 sm:mb-12 transform hover:scale-105 transition-transform duration-500">
          <Image
            src={getImageUrl(IMAGES.logo)}
            alt="SkyLens Logo"
            width={300}
            height={300}
            className="drop-shadow-2xl sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px]"
            priority
          />
        </div>

        {/* Main Content */}
        <div className="text-center space-y-6 sm:space-y-8 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-tight px-2">
            Elevate Your Story with{" "}
            <span className="text-cyan-400">
              SkyLens
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-neutral-300 leading-relaxed px-4">
            Premium drone filming services for real estate, tourism, events, and more. 
            Stunning aerial visuals, delivered with elegance and precision.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 sm:mt-12 px-4">
            <Link 
              href="/services" 
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-cyan-500 text-black rounded-full text-base sm:text-lg font-semibold overflow-hidden transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25"
            >
              <span className="relative z-10">View Services</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            
            <Link 
              href="/signup" 
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-cyan-500 text-cyan-400 rounded-full text-base sm:text-lg font-semibold overflow-hidden transition-all duration-300 hover:bg-cyan-500/10"
            >
              <span className="relative z-10">Book a Flight</span>
              <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* Contact Us Section */}
      {isClient ? (
        <motion.div 
          id="contact" 
          className="relative z-10 w-full max-w-7xl px-4 sm:px-6 mt-16 sm:mt-32"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="bg-neutral-900/50 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-neutral-800">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Contact Us
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="text-cyan-400 text-xl sm:text-2xl mb-3 sm:mb-4">Phone</div>
                <a href="tel:+971505196895" className="text-lg sm:text-xl hover:text-cyan-400 transition-colors break-all">
                  +971 50 519 6895
                </a>
              </motion.div>
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="text-cyan-400 text-xl sm:text-2xl mb-3 sm:mb-4">Email</div>
                <a href="mailto:info@skylensuae.com" className="text-lg sm:text-xl hover:text-cyan-400 transition-colors break-all">
                  info@skylensuae.com
                </a>
              </motion.div>
              <motion.div 
                className="text-center sm:col-span-2 lg:col-span-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="text-cyan-400 text-xl sm:text-2xl mb-3 sm:mb-4">Office</div>
                <p className="text-lg sm:text-xl">
                  Sustainable City,<br />
                  Block E, Office 106
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div 
          id="contact" 
          className="relative z-10 w-full max-w-7xl px-4 sm:px-6 mt-16 sm:mt-32"
        >
          <div className="bg-neutral-900/50 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-neutral-800">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">
              Contact Us
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="text-cyan-400 text-xl sm:text-2xl mb-3 sm:mb-4">Phone</div>
                <a href="tel:+971505196895" className="text-lg sm:text-xl hover:text-cyan-400 transition-colors break-all">
                  +971 50 519 6895
                </a>
              </div>
              <div className="text-center">
                <div className="text-cyan-400 text-xl sm:text-2xl mb-3 sm:mb-4">Email</div>
                <a href="mailto:info@skylensuae.com" className="text-lg sm:text-xl hover:text-cyan-400 transition-colors break-all">
                  info@skylensuae.com
                </a>
              </div>
              <div className="text-center sm:col-span-2 lg:col-span-1">
                <div className="text-cyan-400 text-xl sm:text-2xl mb-3 sm:mb-4">Office</div>
                <p className="text-lg sm:text-xl">
                  Sustainable City,<br />
                  Block E, Office 106
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
      </main>
    );
  }