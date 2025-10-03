"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { getImageUrl, IMAGES } from "@/lib/imageConfig";

const services = [
  {
    title: "RAW Footage Delivery",
    description: "Receive unedited, high-resolution aerial footage straight from our drones. Perfect for clients who want full creative control.",
    image: getImageUrl(IMAGES.aerialPhotography),
    features: ["4K Resolution", "Uncompressed Files", "Full Creative Control", "Quick Delivery"]
  },
  {
    title: "Fully Edited Video",
    description: "Get a professionally edited video with color grading, music, and smooth transitions. Ideal for marketing, real estate, and events.",
    image: getImageUrl(IMAGES.servicesEdited),
    features: ["Professional Editing", "Color Grading", "Background Music", "Motion Graphics"]
  },
  {
    title: "3D Mapping",
    description: "Create detailed 3D models and maps of your property or site. Perfect for construction, real estate, and urban planning.",
    image: getImageUrl(IMAGES.mapping3d),
    features: ["High-Resolution 3D Models", "Topographic Maps", "Volume Calculations", "Progress Tracking"]
  },
  {
    title: "Industrial Inspection",
    description: "Perform safe, efficient, and detailed inspections of industrial sites, infrastructure, and equipment using advanced drone technology.",
    image: getImageUrl(IMAGES.construction),
    features: ["Thermal Imaging", "High-Resolution Photos", "Remote Access", "Detailed Reporting"]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-16 sm:pt-20 relative z-10 pb-20 sm:pb-32">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <motion.h1 
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent px-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Our Services
        </motion.h1>
        
        <motion.p 
          className="text-lg sm:text-xl text-neutral-400 text-center mb-12 sm:mb-16 max-w-2xl mx-auto px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Elevate your vision with our premium drone services. From raw footage to stunning 3D models, we deliver excellence in every frame.
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="group bg-neutral-900/50 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-neutral-800 hover:border-cyan-500/50 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="relative h-40 sm:h-48 mb-4 sm:mb-6 rounded-xl overflow-hidden flex items-center justify-center bg-black">
                <img
                  src={service.image}
                  alt={service.title}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500 rounded-xl"
                  style={{ height: "160px", width: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 sm:mb-2">{service.title}</h2>
                </div>
              </div>
              
              <p className="text-neutral-400 mb-4 sm:mb-6 text-sm sm:text-base">
                {service.description}
              </p>

              <div className="space-y-2">
                {service.features.map((feature, i) => (
                  <motion.div
                    key={feature}
                    className="flex items-center gap-2 text-neutral-300 text-sm sm:text-base"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs sm:text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="mt-4 sm:mt-6"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/signup" 
                  className="block w-full text-center bg-cyan-500 text-black py-2 sm:py-3 rounded-lg font-semibold hover:bg-cyan-400 transition-colors text-sm sm:text-base"
                >
                  Book Now
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="mt-12 sm:mt-20 text-center px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Elevate Your Vision?</h2>
          <p className="text-neutral-400 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
            Let's discuss your project and create something extraordinary together.
          </p>
          <Link 
            href="/signup" 
            className="inline-block bg-cyan-500 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-cyan-400 hover:scale-105 transition-all duration-300"
          >
            Get Started
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 