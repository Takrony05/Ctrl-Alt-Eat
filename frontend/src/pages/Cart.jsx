import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/api';
import PaymentOptions from '../components/PaymentOptions';
import { CartIcon, ArrowLeftIcon, PlusIcon, MinusIcon, TrashIcon } from '../components/Icons';

export default function Cart() {
  const { cartItems, removeFromCart, decrementItem, addToCart, clearCart, grandTotal, totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tableNumber, setTableNumber] = useState(1);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState('');
  const [payMethod, setPayMethod]     = useState('card');

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
        <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl" style={{ background: 'rgba(232,146,60,0.1)', color: 'var(--orange)' }}>
          <CartIcon />
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--cream)' }}>Your cart is empty</h2>
        <p className="mb-6" style={{ color: 'var(--cream-muted)' }}>Add some items from the menu to get started.</p>
        <button onClick={() => navigate('/menu')} className="btn-primary">Browse Menu</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--cream)' }}>Your Cart</h1>
        <button onClick={() => navigate('/menu')} className="text-sm font-medium flex items-center gap-1 transition hover:gap-2" style={{ color: 'var(--orange)' }}>
          <ArrowLeftIcon /> Back to Menu
        </button>
      </div>

      {/* Table Number */}
      <div className="glass-card p-4 rounded-2xl mb-4 flex items-center gap-4">
        <label className="text-sm font-semibold whitespace-nowrap" style={{ color: 'var(--cream-muted)' }}>Table Number</label>
        <input type="number" min={1} value={tableNumber} onChange={(e) => setTableNumber(Number(e.target.value))} className="input-field w-24 text-center" />
      </div>

      {/* Cart Items */}
      <div className="space-y-3 mb-6">
        {cartItems.map((c, idx) => {
          const addonExtra = c.selectedAddons.reduce((s, a) => s + parseFloat(a.price || 0), 0);
          const lineTotal  = (parseFloat(c.menuItem.price) + addonExtra) * c.quantity;
          return (
            <div key={idx} className="glass-card p-4 rounded-2xl flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate" style={{ color: 'var(--cream)' }}>{c.menuItem.name}</p>
                {c.selectedAddons.length > 0 && (
                  <p className="text-xs mt-0.5" style={{ color: 'var(--cream-subtle)' }}>
                    + {c.selectedAddons.map((a) => a.name).join(', ')}
                  </p>
                )}
                <p className="font-bold text-sm mt-1" style={{ color: 'var(--orange)' }}>${lineTotal.toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => decrementItem(idx)}
                  className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm transition"
                  style={{ background: 'rgba(250,243,232,0.06)', color: 'var(--cream-muted)' }}>
                  <MinusIcon />
                </button>
                <span className="w-5 text-center font-semibold" style={{ color: 'var(--cream)' }}>{c.quantity}</span>
                <button onClick={() => addToCart(c.menuItem, c.selectedAddons, c.notes)}
                  className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm transition"
                  style={{ background: 'rgba(232,146,60,0.12)', color: 'var(--orange)' }}>
                  <PlusIcon />
                </button>
                <button onClick={() => removeFromCart(idx)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm transition ml-1"
                  style={{ background: 'rgba(248,113,113,0.08)', color: 'var(--danger)' }}
                  title="Remove">
                  <TrashIcon />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Options */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-3 ml-1" style={{ color: 'var(--cream-subtle)' }}>Payment Method</h2>
        <PaymentOptions selected={payMethod} onSelect={setPayMethod} />
      </div>

      {/* Summary */}
      <div className="glass-card p-5 rounded-2xl mb-4">
        <div className="flex items-center justify-between text-sm mb-2" style={{ color: 'var(--cream-muted)' }}>
          <span>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg" style={{ color: 'var(--cream)' }}>Grand Total</span>
          <span className="font-extrabold text-2xl gradient-text">${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl px-4 py-3 text-sm mb-4" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      <button onClick={handlePlaceOrder} disabled={submitting} className="w-full btn-primary text-lg py-4">
        {submitting
          ? <span className="flex items-center justify-center gap-2"><span className="spinner" /> Placing Order...</span>
          : `Place Order — $${grandTotal.toFixed(2)}`
        }
      </button>
    </div>
  );
}
