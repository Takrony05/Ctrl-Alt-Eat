import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import PaymentOptions from '../components/PaymentOptions';
import { RocketIcon, MainMealIcon, DessertIcon, DrinkIcon, SideIcon, PlateIcon } from '../components/Icons';

const CATEGORY_ICONS = {
  'Main Meal': <MainMealIcon />,
  'Dessert':   <DessertIcon />,
  'Drink':     <DrinkIcon />,
  'Side':      <SideIcon />,
};

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
        items: cartItems.map(item => ({
          menu_item: item.menuItem.id,
          quantity: item.quantity,
          selected_addons: (item.selectedAddons || []).map(a => typeof a === 'object' ? a.id : a),
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
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center py-12 px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-2xl animate-fade-in-up relative z-10">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black gradient-text">Checkout</h1>
          <p className="mt-2" style={{ color: 'var(--cream-muted)' }}>Complete your order to start cooking</p>
        </header>

        <main className="space-y-8">
          <section className="card">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--cream-subtle)' }}>Order Summary</h2>

            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--cream-subtle)' }}>
              Table Number
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={tableNumber}
              onChange={(event) => setTableNumber(Number(event.target.value))}
              className="mb-5 w-28 rounded-xl px-3 py-2 outline-none border focus:border-[var(--orange)]"
              style={{
                background: 'rgba(var(--glass-color), 0.04)',
                borderColor: 'var(--border)',
                color: 'var(--cream)'
              }}
            />
            <div className="space-y-4">
              {cartItems.length === 0 ? (
                <p className="italic" style={{ color: 'var(--cream-subtle)' }}>No items in cart</p>
              ) : (
                cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center pb-4 last:border-0 last:pb-0" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-lg flex-shrink-0 relative overflow-hidden bg-[rgba(var(--glass-color),0.02)] border" style={{ borderColor: 'var(--border)' }}>
                        {item.menuItem.image_url ? (
                          <img src={item.menuItem.image_url} alt={item.menuItem.name} className="w-full h-full object-cover" 
                            onError={(e) => { e.target.style.display = 'none'; if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'; }} />
                        ) : null}
                        <div className={`absolute inset-0 items-center justify-center ${item.menuItem.image_url ? 'hidden' : 'flex'}`}>
                          <span className="text-xl opacity-20" style={{ color: 'var(--cream)' }}>
                             {CATEGORY_ICONS[item.menuItem.category] || <PlateIcon />}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: 'var(--cream)' }}>{item.quantity}× {item.menuItem.name}</p>
                        {item.selectedAddons?.length > 0 && (
                          <p className="text-xs mt-1" style={{ color: 'var(--cream-subtle)' }}>{item.selectedAddons.map(a => a.name).join(', ')}</p>
                        )}
                      </div>
                    </div>
                    <span className="font-bold" style={{ color: 'var(--orange)' }}>
                      ${lineTotal(item).toFixed(2)}
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
