import React from 'react';
import KitchenBoard from '../components/KitchenBoard';

const Dashboard = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Live Kitchen Feed</h1>
        <div className="flex items-center text-sm font-medium text-green-600">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          Connected
        </div>
      </div>
      <KitchenBoard />
    </div>
  );
};

export default Dashboard;
