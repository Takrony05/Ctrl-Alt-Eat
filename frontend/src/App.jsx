import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar      from './components/Navbar';
import Toast       from './components/Toast';

import Login        from './pages/Login';
import CreateOrder  from './pages/CreateOrder';
import Cart         from './pages/Cart';
import OrderPlaced  from './pages/OrderPlaced';
import Dashboard    from './pages/Dashboard';
import OrderHistory from './pages/OrderHistory';

// Pages from order_tracking-feat
import CheckoutPage       from './pages/CheckoutPage';
import OrderTrackingPage  from './pages/OrderTrackingPage';

import { useOrderSocket } from './hooks/useOrderSocket';
import ReadyNotification from './components/ReadyNotification';
import { getOrders } from './services/api';

// ─── Protected Route wrapper ──────────────────────────────
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner-lg" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Wrong role — redirect to their home
    return <Navigate to={user.role === 'chef' ? '/kitchen-dashboard' : '/menu'} replace />;
  }
  return children;
}

// ─── Inner app (needs auth context) ──────────────────────
function AppInner() {
  const { user } = useAuth();
  const [toasts, setToasts] = useState([]);
  const [showGlobalReady, setShowGlobalReady] = useState(false);

  const handleOrderReady = useCallback((event) => {
    // Only show toast and modal if this customer placed the order
    if (!user) return;
    if (user.role === 'customer' && Number(event.customer_id) === Number(user.id)) {
      const id = Date.now();
      setToasts((prev) => [
        ...prev,
        { id, message: event.message || 'Your order is ready!' },
      ]);
      setShowGlobalReady(true);
    }
  }, [user]);

  useOrderSocket(handleOrderReady);

  const notifiedOrdersRef = useRef(new Set());
  const isFirstCheckRef = useRef(true);

  // Background polling fallback for order readiness (in case WebSockets are blocked/not working)
  useEffect(() => {
    if (!user || user.role !== 'customer') return;

    const checkActiveOrders = async () => {
      try {
        const res = await getOrders();
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        
        // Find any order that is ready
        const readyOrders = data.filter(o => o.order_status === 'ready' || o.status === 'ready');
        
        readyOrders.forEach(order => {
          if (!notifiedOrdersRef.current.has(order.id)) {
            // First time seeing this order marked ready, register it
            notifiedOrdersRef.current.add(order.id);
            
            // Only trigger popup/toast if this is not the initial load check
            if (!isFirstCheckRef.current) {
              setShowGlobalReady(true);
              
              const toastId = Date.now() + order.id;
              setToasts((prev) => [
                ...prev,
                { id: toastId, message: `Order #${order.id} is ready to be picked up!` },
              ]);
            }
          }
        });
        
        // Mark that the initial load check is completed
        isFirstCheckRef.current = false;
      } catch (err) {
        console.error('Background order check error:', err);
      }
    };

    checkActiveOrders();
    const interval = setInterval(checkActiveOrders, 5000);

    return () => clearInterval(interval);
  }, [user]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Customer routes */}
          <Route path="/menu" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CreateOrder />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="/tracking/:orderId" element={
            <ProtectedRoute>
              <OrderTrackingPage />
            </ProtectedRoute>
          } />
          <Route path="/order-placed" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <OrderPlaced />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <OrderHistory />
            </ProtectedRoute>
          } />

          {/* Chef routes */}
          <Route path="/kitchen-dashboard" element={
            <ProtectedRoute allowedRoles={['chef']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          {/* Legacy alias — redirects to the canonical chef route */}
          <Route path="/chef" element={<Navigate to="/kitchen-dashboard" replace />} />

          {/* Redirects */}
          <Route path="/" element={
            user
              ? <Navigate to={user.role === 'chef' ? '/kitchen-dashboard' : '/menu'} replace />
              : <Navigate to="/login" replace />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Toast stack */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            onClose={() => dismissToast(t.id)}
          />
        ))}
      </div>

      {showGlobalReady && (
        <ReadyNotification onDismiss={() => setShowGlobalReady(false)} />
      )}
    </div>
  );
}

// ─── Root App with providers ──────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppInner />
      </CartProvider>
    </AuthProvider>
  );
}
