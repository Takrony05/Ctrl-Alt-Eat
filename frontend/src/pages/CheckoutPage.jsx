import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import PaymentOptions from '../components/PaymentOptions';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, grandTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [payMethod, setPayMethod] = useState('card');
  const [tableNumber, setTableNumber] = useState(1);

  async function handlePlaceOrder() {
    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const payload = {
        table_number: tableNumber,
        items: cartItems.map((item) => ({
          menu_item: item.menuItem.id,
          quantity: item.quantity,
          selected_addons: (item.selectedAddons || []).map((addon) => addon.id),
          notes: item.notes || '',
        })),
      };

      const res = await orderAPI.create(payload);
      clearCart();
      navigate(`/tracking/${res.data.id}`);
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        'Failed to place order. Please check your backend connection.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const lineTotal = (item) => {
    const addonTotal = (item.selectedAddons || []).reduce(
      (sum, addon) => sum + Number(addon.price || 0),
      0
    );
    return (Number(item.menuItem.price) + addonTotal) * item.quantity;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-2xl animate-fade-in-up">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black gradient-text">Checkout</h1>
          <p className="text-white/40 mt-2">Complete your order to start cooking</p>
        </header>

        <main className="space-y-8">
          <section className="card glass">
            <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">
              Order Summary
            </h2>

            <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">
              Table Number
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={tableNumber}
              onChange={(event) => setTableNumber(Number(event.target.value))}
              className="mb-5 w-28 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-orange-400"
            />

            <div className="space-y-4">
              {cartItems.length === 0 ? (
                <p className="text-white/30 italic">No items in cart</p>
              ) : (
                cartItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-start border-b border-white/5 pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-bold">{item.quantity}x {item.menuItem.name}</p>
                      {item.selectedAddons?.length > 0 && (
                        <p className="text-xs text-white/40 mt-1">
                          {item.selectedAddons.map((addon) => addon.name).join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-amber-400">
                      ${lineTotal(item).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-xl font-bold">Total</span>
                <span className="text-3xl font-black gradient-text">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4 px-2">
              Select Payment
            </h2>
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
            {loading ? 'Processing...' : 'Pay & Order Now'}
          </button>

          <p className="text-center text-white/20 text-xs">
            Demo Mode: No real charges will be made.
          </p>
        </main>
      </div>
    </div>
  );
}
