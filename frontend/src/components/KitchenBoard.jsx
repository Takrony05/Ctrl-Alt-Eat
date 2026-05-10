import React from 'react';
import StatusButtons from './StatusButtons';

const STATUS_CONFIG = {
  in_progress: {
    label: '⏳ In Progress',
    cardClass: 'order-card',
    badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  ready: {
    label: '✅ Ready',
    cardClass: 'order-card order-card-ready',
    badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
};

// ── Individual order card ─────────────────────────────────
function OrderCard({ order, onStatusChange }) {
  const config  = STATUS_CONFIG[order.order_status] || {};
  const created = new Date(order.created_at);
  const elapsed = Math.floor((Date.now() - created.getTime()) / 60000); // minutes

  return (
    <div className={config.cardClass || 'order-card'}>
      {/* Card header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Order #{order.id}
          </p>
          <h3 className="text-xl font-extrabold text-gray-900 mt-0.5">
            Table {order.table_number}
          </h3>
          {order.created_by_name && (
            <p className="text-xs text-gray-500 mt-0.5">by {order.created_by_name}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          {/* Status badge */}
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${config.badgeClass || ''}`}>
            {config.label || order.order_status}
          </span>

          {/* Time info */}
          <span className="text-xs text-gray-400">
            🕐 {created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className={`text-xs font-semibold ${elapsed > 10 ? 'text-red-500' : 'text-gray-400'}`}>
            {elapsed < 1 ? 'Just now' : `${elapsed}m waiting`}
          </span>
        </div>
      </div>

      {/* Items list */}
      <ul className="space-y-3 mb-5">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-start gap-3 text-sm">
            {/* Quantity bubble */}
            <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
              {item.quantity}
            </span>

            <div className="flex-1">
              <span className="font-bold text-gray-900">{item.menu_item_name}</span>

              {/* Add-ons — highlighted badges so chef can't miss them */}
              {item.selected_addons?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.selected_addons.map((addon) => (
                    <span
                      key={addon.id}
                      className="inline-block bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-full"
                    >
                      + {addon.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Special notes */}
              {item.notes && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1 mt-1 italic">
                  📝 {item.notes}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Status action buttons */}
      <StatusButtons order={order} onStatusChange={onStatusChange} />
    </div>
  );
}

// ── Kitchen board (sorts FIFO on the frontend as a safety backup) ──
export default function KitchenBoard({ orders, onStatusChange }) {
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  if (sortedOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">👨‍🍳</div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">No active orders right now.</h3>
        <p className="text-gray-400">New orders will appear here automatically.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {sortedOrders.map((order) => (
        <OrderCard key={order.id} order={order} onStatusChange={onStatusChange} />
      ))}
    </div>
  );
}
