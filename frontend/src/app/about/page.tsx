"use client";
import Image from "next/image";
import { getImageUrl, IMAGES } from "@/lib/imageConfig";

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white pt-16 sm:pt-20 pb-20 sm:pb-32">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center px-4">About SkyLens</h1>
        
        {/* Our Story */}
        <div className="bg-neutral-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-neutral-800 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Our Story</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-neutral-400 mb-4 text-sm sm:text-base">
                Founded by Abdelhadi Zabin, SkyLens emerged from a passion for capturing the world from above. 
                Our journey began with a simple vision: to make aerial photography accessible to everyone while 
                maintaining the highest standards of quality and professionalism.
              </p>
              <p className="text-neutral-400 text-sm sm:text-base">
                Today, we continue to push the boundaries of what's possible in aerial photography, 
                delivering stunning visuals that tell your story from a unique perspective.
              </p>
            </div>
            <div className="relative aspect-[3/2] rounded-2xl overflow-hidden order-1 lg:order-2">
              <Image
                src={getImageUrl(IMAGES.optimizedProject6)}
                alt="Aerial Photography"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Our Team */}
        <div className="bg-neutral-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-neutral-800 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 text-center">Our Team</h2>
          <div className="max-w-2xl mx-auto">
            <div className="bg-neutral-800/50 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-cyan-500/20 flex-shrink-0">
                <Image
                  src={getImageUrl(IMAGES.abdelhadi)}
                  alt="Abdelhadi Zabin"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-semibold mb-2">Abdelhadi Zabin</h3>
                <p className="text-cyan-400 mb-3 sm:mb-4 text-sm sm:text-base">Founder & Lead Photographer</p>
                <p className="text-neutral-400 text-sm sm:text-base">
                  With a passion for aerial photography and a vision for innovation, 
                  Abdelhadi leads our team in delivering exceptional aerial content 
                  that captures the world from unique perspectives.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-center px-4">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-white/5 rounded-2xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Safety First</h3>
              <p className="text-white/70 text-sm sm:text-base">
                We prioritize safety in every operation, ensuring compliance with all regulations and best practices.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Quality Focus</h3>
              <p className="text-white/70 text-sm sm:text-base">
                We deliver exceptional quality in every project, using state-of-the-art equipment and techniques.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Client Satisfaction</h3>
              <p className="text-white/70 text-sm sm:text-base">
                We work closely with our clients to understand their needs and exceed their expectations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 