import React from 'react';

const OrderHistory = () => {
  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Order History</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-bold text-gray-700">Order ID</th>
              <th className="px-6 py-4 font-bold text-gray-700">Table</th>
              <th className="px-6 py-4 font-bold text-gray-700">Items</th>
              <th className="px-6 py-4 font-bold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-600">
            <tr>
              <td className="px-6 py-4 font-medium text-gray-900">#001</td>
              <td className="px-6 py-4">12</td>
              <td className="px-6 py-4">Steak, Red Wine, Caesar Salad</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">Completed</span>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-medium text-gray-900">#002</td>
              <td className="px-6 py-4">05</td>
              <td className="px-6 py-4">Burger, Fries, Coke</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase">Cancelled</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderHistory;
