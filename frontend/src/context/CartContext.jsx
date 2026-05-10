import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]); // [{ menuItem, quantity, selectedAddons, notes }]

  const addToCart = useCallback((menuItem, selectedAddons = [], notes = '') => {
    setCartItems((prev) => {
      // Find existing entry with same item AND same add-ons
      const addonIds = selectedAddons.map((a) => a.id).sort().join(',');
      const idx = prev.findIndex(
        (c) =>
          c.menuItem.id === menuItem.id &&
          c.selectedAddons.map((a) => a.id).sort().join(',') === addonIds
      );
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        return updated;
      }
      return [...prev, { menuItem, quantity: 1, selectedAddons, notes }];
    });
  }, []);

  const removeFromCart = useCallback((index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const decrementItem = useCallback((index) => {
    setCartItems((prev) => {
      const updated = [...prev];
      if (updated[index].quantity > 1) {
        updated[index] = { ...updated[index], quantity: updated[index].quantity - 1 };
      } else {
        updated.splice(index, 1);
      }
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const totalItems = cartItems.reduce((s, c) => s + c.quantity, 0);

  const grandTotal = cartItems.reduce((sum, c) => {
    const addonTotal = c.selectedAddons.reduce((s, a) => s + parseFloat(a.price || 0), 0);
    return sum + (parseFloat(c.menuItem.price) + addonTotal) * c.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, decrementItem, clearCart, totalItems, grandTotal,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
