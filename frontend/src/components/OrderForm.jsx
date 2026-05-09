import React, { useState } from 'react';

const OrderForm = () => {
  const [table, setTable] = useState('');
  const [items, setItems] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ table, items });
    alert('Order created!');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Table Number</label>
        <input 
          type="text" 
          value={table}
          onChange={(e) => setTable(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g. 5"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2">Items (comma separated)</label>
        <textarea 
          value={items}
          onChange={(e) => setItems(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g. Burger, Fries, Coke"
          rows="4"
        />
      </div>
      <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
        Place Order
      </button>
    </form>
  );
};

export default OrderForm;
