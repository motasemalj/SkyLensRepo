"use client";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { API_URL } from "../../config/env";

interface Order {
  id: string;
  location: string;
  service: string;
  package: string;
  description: string;
  status: string;
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  estimate: number;
  user: {
    name: string;
    email: string;
  };
}

const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [view, setView] = useState<'table' | 'calendar'>('table');

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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

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

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus.toUpperCase() } : order
      ));
      setActionSuccess(`Order ${newStatus === "approved" ? "approved" : "rejected"} successfully!`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Stats for the dashboard
  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter(o => o.status === "PENDING").length,
    approved: orders.filter(o => o.status === "APPROVED").length,
    rejected: orders.filter(o => o.status === "REJECTED").length,
    totalRevenue: orders
      .filter(o => o.status === "APPROVED")
      .reduce((sum, o) => sum + (o.estimate || 0), 0),
  }), [orders]);

  // Filter orders based on status
  const filteredOrders = useMemo(() => {
    if (filterStatus === 'ALL') return orders;
    return orders.filter(o => o.status === filterStatus);
  }, [orders, filterStatus]);

  // Calendar events
  const calendarEvents = useMemo(() => {
    return orders
      .filter(order => order.date)
      .map(order => {
        const dateTime = order.time 
          ? new Date(`${order.date}T${order.time}`)
          : new Date(order.date);
        
        return {
          id: order.id,
          title: `${order.location} - ${order.user.name}`,
          start: dateTime,
          end: new Date(dateTime.getTime() + 2 * 60 * 60 * 1000), // 2 hour duration
          resource: order,
        };
      });
  }, [orders]);

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

  const eventStyleGetter = (event: { resource: Order }) => {
    const order = event.resource;
    let backgroundColor = '#f59e0b'; // amber for pending
    if (order.status === 'APPROVED') backgroundColor = '#10b981'; // emerald
    if (order.status === 'REJECTED') backgroundColor = '#ef4444'; // red

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.9,
        color: 'white',
        border: 'none',
        display: 'block',
        fontSize: '0.875rem',
        padding: '4px 8px',
      }
    };
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black text-white pt-24 sm:pt-32 pb-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-neutral-400 text-lg">Manage bookings and view analytics</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl p-4 sm:p-6 border border-neutral-700/50 hover:border-cyan-500/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-neutral-400">Total Orders</h3>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{stats.total}</p>
          </div>
          
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl p-4 sm:p-6 border border-neutral-700/50 hover:border-amber-500/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-neutral-400">Pending</h3>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-amber-400">{stats.pending}</p>
          </div>
          
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl p-4 sm:p-6 border border-neutral-700/50 hover:border-emerald-500/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-neutral-400">Approved</h3>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-400">{stats.approved}</p>
          </div>
          
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl p-4 sm:p-6 border border-neutral-700/50 hover:border-red-500/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-neutral-400">Rejected</h3>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-red-400">{stats.rejected}</p>
          </div>
          
          <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl p-4 sm:p-6 border border-cyan-500/50 col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-neutral-300">Revenue</h3>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-cyan-400">{stats.totalRevenue.toLocaleString()} AED</p>
          </div>
        </div>

        {/* View Toggle & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setView('table')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                view === 'table'
                  ? 'bg-cyan-500 text-black'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              📋 Table View
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                view === 'calendar'
                  ? 'bg-cyan-500 text-black'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              📅 Calendar View
            </button>
          </div>
          
          <div className="flex gap-2">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filterStatus === status
                    ? 'bg-cyan-500 text-black'
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Action Messages */}
        {actionSuccess && (
          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl animate-fadeIn">
            {actionSuccess}
          </div>
        )}
        {actionError && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl animate-fadeIn">
            {actionError}
          </div>
        )}

        {/* Main Content */}
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-neutral-700/50 shadow-2xl">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-neutral-400">Loading orders...</p>
            </div>
          ) : error ? (
            <div className="text-red-400 text-center py-12">{error}</div>
          ) : view === 'table' ? (
            // Table View
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-700">
                    <th className="text-left py-4 px-4 font-semibold text-neutral-300">Customer</th>
                    <th className="text-left py-4 px-4 font-semibold text-neutral-300">Service</th>
                    <th className="text-left py-4 px-4 font-semibold text-neutral-300">Location</th>
                    <th className="text-left py-4 px-4 font-semibold text-neutral-300">Date & Time</th>
                    <th className="text-left py-4 px-4 font-semibold text-neutral-300">Estimate</th>
                    <th className="text-left py-4 px-4 font-semibold text-neutral-300">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-neutral-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-white">{order.user.name}</p>
                          <p className="text-sm text-neutral-400">{order.user.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-white capitalize">{order.service?.replace(/_/g, ' ').toLowerCase()}</p>
                          <p className="text-sm text-neutral-400 capitalize">{order.package}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-white">{order.location}</p>
                          {order.latitude && order.longitude && (
                            <a
                              href={`https://www.google.com/maps?q=${order.latitude},${order.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-cyan-400 hover:text-cyan-300"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View on Map →
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-white">{order.date ? new Date(order.date).toLocaleDateString() : 'Not set'}</p>
                          <p className="text-sm text-neutral-400">{order.time || 'Not set'}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-bold text-cyan-400">{order.estimate ? `${order.estimate} AED` : 'N/A'}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {order.status === "PENDING" && (
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(order.id, "approved");
                              }}
                              disabled={actionLoading === order.id + "approved"}
                              className="px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors disabled:opacity-50 text-sm font-medium"
                            >
                              {actionLoading === order.id + "approved" ? "..." : "✓"}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(order.id, "rejected");
                              }}
                              disabled={actionLoading === order.id + "rejected"}
                              className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 text-sm font-medium"
                            >
                              {actionLoading === order.id + "rejected" ? "..." : "✗"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Calendar View
            <div className="calendar-container" style={{ height: '700px' }}>
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={(event) => setSelectedOrder(event.resource)}
                views={['month', 'week', 'day', 'agenda']}
                popup
              />
            </div>
          )}
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setSelectedOrder(null)}
          >
            <div 
              className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 sm:p-8 max-w-2xl w-full border border-neutral-700 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Order Details</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">Customer</p>
                    <p className="text-white font-medium">{selectedOrder.user.name}</p>
                    <p className="text-sm text-neutral-400">{selectedOrder.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-neutral-400 mb-1">Service</p>
                  <p className="text-white font-medium capitalize">{selectedOrder.service?.replace(/_/g, ' ').toLowerCase()}</p>
                  <p className="text-sm text-neutral-400 capitalize">Package: {selectedOrder.package}</p>
                </div>

                <div>
                  <p className="text-sm text-neutral-400 mb-1">Location</p>
                  <p className="text-white font-medium">{selectedOrder.location}</p>
                  {selectedOrder.latitude && selectedOrder.longitude && (
                    <a
                      href={`https://www.google.com/maps?q=${selectedOrder.latitude},${selectedOrder.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 mt-1"
                    >
                      View on Google Maps →
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">Date</p>
                    <p className="text-white font-medium">{selectedOrder.date ? new Date(selectedOrder.date).toLocaleDateString() : 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">Time</p>
                    <p className="text-white font-medium">{selectedOrder.time || 'Not set'}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-neutral-400 mb-1">Description</p>
                  <p className="text-white bg-neutral-800 p-4 rounded-lg">{selectedOrder.description}</p>
                </div>

                {selectedOrder.estimate && (
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                    <p className="text-sm text-neutral-300 mb-1">Estimated Price</p>
                    <p className="text-3xl font-bold text-cyan-400">{selectedOrder.estimate} AED</p>
                  </div>
                )}

                {selectedOrder.status === "PENDING" && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        handleStatusChange(selectedOrder.id, "approved");
                        setSelectedOrder(null);
                      }}
                      className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-400 transition-colors font-semibold"
                    >
                      Approve Order
                    </button>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedOrder.id, "rejected");
                        setSelectedOrder(null);
                      }}
                      className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-400 transition-colors font-semibold"
                    >
                      Reject Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .rbc-calendar {
          background: transparent;
          color: white;
        }
        .rbc-header {
          padding: 12px;
          font-weight: 600;
          color: #a3a3a3;
          border-bottom: 1px solid #404040;
          background: #262626;
        }
        .rbc-month-view {
          border: 1px solid #404040;
          border-radius: 12px;
          overflow: hidden;
        }
        .rbc-day-bg {
          border-left: 1px solid #404040;
        }
        .rbc-month-row {
          border-top: 1px solid #404040;
        }
        .rbc-date-cell {
          padding: 8px;
        }
        .rbc-today {
          background-color: rgba(34, 211, 238, 0.1);
        }
        .rbc-off-range-bg {
          background: #171717;
        }
        .rbc-toolbar {
          padding: 16px;
          margin-bottom: 16px;
          background: #262626;
          border-radius: 12px;
          border: 1px solid #404040;
        }
        .rbc-toolbar button {
          color: #a3a3a3;
          border: 1px solid #404040;
          padding: 8px 16px;
          border-radius: 8px;
          background: #171717;
          transition: all 0.2s;
        }
        .rbc-toolbar button:hover {
          background: #404040;
          color: white;
        }
        .rbc-toolbar button.rbc-active {
          background: #06b6d4;
          color: black;
          border-color: #06b6d4;
          font-weight: 600;
        }
        .rbc-event {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.875rem;
        }
        .rbc-event-label {
          font-size: 0.75rem;
        }
        .rbc-show-more {
          color: #06b6d4;
          background: transparent;
          font-weight: 600;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #262626;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #404040;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #525252;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </main>
  );
}
