"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { API_URL } from "../../config/env";

const services = [
  { 
    label: "Aerial Photography", 
    value: "AERIAL_PHOTOGRAPHY", 
    basePrice: 800,
    icon: "📸",
    description: "Capture stunning aerial views with high-resolution photography"
  },
  { 
    label: "Edited Video", 
    value: "EDITED_VIDEO", 
    basePrice: 1500,
    icon: "🎬",
    description: "Professional video editing with color grading and effects"
  },
  { 
    label: "3D Mapping", 
    value: "MAPPING_3D", 
    basePrice: 2500,
    icon: "🗺️",
    description: "Detailed 3D models and topographic mapping"
  },
  { 
    label: "Industrial Inspection", 
    value: "INDUSTRIAL_INSPECTION", 
    basePrice: 3000,
    icon: "🏗️",
    description: "Comprehensive industrial site and infrastructure inspection"
  },
];

const packages = [
  { label: "RAW Footage", value: "RAW", multiplier: 1, description: "Unedited, high-resolution footage" },
  { label: "Edited", value: "EDITED", multiplier: 1.5, description: "Professionally edited with enhancements" },
];

const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false });

export default function DashboardPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/signin");
    } else if (user.isAdmin) {
      router.replace("/admin");
    }
  }, [user, router]);

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [form, setForm] = useState({ 
    service: "", 
    location: "", 
    package: "", 
    description: "", 
    date: "", 
    time: "", 
    latitude: null as number | null, 
    longitude: null as number | null 
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [estimate, setEstimate] = useState<number>(0);

  // Calculate estimate when service or package changes
  useEffect(() => {
    if (form.service && form.package) {
      const service = services.find(s => s.value === form.service);
      const pkg = packages.find(p => p.value === form.package);
      if (service && pkg) {
        setEstimate(service.basePrice * pkg.multiplier);
      }
    } else {
      setEstimate(0);
    }
  }, [form.service, form.package]);

  // Fetch user orders
  useEffect(() => {
    if (!token) return;
    setLoadingOrders(true);
    fetch(`${API_URL}/api/order/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data.orders || []);
        setLoadingOrders(false);
      })
      .catch(() => {
        setOrderError("Failed to load orders");
        setLoadingOrders(false);
      });
  }, [token, formSuccess]);

  // Handle form input
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle order submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);
    setFormLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/order/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");
      setFormSuccess(true);
      setForm({ service: "", location: "", package: "", description: "", date: "", time: "", latitude: null, longitude: null });
      setEstimate(0);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleMapSelect = (coords: { lat: number; lng: number }) => {
    setForm(prev => ({
      ...prev,
      latitude: coords.lat,
      longitude: coords.lng
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "REJECTED":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black text-white pt-24 sm:pt-32 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Welcome back, {user?.name || "User"}!
          </h1>
          <p className="text-neutral-400 text-lg">Manage your bookings and create new service requests</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Order Form - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-neutral-700/50 shadow-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">✨</span>
                Book a Service
              </h2>
              
              {formError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 animate-fadeIn">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {formError}
                </div>
              )}
              
              {formSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 animate-fadeIn">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Order placed successfully! An admin will review it shortly.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-3 text-neutral-300">
                    Select Service *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {services.map((service) => (
                      <label
                        key={service.value}
                        className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          form.service === service.value
                            ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20"
                            : "border-neutral-700 bg-neutral-800/50 hover:border-neutral-600 hover:bg-neutral-800"
                        }`}
                      >
                        <input
                          type="radio"
                          name="service"
                          value={service.value}
                          checked={form.service === service.value}
                          onChange={handleChange}
                          className="sr-only"
                          required
                        />
                        <div className="flex items-start gap-3">
                          <span className="text-3xl">{service.icon}</span>
                          <div className="flex-1">
                            <div className="font-semibold text-white mb-1">{service.label}</div>
                            <div className="text-xs text-neutral-400 mb-2">{service.description}</div>
                            <div className="text-sm font-bold text-cyan-400">From {service.basePrice} AED</div>
                          </div>
                        </div>
                        {form.service === service.value && (
                          <div className="absolute top-2 right-2">
                            <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Package Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-3 text-neutral-300">
                    Select Package *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {packages.map((pkg) => (
                      <label
                        key={pkg.value}
                        className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          form.package === pkg.value
                            ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20"
                            : "border-neutral-700 bg-neutral-800/50 hover:border-neutral-600 hover:bg-neutral-800"
                        }`}
                      >
                        <input
                          type="radio"
                          name="package"
                          value={pkg.value}
                          checked={form.package === pkg.value}
                          onChange={handleChange}
                          className="sr-only"
                          required
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-white mb-1">{pkg.label}</div>
                          <div className="text-xs text-neutral-400">{pkg.description}</div>
                        </div>
                        {form.package === pkg.value && (
                          <svg className="w-5 h-5 text-cyan-400 ml-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Estimated Price */}
                {estimate > 0 && (
                  <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-4 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-neutral-300 mb-1">Estimated Price</div>
                        <div className="text-3xl font-bold text-cyan-400">{estimate.toLocaleString()} AED</div>
                      </div>
                      <div className="text-5xl">💰</div>
                    </div>
                    <div className="text-xs text-neutral-400 mt-2">
                      * Final price may vary based on specific requirements
                    </div>
                  </div>
                )}

                {/* Location Input */}
                <div>
                  <label htmlFor="location" className="block text-sm font-semibold mb-2 text-neutral-300">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g., Dubai Marina, Burj Khalifa"
                    required
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-white placeholder-neutral-500"
                  />
                </div>

                {/* Map Picker */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-neutral-300">
                    Pin Location on Map
                  </label>
                  <div className="h-[300px] rounded-xl overflow-hidden border border-neutral-700">
                    <MapPicker 
                      value={form.latitude && form.longitude ? { lat: form.latitude, lng: form.longitude } : null}
                      onChange={handleMapSelect} 
                    />
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-semibold mb-2 text-neutral-300">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-sm font-semibold mb-2 text-neutral-300">
                      Preferred Time *
                    </label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-white"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-semibold mb-2 text-neutral-300">
                    Project Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Tell us more about your project requirements..."
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-white placeholder-neutral-500 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 px-6 rounded-xl hover:from-cyan-400 hover:to-blue-400 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-lg"
                >
                  {formLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Submit Booking Request"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Orders List - Sidebar on large screens */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 rounded-2xl sm:rounded-3xl p-6 border border-neutral-700/50 shadow-2xl sticky top-24">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Your Bookings
              </h2>
              
              {loadingOrders ? (
                <div className="text-neutral-400 text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                  Loading...
                </div>
              ) : orderError ? (
                <div className="text-red-400 text-center py-8">{orderError}</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8 text-neutral-400">
                  <div className="text-6xl mb-4">📭</div>
                  <p>No bookings yet</p>
                  <p className="text-sm mt-2">Create your first booking using the form</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4 hover:border-cyan-500/50 transition-all duration-300">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-semibold text-white mb-1">{order.location}</div>
                          <div className="text-sm text-neutral-400 capitalize">
                            {order.service?.replace(/_/g, ' ').toLowerCase()}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      {order.date && (
                        <div className="flex items-center gap-2 text-xs text-neutral-400 mt-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(order.date).toLocaleDateString()} {order.time && `at ${order.time}`}
                        </div>
                      )}
                      {order.estimate && (
                        <div className="text-sm font-bold text-cyan-400 mt-2">
                          Est. {order.estimate} AED
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
