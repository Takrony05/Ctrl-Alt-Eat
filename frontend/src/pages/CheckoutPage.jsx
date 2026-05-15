import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import PaymentOptions from '../components/PaymentOptions';
import { RocketIcon } from '../components/Icons';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, grandTotal } = useCart();
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
          menu_item: item.menuItem.id, // using menuItem because CartContext sets it as such
          quantity: item.quantity,
          selected_addons: (item.selectedAddons || []).map(a => typeof a === 'object' ? a.id : a),
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
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center py-12 px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-2xl animate-fade-in-up relative z-10">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black gradient-text">Checkout</h1>
          <p className="mt-2" style={{ color: 'var(--cream-muted)' }}>Complete your order to start cooking</p>
        </header>

        <main className="space-y-8">
          {/* Order summary */}
          <section className="card">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--cream-subtle)' }}>Order Summary</h2>
            <div className="space-y-4">
              {cartItems.length === 0 ? (
                <p className="italic" style={{ color: 'var(--cream-subtle)' }}>No items in cart</p>
              ) : (
                cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start pb-4 last:border-0 last:pb-0" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <p className="font-bold" style={{ color: 'var(--cream)' }}>{item.quantity}× {item.menuItem.name}</p>
                      {item.selectedAddons?.length > 0 && (
                        <p className="text-xs mt-1" style={{ color: 'var(--cream-subtle)' }}>{item.selectedAddons.map(a => a.name).join(', ')}</p>
                      )}
                    </div>
                    <span className="font-bold" style={{ color: 'var(--orange)' }}>
                      ${((parseFloat(item.menuItem.price) + item.selectedAddons.reduce((s, a) => s + parseFloat(a.price || 0), 0)) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
              <div className="pt-4 flex justify-between items-center" style={{ borderTop: '1px solid var(--border)' }}>
                <span className="text-xl font-bold" style={{ color: 'var(--cream)' }}>Total</span>
                <span className="text-3xl font-black gradient-text">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-4 px-2" style={{ color: 'var(--cream-subtle)' }}>Select Payment</h2>
            <PaymentOptions selected={payMethod} onSelect={setPayMethod} />
          </section>

          {error && (
            <div className="p-4 rounded-xl text-sm animate-fade-in text-center" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: 'var(--danger)' }}>
              {error}
            </div>
          )}

          <button
            id="checkout-pay-btn"
            onClick={handlePlaceOrder}
            disabled={loading || cartItems.length === 0}
            className="w-full py-5 text-xl font-black shadow-2xl animate-pulse-glow flex items-center justify-center gap-3 transition-all duration-300 rounded-xl"
            style={{ 
              background: 'linear-gradient(135deg, var(--orange), var(--orange-dark))', 
              color: 'white',
              opacity: (loading || cartItems.length === 0) ? 0.5 : 1
            }}
          >
            {loading ? 'Processing...' : <><RocketIcon /> Pay & Order Now</>}
          </button>

          <p className="text-center text-xs" style={{ color: 'var(--cream-subtle)' }}>
            Demo Mode: No real charges will be made.
          </p>
        </main>
      </div>
    </div>
  );
}
