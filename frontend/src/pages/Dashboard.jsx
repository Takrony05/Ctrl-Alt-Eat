import React, { useEffect, useState, useCallback } from 'react';
import KitchenBoard from '../components/KitchenBoard';
import { getKitchenOrders, updateOrderStatus } from '../services/api';

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
        setOrders(data.filter((o) => ACTIVE_STATUSES.includes(o.order_status)));
        setLastPoll(new Date());
        setError('');
      })
      .catch(() => setError('Failed to load kitchen orders.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleStatusChange = useCallback(async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, { order_status: newStatus });
      fetchOrders();
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
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--cream)' }}>Live Kitchen Feed</h1>
          <p className="mt-1" style={{ color: 'var(--cream-muted)' }}>Orders shown in FIFO order</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <span className="stat-chip stat-pending">{inProgressCount} In Progress</span>
            <span className="stat-chip stat-ready">{readyCount} Ready</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full" style={{ background: 'rgba(52,211,153,0.1)', color: 'var(--success)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--success)' }} />
            Live
          </div>
        </div>
      </div>

      {lastPoll && (
        <p className="text-xs mb-4" style={{ color: 'var(--cream-subtle)' }}>
          Last updated: {lastPoll.toLocaleTimeString()}
        </p>
      )}

      {error && (
        <div className="rounded-2xl p-4 mb-6 text-sm" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

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
