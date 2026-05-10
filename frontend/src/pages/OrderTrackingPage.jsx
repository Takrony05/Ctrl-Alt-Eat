import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderStatusPoller from '../components/OrderStatusPoller';
import ReadyNotification from '../components/ReadyNotification';

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('preparing');
  const [showReady, setShowReady] = useState(false);

  const handleStatusChange = (newStatus) => {
    if (newStatus === 'ready' && status !== 'ready') {
      setShowReady(true);
    }
    setStatus(newStatus);
  };

  return (
    <div className="min-h-screen bg-grid flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <OrderStatusPoller orderId={orderId} onStatusChange={handleStatusChange} />
      
      {showReady && (
        <ReadyNotification 
          onDismiss={() => {
            setShowReady(false);
            navigate('/');
          }} 
        />
      )}

      <div className="w-full max-w-md animate-fade-in-up text-center">
        <div className="relative inline-block mb-8">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl ${
              status === 'ready' ? 'animate-bounce' : 'animate-pulse-glow'
            }`}
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
          >
            {status === 'ready' ? '🎉' : '🍳'}
          </div>
        </div>

        <h1 className="text-3xl font-black text-white mb-4">
          {status === 'ready' ? 'Your Order is Ready!' : 'Your Order is Being Prepared'}
        </h1>
        <p className="text-white/40 mb-8">
          Order #{orderId} • Currently: <span className="text-amber-400 font-bold uppercase">{status}</span>
        </p>

        <div className="card text-left">
          <p className="text-white/60 text-sm leading-relaxed">
            Please wait at the counter. We will notify you here the second your meal is ready to be picked up.
          </p>
        </div>
      </div>
    </div>
  );
}
