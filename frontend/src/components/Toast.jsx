import React, { useEffect, useState } from 'react';

/**
 * Toast — dismissible pop-up notification.
 * Props: message, onClose, autoClose (ms, default 6000)
 */
export default function Toast({ message, onClose, autoClose = 6000 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const show = setTimeout(() => setVisible(true), 10);
    const hide = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 400); // wait for exit animation
    }, autoClose);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, [autoClose, onClose]);

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50 max-w-sm w-full
        transform transition-all duration-400 ease-out
        ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
      `}
    >
      <div className="bg-white border border-emerald-200 rounded-2xl shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div
          className="h-1 bg-emerald-400 origin-left"
          style={{ animation: `shrink ${autoClose}ms linear forwards` }}
        />
        <div className="flex items-start gap-4 p-4">
          {/* Icon */}
          <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-xl">
            🍽️
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-sm">Order Ready!</p>
            <p className="text-gray-600 text-sm mt-0.5">{message}</p>
          </div>
          <button
            onClick={() => { setVisible(false); setTimeout(onClose, 400); }}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors mt-0.5"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
