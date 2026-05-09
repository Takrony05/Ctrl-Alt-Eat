import React from 'react';
import StatusButtons from './StatusButtons';

const KitchenBoard = () => {
  // Placeholder for orders data
  const orders = [
    { id: 1, table: '5', items: ['Burger', 'Fries'], status: 'pending' },
    { id: 2, table: '2', items: ['Pizza', 'Coke'], status: 'preparing' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map(order => (
        <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold">Table {order.table}</h3>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded uppercase tracking-wide">
              {order.status}
            </span>
          </div>
          <ul className="space-y-2 mb-6">
            {order.items.map((item, index) => (
              <li key={index} className="text-gray-700 flex items-center">
                <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                {item}
              </li>
            ))}
          </ul>
          <StatusButtons orderId={order.id} />
        </div>
      ))}
    </div>
  );
};

export default KitchenBoard;
