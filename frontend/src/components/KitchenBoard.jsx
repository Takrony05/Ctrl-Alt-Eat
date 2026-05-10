import React, { useState } from 'react';
import StatusButtons from './StatusButtons';

const STATUS_COLORS = {
  in_progress: 'bg-amber-100 text-amber-700 border-amber-200',
  ready:       'bg-emerald-100 text-emerald-700 border-emerald-200',
  delivered:   'bg-sky-100 text-sky-700 border-sky-200',
  cancelled:   'bg-red-100 text-red-700 border-red-200',
};

const STATUS_LABELS = {
  in_progress: '⏳ In Progress',
  ready:       '✅ Ready',
  delivered:   '📦 Delivered',
  cancelled:   '❌ Cancelled',
};

function OrderCard({ order, onStatusChange }) {
  const created = new Date(order.created_at);
  const elapsed = Math.floor((Date.now() - created.getTime()) / 60000); // minutes

  return (
    <div className={`order-card ${order.order_status === 'ready' ? 'order-card-ready' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Order #{order.id}</p>
          <h3 className="text-xl font-extrabold text-gray-900 mt-0.5">Table {order.table_number}</h3>
          {order.created_by_name && (
            <p className="text-xs text-gray-500 mt-0.5">by {order.created_by_name}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[order.order_status] || ''}`}>
            {STATUS_LABELS[order.order_status] || order.order_status}
          </span>
          <span className={`text-xs font-medium ${elapsed > 10 ? 'text-red-500' : 'text-gray-400'}`}>
            {elapsed < 1 ? 'Just now' : `${elapsed}m ago`}
          </span>
        </div>
      </div>

      {/* Items */}
      <ul className="space-y-2 mb-5">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-start gap-2 text-sm">
            <span className="flex-shrink-0 w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
              {item.quantity}
            </span>
            <div>
              <span className="font-semibold text-gray-900">{item.menu_item_name}</span>
              {item.selected_addons?.length > 0 && (
                <span className="text-gray-400 text-xs ml-1">
                  + {item.selected_addons.map((a) => a.name).join(', ')}
                </span>
              )}
              {item.notes && (
                <p className="text-xs text-amber-600 italic mt-0.5">📝 {item.notes}</p>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Action */}
      <StatusButtons order={order} onStatusChange={onStatusChange} />
    </div>
  );
}

export default function KitchenBoard({ orders, onStatusChange }) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">👨‍🍳</div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">No active orders</h3>
        <p className="text-gray-400">New orders will appear here automatically.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} onStatusChange={onStatusChange} />
      ))}
    </div>
  );
}
