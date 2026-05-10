import React from 'react';
// This component serves as the container for order creation logic
// In our implementation, the menu browsing and adding to cart is handled in CreateOrder.jsx
// but we keep this file to match the requested folder structure.

const OrderForm = ({ children }) => {
  return (
    <div className="order-form-container">
      {children}
    </div>
  );
};

export default OrderForm;
