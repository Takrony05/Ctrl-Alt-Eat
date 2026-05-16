import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderStatusPoller from '../components/OrderStatusPoller';
import ReadyNotification from '../components/ReadyNotification';
import { SparkleIcon, CheckCircleIcon } from '../components/Icons';

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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 bg-grid opacity-60" />
      <OrderStatusPoller orderId={orderId} onStatusChange={handleStatusChange} />
      
      {showReady && (
        <ReadyNotification 
          onDismiss={() => {
            setShowReady(false);
            navigate('/');
          }} 
        />
      )}

      <div className="w-full max-w-md animate-fade-in-up text-center relative z-10">
        <div className="relative inline-block mb-8">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl text-white shadow-2xl ${
              status === 'ready' ? 'animate-bounce' : 'animate-pulse-glow'
            }`}
            style={{ 
              background: status === 'ready' 
                ? 'linear-gradient(135deg, var(--success-dark), var(--success))' 
                : 'linear-gradient(135deg, var(--orange), var(--orange-dark))' 
            }}
          >
            {status === 'ready' ? <CheckCircleIcon /> : <SparkleIcon />}
          </div>
        </div>

        <h1 className="text-3xl font-black mb-4" style={{ color: 'var(--cream)' }}>
          {status === 'ready' ? 'Your Order is Ready!' : 'Your Order is Being Prepared'}
        </h1>
        <p className="mb-8" style={{ color: 'var(--cream-subtle)' }}>
          Order #{orderId} • Currently: <span className="font-bold uppercase" style={{ color: 'var(--orange-light)' }}>{status}</span>
        </p>

        <div className="card text-left">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--cream-muted)' }}>
            Please wait at the counter. We will notify you here the second your meal is ready to be picked up.
          </p>
        </div>
      </div>
    </div>
  );
}
