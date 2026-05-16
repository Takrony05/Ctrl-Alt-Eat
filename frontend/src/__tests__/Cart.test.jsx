import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';

const TestComponent = () => {
  const { cartItems, addToCart, removeFromCart, decrementItem, clearCart, grandTotal } = useCart();
  return (
    <div>
      <div data-testid="total-price">{grandTotal.toFixed(2)}</div>
      <div data-testid="item-count">{cartItems.length}</div>
      <button onClick={() => addToCart({ id: 1, name: 'Burger', price: '10.00' }, [{ id: 10, price: '2.00' }])}>
        Add Burger
      </button>
      <button onClick={() => removeFromCart(0)}>Remove First</button>
      <button onClick={() => clearCart()}>Clear</button>
    </div>
  );
};

describe('CartContext', () => {
  test('should add items and calculate total', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addButton = screen.getByText('Add Burger');
    act(() => {
      addButton.click();
    });

    expect(screen.getByTestId('item-count').textContent).toBe('1');
    expect(screen.getByTestId('total-price').textContent).toBe('12.00'); // 10 + 2
  });

  test('should clear cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addButton = screen.getByText('Add Burger');
    const clearButton = screen.getByText('Clear');

    act(() => {
      addButton.click();
      clearButton.click();
    });

    expect(screen.getByTestId('item-count').textContent).toBe('0');
    expect(screen.getByTestId('total-price').textContent).toBe('0.00');
  });
});
