import React, { useState } from 'react';
import { updateOrderStatus } from '../services/api';

export default function StatusButtons({ order, onStatusChange }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const isReady = order.order_status === 'ready';

  const handleMarkReady = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await updateOrderStatus(order.id, { order_status: 'ready' });
      onStatusChange(res.data);
    } catch (err) {
      setError('Failed to update. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isReady) {
    return (
      <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm bg-emerald-50 rounded-xl px-4 py-2.5">
        <span className="text-base">✅</span> Marked as Ready
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleMarkReady}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-orange-200"
      >
        {loading ? (
          <>
            <span className="spinner spinner-white" /> Updating…
          </>
        ) : (
          <>
            <span>🔔</span> Mark as Ready
          </>
        )}
      </button>
      {error && <p className="text-red-500 text-xs mt-1.5 text-center">{error}</p>}
    </div>
  );
}
