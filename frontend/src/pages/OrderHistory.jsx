import React, { useEffect, useState } from 'react';
import { getOrders } from '../services/api';
import { HistoryIcon } from '../components/Icons';

const STATUS_STYLE = {
  in_progress: { bg: 'rgba(232,146,60,0.1)', color: 'var(--orange-light)', border: '1px solid rgba(232,146,60,0.2)' },
  preparing:   { bg: 'rgba(232,146,60,0.1)', color: 'var(--orange-light)', border: '1px solid rgba(232,146,60,0.2)' },
  ready:       { bg: 'rgba(52,211,153,0.1)', color: 'var(--success)', border: '1px solid rgba(52,211,153,0.2)' },
  delivered:   { bg: 'rgba(56,189,248,0.1)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.2)' },
  cancelled:   { bg: 'rgba(248,113,113,0.1)', color: 'var(--danger)', border: '1px solid rgba(248,113,113,0.2)' },
};

const STATUS_LABEL = {
  in_progress: 'Preparing',
  preparing:   'Preparing',
  ready:       'Ready',
  delivered:   'Delivered',
  cancelled:   'Cancelled',
};

export default function OrderHistory() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    getOrders()
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : res.data.results || []))
      .catch(() => setError('Failed to load order history.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="spinner-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 text-center">
        <p style={{ color: 'var(--danger)' }}>{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl" style={{ background: 'rgba(250,243,232,0.05)', color: 'var(--cream-muted)' }}>
          <HistoryIcon />
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--cream)' }}>No orders yet</h2>
        <p style={{ color: 'var(--cream-subtle)' }}>Your order history will appear here once you place an order.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-extrabold mb-6" style={{ color: 'var(--cream)' }}>Order History</h1>
      <div className="space-y-4">
        {orders.map((order) => {
          const style = STATUS_STYLE[order.order_status] || { bg: 'rgba(250,243,232,0.1)', color: 'var(--cream-muted)', border: '1px solid var(--border)' };
          return (
            <div key={order.id} className="glass-card p-5 rounded-2xl">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--cream-subtle)' }}>Order #{order.id}</p>
                  <p className="font-bold mt-0.5" style={{ color: 'var(--cream)' }}>Table {order.table_number}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--cream-muted)' }}>
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: style.bg, color: style.color, border: style.border }}>
                  {STATUS_LABEL[order.order_status] || order.order_status}
                </span>
              </div>
              <ul className="space-y-1">
                {order.items.map((item) => (
                  <li key={item.id} className="text-sm flex items-center gap-2" style={{ color: 'var(--cream)' }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: 'rgba(232,146,60,0.12)', color: 'var(--orange-light)' }}>
                      {item.quantity}
                    </span>
                    <span className="font-medium">{item.menu_item_name}</span>
                    {item.selected_addons?.length > 0 && (
                      <span className="text-xs" style={{ color: 'var(--cream-subtle)' }}>
                        + {item.selected_addons.map((a) => a.name).join(', ')}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
