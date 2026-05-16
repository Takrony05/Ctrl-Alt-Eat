import React, { useEffect, useState } from 'react';
import { PlateIcon, CloseIcon } from './Icons';

export default function Toast({ message, onClose, autoClose = 6000 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10);
    const hide = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 400);
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
      <div className="rounded-2xl shadow-2xl overflow-hidden" style={{ background: 'rgba(250,243,232,0.1)', border: '1px solid rgba(52,211,153,0.3)', backdropFilter: 'blur(20px)' }}>
        <div
          className="h-1 origin-left"
          style={{ background: 'var(--success)', animation: `shrink ${autoClose}ms linear forwards` }}
        />
        <div className="flex items-start gap-4 p-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: 'rgba(52,211,153,0.15)', color: 'var(--success)' }}>
            <PlateIcon />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm" style={{ color: 'var(--cream)' }}>Order Update</p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--cream-muted)' }}>{message}</p>
          </div>
          <button
            onClick={() => { setVisible(false); setTimeout(onClose, 400); }}
            className="flex-shrink-0 transition-colors mt-0.5"
            style={{ color: 'var(--cream-subtle)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--cream)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--cream-subtle)'}
            aria-label="Dismiss"
          >
            <CloseIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
