import React from 'react';
import { CreditCardIcon, VisaLogo, MastercardLogo, AmexLogo, ApplePayLogo, GooglePayLogo } from './Icons';

const METHODS = [
  {
    id: 'card',
    label: 'Credit / Debit Card',
    sublabel: 'Visa, Mastercard, Amex',
    icon: <CreditCardIcon />,
    brands: [<VisaLogo key="v" />, <MastercardLogo key="m" />, <AmexLogo key="a" />],
  },
  {
    id: 'apple',
    label: 'Apple Pay',
    sublabel: 'Touch ID or Face ID',
    icon: null,
    brands: [<ApplePayLogo key="ap" />],
  },
  {
    id: 'google',
    label: 'Google Pay',
    sublabel: 'Pay with Google',
    icon: null,
    brands: [<GooglePayLogo key="gp" />],
  },
];

export default function PaymentOptions({ selected, onSelect }) {
  return (
    <div className="space-y-3">
      {METHODS.map(method => {
        const isSelected = selected === method.id;
        return (
          <button
            key={method.id}
            id={`payment-${method.id}`}
            onClick={() => onSelect(method.id)}
            className="w-full text-left rounded-2xl p-4 transition-all duration-300"
            style={{
              background: isSelected ? 'rgba(232,146,60,0.08)' : 'rgba(250,243,232,0.03)',
              border: `1px solid ${isSelected ? 'rgba(232,146,60,0.35)' : 'var(--border)'}`,
              boxShadow: isSelected ? '0 0 15px rgba(232,146,60,0.12)' : 'none',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Radio */}
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300"
                  style={{ borderColor: isSelected ? 'var(--orange)' : 'var(--border)' }}>
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--orange)' }} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    {method.icon && <span className="text-xl" style={{ color: 'var(--orange)' }}>{method.icon}</span>}
                    <span className="font-semibold text-sm" style={{ color: 'var(--cream)' }}>{method.label}</span>
                  </div>
                  <p className="text-xs mt-0.5 ml-7" style={{ color: 'var(--cream-subtle)' }}>{method.sublabel}</p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                {method.brands.map((brand, i) => (
                  <span key={i} className="flex items-center px-2 py-1 rounded-md" style={{ background: 'rgba(250,243,232,0.06)', border: '1px solid var(--border)' }}>
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
