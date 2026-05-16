import React, { useState } from 'react';
import { CheckCircleIcon, PackageIcon } from './Icons';

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

  if (order.order_status === 'in_progress') {
    return (
      <div>
        <button
          onClick={() => handleChange('ready')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 font-bold py-2.5 px-4 rounded-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, var(--orange), var(--orange-dark))', color: 'white', boxShadow: '0 4px 15px rgba(232,146,60,0.3)' }}
        >
          {loading ? (
            <><span className="spinner spinner-white" /> Updating...</>
          ) : (
            <><CheckCircleIcon /> Mark as Ready</>
          )}
        </button>
        {error && <p className="text-xs mt-1.5 text-center" style={{ color: 'var(--danger)' }}>{error}</p>}
      </div>
    );
  }

  if (order.order_status === 'ready') {
    return (
      <div>
        <button
          onClick={() => handleChange('delivered')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 font-bold py-2.5 px-4 rounded-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, var(--success-dark), var(--success))', color: 'white', boxShadow: '0 4px 15px rgba(52,211,153,0.3)' }}
        >
          {loading ? (
            <><span className="spinner spinner-white" /> Updating...</>
          ) : (
            <><PackageIcon /> Mark as Delivered</>
          )}
        </button>
        {error && <p className="text-xs mt-1.5 text-center" style={{ color: 'var(--danger)' }}>{error}</p>}
      </div>
    );
  }

  return null;
}
