import { useEffect, useRef, useCallback } from 'react';

const WS_URL = 'ws://localhost:8000/ws/orders/';

/**
 * useOrderSocket — connects to the Django Channels WebSocket and calls
 * onOrderReady(event) whenever an "order_ready" message is received.
 */
export function useOrderSocket(onOrderReady) {
  const wsRef      = useRef(null);
  const retryRef   = useRef(null);
  const mountedRef = useRef(true);

  const connect = useCallback(() => {
    if (!mountedRef.current) return;
    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.type === 'order_ready') {
            onOrderReady(data);
          }
        } catch (_) {}
      };

      ws.onclose = () => {
        // Auto-reconnect after 3 seconds
        if (mountedRef.current) {
          retryRef.current = setTimeout(connect, 3000);
        }
      };

      ws.onerror = () => ws.close();
    } catch (_) {
      // WebSocket not available — silent failure (polling still works)
    }
  }, [onOrderReady]);

  useEffect(() => {
    mountedRef.current = true;
    connect();
    return () => {
      mountedRef.current = false;
      clearTimeout(retryRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connect]);
}
