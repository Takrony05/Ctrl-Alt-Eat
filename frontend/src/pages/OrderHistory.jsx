import React, { useEffect, useState } from 'react';
import { getOrders } from '../services/api';

const STATUS_STYLE = {
  in_progress: 'bg-amber-100 text-amber-700',
  ready:       'bg-emerald-100 text-emerald-700',
  delivered:   'bg-sky-100 text-sky-700',
  cancelled:   'bg-red-100 text-red-700',
};

const STATUS_LABEL = {
  in_progress: '⏳ In Progress',
  ready:       '✅ Ready',
  delivered:   '📦 Delivered',
  cancelled:   '❌ Cancelled',
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
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">📋</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
        <p className="text-gray-500">Your order history will appear here once you place an order.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Order History</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="glass-card p-5 rounded-2xl">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Order #{order.id}</p>
                <p className="font-bold text-gray-900 mt-0.5">Table {order.table_number}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLE[order.order_status] || 'bg-gray-100 text-gray-600'}`}>
                {STATUS_LABEL[order.order_status] || order.order_status}
              </span>
            </div>
            <ul className="space-y-1">
              {order.items.map((item) => (
                <li key={item.id} className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {item.quantity}
                  </span>
                  <span className="font-medium">{item.menu_item_name}</span>
                  {item.selected_addons?.length > 0 && (
                    <span className="text-gray-400 text-xs">
                      + {item.selected_addons.map((a) => a.name).join(', ')}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
