import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderPlaced() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-7xl mb-4 animate-bounce">🎉</div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Placed!</h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        Your order is being prepared by our kitchen team. We'll notify you when it's ready for pickup!
      </p>
      <button onClick={() => navigate('/menu')} className="btn-primary">
        Order More
      </button>
    </div>
  );
}
