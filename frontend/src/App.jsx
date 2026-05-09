import React, { useState, useCallback } from 'react';
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

import { useOrderSocket } from './hooks/useOrderSocket';

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
    return <Navigate to={user.role === 'chef' ? '/chef' : '/menu'} replace />;
  }
  return children;
}

// ─── Inner app (needs auth context) ──────────────────────
function AppInner() {
  const { user } = useAuth();
  const [toasts, setToasts] = useState([]);

  const handleOrderReady = useCallback((event) => {
    // Only show toast if this customer placed the order
    if (!user) return;
    if (user.role === 'customer') {
      // Show if the order belongs to this customer or role is customer (broadcast)
      const id = Date.now();
      setToasts((prev) => [
        ...prev,
        { id, message: event.message || 'Your order is ready to be picked up!' },
      ]);
    }
  }, [user]);

  useOrderSocket(handleOrderReady);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
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
          <Route path="/order-placed" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <OrderPlaced />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          } />

          {/* Chef routes */}
          <Route path="/chef" element={
            <ProtectedRoute allowedRoles={['chef']}>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Redirects */}
          <Route path="/" element={
            user
              ? <Navigate to={user.role === 'chef' ? '/chef' : '/menu'} replace />
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
