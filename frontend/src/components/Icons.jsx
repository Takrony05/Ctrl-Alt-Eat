import React from 'react';

const s = (d, vb = '0 0 24 24', cls = '') => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox={vb} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls} style={{ width: '1em', height: '1em', display: 'inline-block', verticalAlign: 'middle' }}>{d}</svg>
);

export const MainMealIcon = ({ className = '' }) => s(
  <><circle cx="12" cy="12" r="9"/><path d="M9 12h6M8 9c1-2 3-3 4-3s3 1 4 3"/><path d="M8 15c1 1.5 2.5 2 4 2s3-.5 4-2"/></>,
  '0 0 24 24', className
);

export const DessertIcon = ({ className = '' }) => s(
  <><path d="M5 18h14M6 18v-2a6 6 0 0 1 12 0v2"/><path d="M12 4v2M9 6l1 2M15 6l-1 2"/><circle cx="12" cy="4" r="1" fill="currentColor" stroke="none"/></>,
  '0 0 24 24', className
);

export const DrinkIcon = ({ className = '' }) => s(
  <><path d="M6 6h12l-2 14H8L6 6z"/><path d="M6 6l-1-2h14l-1 2"/><path d="M9 10c1.5 1 3.5 1 5 0"/></>,
  '0 0 24 24', className
);

export const SideIcon = ({ className = '' }) => s(
  <><path d="M4 14h16"/><path d="M4 14c0 3 3.5 5 8 5s8-2 8-5"/><path d="M8 14V8l2 2 2-3 2 3 2-2v6"/></>,
  '0 0 24 24', className
);

export const PlateIcon = ({ className = '' }) => s(
  <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 3v1M12 20v1"/></>,
  '0 0 24 24', className
);

export const CartIcon = ({ className = '' }) => s(
  <><path d="M6 6h15l-1.5 9H7.5L6 6z"/><path d="M3 3h3"/><circle cx="9" cy="19" r="1.5" fill="currentColor"/><circle cx="17" cy="19" r="1.5" fill="currentColor"/></>,
  '0 0 24 24', className
);

export const ChefHatIcon = ({ className = '' }) => s(
  <><path d="M6 13V9a6 6 0 0 1 12 0v4"/><path d="M6 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2"/><path d="M8 15v4h8v-4"/></>,
  '0 0 24 24', className
);

export const ClockIcon = ({ className = '' }) => s(
  <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></>,
  '0 0 24 24', className
);

export const BellIcon = ({ className = '' }) => s(
  <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
  '0 0 24 24', className
);

export const CheckCircleIcon = ({ className = '' }) => s(
  <><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></>,
  '0 0 24 24', className
);

export const PackageIcon = ({ className = '' }) => s(
  <><path d="M3 9l9-5 9 5v6l-9 5-9-5V9z"/><path d="M3 9l9 5 9-5"/><path d="M12 14v7"/></>,
  '0 0 24 24', className
);

export const NoteIcon = ({ className = '' }) => s(
  <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7l-6-4z"/><path d="M14 3v4h4"/><path d="M8 13h8M8 17h5"/></>,
  '0 0 24 24', className
);

export const MenuIcon = ({ className = '' }) => s(
  <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
  '0 0 24 24', className
);

export const CloseIcon = ({ className = '' }) => s(
  <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  '0 0 24 24', className
);

export const ArrowLeftIcon = ({ className = '' }) => s(
  <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
  '0 0 24 24', className
);

export const LogoutIcon = ({ className = '' }) => s(
  <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  '0 0 24 24', className
);

export const TrashIcon = ({ className = '' }) => s(
  <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>,
  '0 0 24 24', className
);

export const PlusIcon = ({ className = '' }) => s(
  <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
  '0 0 24 24', className
);

export const MinusIcon = ({ className = '' }) => s(
  <><line x1="5" y1="12" x2="19" y2="12"/></>,
  '0 0 24 24', className
);

export const RocketIcon = ({ className = '' }) => s(
  <><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></>,
  '0 0 24 24', className
);

export const StarIcon = ({ className = '' }) => s(
  <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" stroke="none"/></>,
  '0 0 24 24', className
);

export const SparkleIcon = ({ className = '' }) => s(
  <><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" fill="currentColor" stroke="none"/></>,
  '0 0 24 24', className
);

export const EyeIcon = ({ className = '' }) => s(
  <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
  '0 0 24 24', className
);

export const EyeOffIcon = ({ className = '' }) => s(
  <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>,
  '0 0 24 24', className
);

export const HistoryIcon = ({ className = '' }) => s(
  <><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/><path d="M3 12a9 9 0 0 1 9-9"/></>,
  '0 0 24 24', className
);

// Payment brand logos as filled SVGs
export const VisaLogo = ({ className = '' }) => (
  <svg viewBox="0 0 48 16" className={className} style={{ width: '2.5em', height: '1em' }}>
    <text x="0" y="13" fontWeight="900" fontSize="14" fontFamily="Inter,sans-serif" fontStyle="italic" fill="#1A1F71">VISA</text>
  </svg>
);

export const MastercardLogo = ({ className = '' }) => (
  <svg viewBox="0 0 40 24" className={className} style={{ width: '1.8em', height: '1em' }}>
    <circle cx="14" cy="12" r="10" fill="#EB001B" opacity="0.9"/>
    <circle cx="26" cy="12" r="10" fill="#F79E1B" opacity="0.9"/>
    <path d="M20 5.3a10 10 0 0 1 0 13.4 10 10 0 0 1 0-13.4z" fill="#FF5F00"/>
  </svg>
);

export const AmexLogo = ({ className = '' }) => (
  <svg viewBox="0 0 48 16" className={className} style={{ width: '2.5em', height: '1em' }}>
    <text x="0" y="13" fontWeight="800" fontSize="11" fontFamily="Inter,sans-serif" fill="#006FCF">AMEX</text>
  </svg>
);

export const ApplePayLogo = ({ className = '' }) => (
  <svg viewBox="0 0 50 22" className={className} style={{ width: '3em', height: '1.2em' }}>
    <path d="M9.2 3.5C8.5 4.3 7.4 4.9 6.4 4.8c-.1-1 .4-2.1 1-2.8C8 1.3 9.2.7 10.1.6c.1 1.1-.3 2.1-1 2.9zm.9 1.5c-1.2-.1-2.2.7-2.7.7-.6 0-1.4-.6-2.4-.6C3.7 5.1 2.5 5.9 1.8 7.1.5 9.5 1.5 13.1 2.8 15c.6.9 1.4 2 2.4 1.9.9 0 1.3-.6 2.4-.6s1.5.6 2.4.6c1 0 1.7-.9 2.3-1.9.7-1.1 1-2.1 1-2.2-1-.4-1.9-1.5-1.9-3.2 0-1.4.9-2.5 1.8-3.1-.7-1-1.8-1.6-3-1.6z" fill="currentColor"/>
    <text x="17" y="15" fontWeight="600" fontSize="12" fontFamily="Inter,sans-serif" fill="currentColor">Pay</text>
  </svg>
);

export const GooglePayLogo = ({ className = '' }) => (
  <svg viewBox="0 0 56 22" className={className} style={{ width: '3.2em', height: '1.2em' }}>
    <circle cx="8" cy="11" r="6" fill="none" stroke="#4285F4" strokeWidth="2.5"/>
    <path d="M8 6v5l4 2" stroke="#4285F4" strokeWidth="0" fill="none"/>
    <text x="1" y="15" fontWeight="700" fontSize="12" fontFamily="Inter,sans-serif" fill="#4285F4">G</text>
    <text x="16" y="15" fontWeight="500" fontSize="12" fontFamily="Inter,sans-serif" fill="currentColor">Pay</text>
  </svg>
);

export const CreditCardIcon = ({ className = '' }) => s(
  <><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></>,
  '0 0 24 24', className
);
