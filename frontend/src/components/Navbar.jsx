import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { CartIcon, MenuIcon, CloseIcon, LogoutIcon, ChefHatIcon, HistoryIcon } from './Icons';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems }   = useCart();
  const navigate         = useNavigate();
  const location         = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const isCustomer = user?.role === 'customer';
  const isChef     = user?.role === 'chef';

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const navLink = (to, label, icon) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`nav-link flex items-center gap-2 ${active ? 'nav-link-active' : ''}`}
        onClick={() => setMenuOpen(false)}
      >
        {icon && <span style={{ fontSize: '1.1em' }}>{icon}</span>}
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b" style={{ background: 'rgba(14,12,8,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to={isChef ? '/kitchen-dashboard' : isCustomer ? '/menu' : '/'} className="flex items-center gap-3 flex-shrink-0 group">
          <img src="/logo.png" alt="Ctrl+Alt+Eat" className="h-9 w-auto transition-transform duration-300 group-hover:scale-105" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {isCustomer && (
            <>
              {navLink('/menu', 'Menu')}
              {navLink('/history', 'Order History', <HistoryIcon />)}
            </>
          )}
          {isChef && navLink('/kitchen-dashboard', 'Dashboard', <ChefHatIcon />)}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Toggles */}
          <button onClick={toggleTheme} className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200" style={{ background: 'rgba(232,146,60,0.1)', color: 'var(--orange)' }}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {/* Cart icon */}
          {isCustomer && (
            <Link
              to="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200"
              style={{ background: 'rgba(232,146,60,0.1)', color: 'var(--orange)' }}
              aria-label="Open cart"
            >
              <CartIcon className="" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg" style={{ background: 'var(--orange)' }}>
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
          )}

          {/* User pill */}
          {user && (
            <div className="hidden md:flex items-center gap-2 rounded-full px-3 py-1.5" style={{ background: 'rgba(250,243,232,0.06)', border: '1px solid var(--border)' }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: 'var(--orange)' }}>
                {(user.name || user.username || 'U').charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-semibold max-w-[8rem] truncate" style={{ color: 'var(--cream)' }}>
                {user.name || user.username}
              </span>
              <span className="text-xs capitalize" style={{ color: 'var(--cream-muted)' }}>{user.role}</span>
            </div>
          )}

          {/* Logout */}
          {user && (
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 px-3 py-1.5 rounded-full"
              style={{ color: 'var(--cream-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--cream-muted)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <LogoutIcon /> Logout
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full transition"
            style={{ color: 'var(--cream)' }}
            aria-label="Toggle menu"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 py-3 flex flex-col gap-1 animate-slide-down" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
          {isCustomer && (
            <>
              {navLink('/menu', 'Menu')}
              {navLink('/cart', `Cart${totalItems > 0 ? ` (${totalItems})` : ''}`, <CartIcon />)}
              {navLink('/history', 'Order History', <HistoryIcon />)}
            </>
          )}
          {isChef && navLink('/kitchen-dashboard', 'Dashboard', <ChefHatIcon />)}
          {user && (
            <button
              onClick={handleLogout}
              className="text-left text-sm font-semibold px-3 py-2 rounded-xl transition mt-1 flex items-center gap-2"
              style={{ color: 'var(--danger)' }}
            >
              <LogoutIcon /> Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
