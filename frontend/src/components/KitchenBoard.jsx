import React from 'react';
import StatusButtons from './StatusButtons';
import { ClockIcon, NoteIcon, ChefHatIcon } from './Icons';

const STATUS_CONFIG = {
  in_progress: {
    label: 'In Progress',
    cardClass: 'order-card',
    badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
    badgeStyle: { background: 'rgba(232,146,60,0.12)', color: 'var(--orange-light)', border: '1px solid rgba(232,146,60,0.25)' }
  },
  ready: {
    label: 'Ready',
    cardClass: 'order-card order-card-ready',
    badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    badgeStyle: { background: 'rgba(52,211,153,0.12)', color: 'var(--success)', border: '1px solid rgba(52,211,153,0.25)' }
  },
};

function OrderCard({ order, onStatusChange }) {
  const config  = STATUS_CONFIG[order.order_status] || {};
  const created = new Date(order.created_at);
  const elapsed = Math.floor((Date.now() - created.getTime()) / 60000); // minutes

  return (
    <div className={config.cardClass || 'order-card'}>
      {/* Card header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--cream-subtle)' }}>
            Order #{order.id}
          </p>
          <h3 className="text-xl font-extrabold mt-0.5" style={{ color: 'var(--cream)' }}>
            Table {order.table_number}
          </h3>
          {order.created_by_name && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--cream-muted)' }}>by {order.created_by_name}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          {/* Status badge */}
          <span className="px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5" style={config.badgeStyle}>
            {config.label || order.order_status}
          </span>

          {/* Time info */}
          <span className="text-xs flex items-center gap-1" style={{ color: 'var(--cream-muted)' }}>
            <ClockIcon /> {created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className={`text-xs font-semibold ${elapsed > 10 ? 'text-red-400 animate-pulse' : ''}`} style={{ color: elapsed > 10 ? 'var(--danger)' : 'var(--cream-subtle)' }}>
            {elapsed < 1 ? 'Just now' : `${elapsed}m waiting`}
          </span>
        </div>
      </div>

      {/* Items list */}
      <ul className="space-y-3 mb-5">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-start gap-3 text-sm">
            {/* Quantity bubble */}
            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5" style={{ background: 'rgba(232,146,60,0.12)', color: 'var(--orange-light)' }}>
              {item.quantity}
            </span>

            <div className="flex-1">
              <span className="font-bold" style={{ color: 'var(--cream)' }}>{item.menu_item_name}</span>

              {/* Add-ons */}
              {item.selected_addons?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.selected_addons.map((addon) => (
                    <span
                      key={addon.id}
                      className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(250,243,232,0.04)', border: '1px solid var(--border)', color: 'var(--cream-muted)' }}
                    >
                      + {addon.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Special notes */}
              {item.notes && (
                <p className="text-xs rounded-lg px-2 py-1.5 mt-1.5 italic flex items-start gap-1.5" style={{ background: 'rgba(232,146,60,0.06)', border: '1px solid rgba(232,146,60,0.15)', color: 'var(--orange-light)' }}>
                  <NoteIcon className="flex-shrink-0 mt-0.5" /> {item.notes}
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

export default function KitchenBoard({ orders, onStatusChange }) {
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  if (sortedOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4" style={{ background: 'rgba(250,243,232,0.04)', color: 'var(--cream-muted)' }}>
          <ChefHatIcon />
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--cream)' }}>No active orders right now.</h3>
        <p style={{ color: 'var(--cream-subtle)' }}>New orders will appear here automatically.</p>
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
