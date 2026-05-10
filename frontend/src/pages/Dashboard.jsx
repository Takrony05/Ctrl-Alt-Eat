import React, { useEffect, useState, useCallback } from 'react';
import KitchenBoard from '../components/KitchenBoard';
import { getKitchenOrders, updateOrderStatus } from '../services/api';

// Active statuses that should appear on the chef's dashboard
const ACTIVE_STATUSES = ['in_progress', 'ready'];

export default function Dashboard() {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [lastPoll, setLastPoll] = useState(null);

  const fetchOrders = useCallback(() => {
    getKitchenOrders()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        // Double-filter on the frontend as a safety guard
        setOrders(data.filter((o) => ACTIVE_STATUSES.includes(o.order_status)));
        setLastPoll(new Date());
        setError('');
      })
      .catch(() => setError('Failed to load kitchen orders.'))
      .finally(() => setLoading(false));
  }, []);

  // Initial load + auto-refresh every 5 seconds
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  /**
   * Called by StatusButtons when a chef clicks Mark as Ready or Mark as Delivered.
   * Sends the PATCH, then re-fetches so the board reflects server truth.
   * Delivered orders will naturally drop out because they no longer pass
   * the ACTIVE_STATUSES filter (and the backend excludes them too).
   */
  const handleStatusChange = useCallback(async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, { order_status: newStatus });
      fetchOrders(); // re-fetch immediately after update
    } catch {
      alert('Failed to update order status. Please try again.');
    }
  }, [fetchOrders]);

  const inProgressCount = orders.filter((o) => o.order_status === 'in_progress').length;
  const readyCount      = orders.filter((o) => o.order_status === 'ready').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Live Kitchen Feed</h1>
          <p className="text-white/50 mt-1">Orders shown in FIFO order</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Stats chips */}
          <div className="flex gap-2">
            <span className="stat-chip stat-pending">{inProgressCount} In Progress</span>
            <span className="stat-chip stat-ready">{readyCount} Ready</span>
          </div>
          {/* Live indicator */}
          <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Live
          </div>
        </div>
      </div>

      {/* Poll timestamp */}
      {lastPoll && (
        <p className="text-xs text-gray-400 mb-4">
          Last updated: {lastPoll.toLocaleTimeString()}
        </p>
      )}

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Board */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="spinner-lg" />
        </div>
      ) : (
        <KitchenBoard orders={orders} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
}
