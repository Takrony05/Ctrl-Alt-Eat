import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SparkleIcon } from '../components/Icons';

export default function OrderPlaced() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-24 h-24 mb-6 rounded-full flex items-center justify-center text-5xl animate-bounce" style={{ background: 'rgba(232,146,60,0.15)', color: 'var(--orange)' }}>
        <SparkleIcon />
      </div>
      <h1 className="text-4xl font-black mb-3 gradient-text">Order Placed!</h1>
      <p className="mb-8 max-w-sm" style={{ color: 'var(--cream-muted)' }}>
        Your order is being prepared by our kitchen team. We'll notify you when it's ready for pickup!
      </p>
      <button onClick={() => navigate('/menu')} className="btn-primary">
        Order More
      </button>
    </div>
  );
}
