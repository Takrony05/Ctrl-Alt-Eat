import { useEffect, useRef } from 'react';
import { orderAPI } from '../services/api';

/**
 * Component that polls the order status every few seconds.
 * It doesn't render anything itself, just handles the logic.
 */
export default function OrderStatusPoller({ orderId, onStatusChange, interval = 4000 }) {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchStatus = async () => {
      try {
        const res = await orderAPI.getById(orderId);
        onStatusChange(res.data.status);
      } catch (err) {
        console.error('Polling error:', err);
      }
    };

    // Initial fetch
    fetchStatus();

    // Start interval
    intervalRef.current = setInterval(fetchStatus, interval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [orderId, onStatusChange, interval]);

  return null;
}
