import React from 'react';

const StatusButtons = ({ orderId }) => {
  return (
    <div className="flex space-x-2">
      <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium">
        Prepare
      </button>
      <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium">
        Ready
      </button>
    </div>
  );
};

export default StatusButtons;
