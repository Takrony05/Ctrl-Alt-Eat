import React from 'react';

const METHODS = [
  {
    id: 'card',
    label: 'Credit / Debit Card',
    sublabel: 'Visa, Mastercard, Amex',
    icon: '💳',
    brands: ['VISA', 'MC', 'AMEX'],
  },
  {
    id: 'apple',
    label: 'Apple Pay',
    sublabel: 'Touch ID or Face ID',
    icon: '',
    brands: ['🍎 Pay'],
  },
  {
    id: 'google',
    label: 'Google Pay',
    sublabel: 'Pay with Google',
    icon: '',
    brands: ['G Pay'],
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
            className={`w-full text-left rounded-2xl p-4 transition-all duration-300 border ${
              isSelected
                ? 'bg-orange-500/10 border-orange-500/40 glow-amber-sm'
                : 'glass border-white/8 hover:border-white/16 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Radio indicator */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isSelected ? 'border-orange-500' : 'border-white/20'
                  }`}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{method.icon}</span>
                    <span className="text-white font-semibold text-sm">{method.label}</span>
                  </div>
                  <p className="text-white/35 text-xs mt-0.5 ml-7">{method.sublabel}</p>
                </div>
              </div>

              {/* Brand chips */}
              <div className="flex gap-1.5">
                {method.brands.map(brand => (
                  <span
                    key={brand}
                    className="px-2 py-1 rounded-md text-xs font-bold border"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      borderColor: 'rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.5)',
                    }}
                  >
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
