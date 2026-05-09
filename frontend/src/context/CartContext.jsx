import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

// Pre-built cart object handed off from the browsing slice
const INITIAL_CART = [
  {
    menu_item: 1, // ID of Gourmet Burger from seed data
    name: "Gourmet Burger",
    quantity: 2,
    selected_addons: [1], // ID of Extra Sauce
    price: 12.99
  }
];

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(INITIAL_CART);

  const cartTotal = cartItems.reduce(
    (sum, i) => sum + i.quantity * parseFloat(i.price),
    0
  );

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, cartTotal, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
