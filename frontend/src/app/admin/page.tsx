"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";

interface Order {
  id: string;
  location: string;
  package: string;
  description: string;
  status: string;
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  user: {
    name: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/signin");
    } else if (!user.isAdmin) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setActionLoading(orderId + newStatus);
    setActionError(null);
    setActionSuccess(null);
    try {
      const response = await fetch(`${API_URL}/api/admin/orders/${orderId}/${newStatus}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      // Update the order in the local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus.toUpperCase() } : order
      ));
      setActionSuccess(`${newStatus === "approved" ? "Approved" : "Rejected"} order successfully!`);
      setTimeout(() => setActionSuccess(null), 1200);
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Stats for the dashboard
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "PENDING").length,
    approved: orders.filter(o => o.status === "APPROVED").length,
    rejected: orders.filter(o => o.status === "REJECTED").length,
  };

  return (
    <main className="min-h-screen bg-black text-white pt-32">
      <div className="max-w-[1200px] mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
            <h3 className="text-lg font-medium text-neutral-400 mb-2">Total Orders</h3>
            <p className="text-3xl font-semibold">{stats.total}</p>
          </div>
          <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
            <h3 className="text-lg font-medium text-neutral-400 mb-2">Pending Orders</h3>
            <p className="text-3xl font-semibold">
              {stats.pending}
            </p>
          </div>
          <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
            <h3 className="text-lg font-medium text-neutral-400 mb-2">Completed Orders</h3>
            <p className="text-3xl font-semibold">
              {stats.approved}
            </p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-neutral-900 rounded-3xl p-8 border border-neutral-800">
          <h2 className="text-2xl font-semibold mb-6">Order Management</h2>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-neutral-400">Loading orders...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-800">
                    <th className="text-left py-4 px-4">Customer</th>
                    <th className="text-left py-4 px-4">Location</th>
                    <th className="text-left py-4 px-4">Package</th>
                    <th className="text-left py-4 px-4">Date & Time</th>
                    <th className="text-left py-4 px-4">Status</th>
                    <th className="text-left py-4 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-neutral-800">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium">{order.user.name}</p>
                          <p className="text-sm text-neutral-400">{order.user.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p>{order.location}</p>
                          <a
                            href={`https://www.google.com/maps?q=${order.latitude},${order.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-cyan-400 hover:text-cyan-300"
                          >
                            View on Map
                          </a>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="capitalize">{order.package}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p>{order.date ? new Date(order.date).toLocaleDateString() : 'Not set'}</p>
                          <p className="text-sm text-neutral-400">{order.time || 'Not set'}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          order.status === "APPROVED"
                            ? "bg-green-500/20 text-green-400"
                            : order.status === "REJECTED"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {order.status === "PENDING" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusChange(order.id, "approved")}
                              disabled={actionLoading === order.id + "approved"}
                              className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoading === order.id + "approved" ? "Approving..." : "Approve"}
                            </button>
                            <button
                              onClick={() => handleStatusChange(order.id, "rejected")}
                              disabled={actionLoading === order.id + "rejected"}
                              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoading === order.id + "rejected" ? "Rejecting..." : "Reject"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Action Messages */}
        <div className="mt-6">
          {actionError && (
            <div className="bg-red-500/20 text-red-400 px-4 py-3 rounded-lg">
              {actionError}
            </div>
          )}
          {actionSuccess && (
            <div className="bg-green-500/20 text-green-400 px-4 py-3 rounded-lg">
              {actionSuccess}
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 