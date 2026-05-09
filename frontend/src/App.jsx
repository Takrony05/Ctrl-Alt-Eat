import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

// Pages
import CheckoutPage       from './pages/CheckoutPage';
import OrderTrackingPage  from './pages/OrderTrackingPage';

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-900">
        <Routes>
          <Route path="/" element={<Navigate to="/checkout" replace />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/tracking/:orderId" element={<OrderTrackingPage />} />
          <Route path="*" element={<Navigate to="/checkout" replace />} />
        </Routes>
      </div>
    </CartProvider>
  );
}
