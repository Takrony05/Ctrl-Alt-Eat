import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/api';

export default function Cart() {
  const { cartItems, removeFromCart, decrementItem, addToCart, clearCart, grandTotal, totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tableNumber, setTableNumber] = useState(1);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState('');

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        table_number: tableNumber,
        items: cartItems.map((c) => ({
          menu_item: c.menuItem.id,
          quantity: c.quantity,
          selected_addons: c.selectedAddons.map((a) => a.id),
          notes: c.notes || '',
        })),
      };
      await placeOrder(payload);
      clearCart();
      navigate('/order-placed');
    } catch (err) {
      const data = err?.response?.data;
      setError(data ? JSON.stringify(data) : 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some items from the menu to get started.</p>
        <button onClick={() => navigate('/menu')} className="btn-primary">
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Your Cart</h1>
        <button onClick={() => navigate('/menu')} className="text-sm text-orange-500 hover:underline font-medium">
          ← Back to Menu
        </button>
      </div>

      {/* Table Number */}
      <div className="glass-card p-4 rounded-2xl mb-4 flex items-center gap-4">
        <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">Table Number</label>
        <input
          type="number"
          min={1}
          value={tableNumber}
          onChange={(e) => setTableNumber(Number(e.target.value))}
          className="input-field w-24 text-center"
        />
      </div>

      {/* Cart Items */}
      <div className="space-y-3 mb-6">
        {cartItems.map((c, idx) => {
          const addonExtra = c.selectedAddons.reduce((s, a) => s + parseFloat(a.price || 0), 0);
          const lineTotal  = (parseFloat(c.menuItem.price) + addonExtra) * c.quantity;
          return (
            <div key={idx} className="glass-card p-4 rounded-2xl flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">{c.menuItem.name}</p>
                {c.selectedAddons.length > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    + {c.selectedAddons.map((a) => a.name).join(', ')}
                  </p>
                )}
                <p className="text-orange-500 font-bold text-sm mt-1">${lineTotal.toFixed(2)}</p>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => decrementItem(idx)}
                  className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition"
                >
                  −
                </button>
                <span className="w-5 text-center font-semibold text-gray-900">{c.quantity}</span>
                <button
                  onClick={() => addToCart(c.menuItem, c.selectedAddons, c.notes)}
                  className="w-7 h-7 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-600 font-bold text-sm transition"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(idx)}
                  className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 text-red-500 text-sm transition ml-1"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="glass-card p-5 rounded-2xl mb-4">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-900 text-lg">Grand Total</span>
          <span className="font-extrabold text-orange-500 text-2xl">${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      {/* Place Order */}
      <button
        onClick={handlePlaceOrder}
        disabled={submitting}
        className="w-full btn-primary text-lg py-4"
      >
        {submitting
          ? <span className="flex items-center justify-center gap-2"><span className="spinner" /> Placing Order…</span>
          : `🍽️  Place Order — $${grandTotal.toFixed(2)}`
        }
      </button>
    </div>
  );
}
