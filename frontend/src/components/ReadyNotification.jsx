import React from 'react';

/**
 * Full-screen overlay popup shown when the order status becomes "ready".
 * Unmissable by design: covers everything with a frosted overlay + animated card.
 */
export default function ReadyNotification({ onDismiss }) {
  return (
    <div
      id="ready-notification-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', animation: 'fadeIn 0.3s ease' }}
    >
      <div
        id="ready-notification-card"
        className="w-full max-w-sm rounded-3xl p-8 text-center animate-bounce-in"
        style={{
          background: 'linear-gradient(145deg, #1a1a2e, #0f0f1a)',
          border: '2px solid rgba(34,197,94,0.4)',
          boxShadow: '0 0 60px rgba(34,197,94,0.25), 0 0 120px rgba(34,197,94,0.1)',
        }}
      >
        {/* Icon */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto mb-6"
          style={{
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            boxShadow: '0 0 40px rgba(34,197,94,0.5)',
            animation: 'pulse-glow 2s ease-in-out infinite',
          }}
        >
          🎉
        </div>

        <h2 className="text-3xl font-black text-white mb-2">Order Ready!</h2>
        <p className="text-white/60 text-lg mb-2">Your order is ready</p>
        <p
          className="font-bold text-xl mb-8"
          style={{
            background: 'linear-gradient(135deg, #22c55e, #4ade80)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          🚀 Come pick it up!
        </p>

        {/* Decorative pulse rings */}
        <div className="relative flex items-center justify-center mb-8">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="absolute rounded-full border border-green-500/30"
              style={{
                width: `${i * 40}px`,
                height: `${i * 40}px`,
                animation: `pulse ${1 + i * 0.4}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
          <div className="w-4 h-4 rounded-full bg-green-500" />
        </div>

        <button
          id="ready-notification-dismiss"
          onClick={onDismiss}
          className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all duration-300 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            boxShadow: '0 8px 30px rgba(34,197,94,0.4)',
          }}
        >
          Got it! 👍
        </button>
      </div>
    </div>
  );
}
