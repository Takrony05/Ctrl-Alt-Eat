import React, { useEffect, useState, useCallback } from 'react';
import KitchenBoard from '../components/KitchenBoard';
import { getDashboard } from '../services/api';

export default function Dashboard() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [lastPoll, setLastPoll] = useState(null);

  const fetchOrders = useCallback(() => {
    getDashboard()
      .then((res) => {
        // DRF router returns array; dashboard is a ReadOnlyModelViewSet list
        setOrders(Array.isArray(res.data) ? res.data : res.data.results || []);
        setLastPoll(new Date());
        setError('');
      })
      .catch(() => setError('Could not load orders.'))
      .finally(() => setLoading(false));
  }, []);

  // Initial load + poll every 10 seconds
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleStatusChange = useCallback((updatedOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
        .filter((o) => o.order_status === 'in_progress' || o.order_status === 'ready')
    );
  }, []);

  const pendingCount = orders.filter((o) => o.order_status === 'in_progress').length;
  const readyCount   = orders.filter((o) => o.order_status === 'ready').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Live Kitchen Feed</h1>
          <p className="text-gray-500 mt-1">Orders shown in FIFO order</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Stats chips */}
          <div className="flex gap-2">
            <span className="stat-chip stat-pending">{pendingCount} In Progress</span>
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

      {/* Error */}
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
