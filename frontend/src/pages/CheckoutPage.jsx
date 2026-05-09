import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import PaymentOptions from '../components/PaymentOptions';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [payMethod, setPayMethod] = useState('card');

  async function handlePlaceOrder() {
    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const payload = {
        items: cartItems.map(item => ({
          menu_item: item.menu_item,
          quantity: item.quantity,
          selected_addons: (item.selected_addons || []).map(a => typeof a === 'object' ? a.id : a),
          notes: item.notes || '',
        })),
      };
      const res = await orderAPI.create(payload);
      const orderId = res.data.id;
      // We don't clear cart here for the demo so user can re-order if they want, 
      // but in real app we might. Let's keep it minimal.
      navigate(`/tracking/${orderId}`);
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        'Failed to place order. Please check your backend connection.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-2xl animate-fade-in-up">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black gradient-text">Checkout</h1>
          <p className="text-white/40 mt-2">Complete your order to start cooking</p>
        </header>

        <main className="space-y-8">
          {/* Order summary */}
          <section className="card glass">
            <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.length === 0 ? (
                <p className="text-white/30 italic">No items in cart</p>
              ) : (
                cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-bold">{item.quantity}× {item.name}</p>
                      {item.add_ons?.length > 0 && (
                        <p className="text-xs text-white/40 mt-1">{item.add_ons.join(', ')}</p>
                      )}
                    </div>
                    <span className="font-bold text-amber-400">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))
              )}
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-xl font-bold">Total</span>
                <span className="text-3xl font-black gradient-text">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4 px-2">Select Payment</h2>
            <PaymentOptions selected={payMethod} onSelect={setPayMethod} />
          </section>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in text-center">
              {error}
            </div>
          )}

          <button
            id="checkout-pay-btn"
            onClick={handlePlaceOrder}
            disabled={loading || cartItems.length === 0}
            className="btn-primary w-full py-5 text-xl font-black shadow-2xl animate-pulse-glow"
          >
            {loading ? 'Processing...' : `Pay & Order Now`}
          </button>

          <p className="text-center text-white/20 text-xs">
            Demo Mode: No real charges will be made.
          </p>
        </main>
      </div>
    </div>
  );
}
