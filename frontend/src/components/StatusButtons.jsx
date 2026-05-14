import React, { useState } from 'react';

/**
 * StatusButtons — renders the correct action button based on the order's
 * current status and calls onStatusChange(orderId, newStatus) on click.
 *
 * Status flow handled here:
 *   in_progress  →  [Mark as Ready]     → ready
 *   ready        →  [Mark as Delivered] → delivered  (disappears from board)
 */
export default function StatusButtons({ order, onStatusChange }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = async (newStatus) => {
    setLoading(true);
    setError('');
    try {
      await onStatusChange(order.id, newStatus);
    } catch {
      setError('Failed to update. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // Order is in_progress → show "Mark as Ready"
  if (order.order_status === 'in_progress') {
    return (
      <div>
        <button
          onClick={() => handleChange('ready')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-orange-200"
        >
          {loading ? (
            <><span className="spinner spinner-white" /> Updating…</>
          ) : (
            <><span>🔔</span> Mark as Ready</>
          )}
        </button>
        {error && <p className="text-red-500 text-xs mt-1.5 text-center">{error}</p>}
      </div>
    );
  }

  // Order is ready → show "Mark as Delivered"
  if (order.order_status === 'ready') {
    return (
      <div>
        <button
          onClick={() => handleChange('delivered')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-emerald-200"
        >
          {loading ? (
            <><span className="spinner spinner-white" /> Updating…</>
          ) : (
            <><span>📦</span> Mark as Delivered</>
          )}
        </button>
        {error && <p className="text-red-500 text-xs mt-1.5 text-center">{error}</p>}
      </div>
    );
  }

  // Any other status — no action available
  return null;
}
