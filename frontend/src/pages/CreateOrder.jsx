import React from 'react';
import OrderForm from '../components/OrderForm';

const CreateOrder = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Place New Order</h1>
      <OrderForm />
    </div>
  );
};

export default CreateOrder;
