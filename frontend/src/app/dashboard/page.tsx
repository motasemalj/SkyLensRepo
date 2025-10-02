"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";

const packages = [
  { label: "RAW Footage Delivery", value: "RAW", price: 800 },
  { label: "Fully Edited Video", value: "EDITED", price: 1500 },
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
  const [form, setForm] = useState({ location: "", package: "", description: "", date: "", time: "", latitude: null as number | null, longitude: null as number | null });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

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
      setForm({ location: "", package: "", description: "", date: "", time: "", latitude: null, longitude: null });
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

  return (
    <div className="min-h-screen bg-black text-white pt-16 sm:pt-32">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 px-2">Welcome, {user?.name}</h1>
        
        <div className="space-y-6 sm:space-y-8">
          {/* Order Form */}
          <div className="bg-neutral-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-neutral-800">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Place New Order</h2>
            
            {formError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg mb-6">
                {formError}
              </div>
            )}
            
            {formSuccess && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-lg mb-6">
                Order placed successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 sm:py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                />
              </div>

              <div>
                <label htmlFor="package" className="block text-sm font-medium mb-2">
                  Package
                </label>
                <select
                  id="package"
                  name="package"
                  value={form.package}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 sm:py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                >
                  <option value="">Select Package</option>
                  {packages.map((pkg) => (
                    <option key={pkg.value} value={pkg.value}>
                      {pkg.label} ({pkg.price} AED)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 sm:py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 sm:py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 sm:py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Location on Map
                </label>
                <div className="h-[250px] sm:h-[300px] rounded-lg overflow-hidden">
                  <MapPicker 
                    value={form.latitude && form.longitude ? { lat: form.latitude, lng: form.longitude } : null}
                    onChange={handleMapSelect} 
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full bg-cyan-500 text-black font-semibold py-2.5 sm:py-3 px-6 rounded-full hover:bg-cyan-400 hover:scale-105 hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.6)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {formLoading ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order List */}
          <div className="bg-neutral-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-neutral-800">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Your Orders</h2>
            {loadingOrders ? (
              <div className="text-neutral-400 text-sm sm:text-base">Loading orders...</div>
            ) : orderError ? (
              <div className="text-red-400 text-sm sm:text-base">{orderError}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-neutral-400 border-b border-neutral-800">
                      <th className="pb-3 sm:pb-4 px-2 sm:px-4 font-medium text-xs sm:text-sm">Location</th>
                      <th className="pb-3 sm:pb-4 px-2 sm:px-4 font-medium text-xs sm:text-sm">Package</th>
                      <th className="pb-3 sm:pb-4 px-2 sm:px-4 font-medium text-xs sm:text-sm hidden sm:table-cell">Date</th>
                      <th className="pb-3 sm:pb-4 px-2 sm:px-4 font-medium text-xs sm:text-sm hidden sm:table-cell">Time</th>
                      <th className="pb-3 sm:pb-4 px-2 sm:px-4 font-medium text-xs sm:text-sm">Status</th>
                      <th className="pb-3 sm:pb-4 px-2 sm:px-4 font-medium text-xs sm:text-sm hidden lg:table-cell">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-neutral-800 hover:bg-neutral-800/30 transition-colors">
                        <td className="py-4 sm:py-6 px-2 sm:px-4 text-xs sm:text-sm">{order.location}</td>
                        <td className="py-4 sm:py-6 px-2 sm:px-4 text-xs sm:text-sm">{order.package}</td>
                        <td className="py-4 sm:py-6 px-2 sm:px-4 text-xs sm:text-sm hidden sm:table-cell">{order.date || "-"}</td>
                        <td className="py-4 sm:py-6 px-2 sm:px-4 text-xs sm:text-sm hidden sm:table-cell">{order.time || "-"}</td>
                        <td className="py-4 sm:py-6 px-2 sm:px-4">
                          <span className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${
                            order.status === "APPROVED" 
                              ? "bg-green-500/20 text-green-400" 
                              : order.status === "REJECTED" 
                              ? "bg-red-500/20 text-red-400" 
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 sm:py-6 px-2 sm:px-4 text-xs sm:text-sm text-neutral-400 max-w-[200px] lg:max-w-[250px] truncate hidden lg:table-cell">
                          {order.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 