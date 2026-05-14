import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems }   = useCart();
  const navigate         = useNavigate();
  const location         = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isCustomer = user?.role === 'customer';
  const isChef     = user?.role === 'chef';

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const navLink = (to, label) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`nav-link ${active ? 'nav-link-active' : ''}`}
        onClick={() => setMenuOpen(false)}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to={isChef ? '/chef' : isCustomer ? '/menu' : '/'} className="flex items-center gap-2 flex-shrink-0">
          <span className="text-2xl">🍽️</span>
          <span className="font-extrabold text-gray-900 text-lg tracking-tight">Ctrl-Alt-Eat</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {isCustomer && (
            <>
              {navLink('/menu', 'Menu')}
              {navLink('/history', 'Order History')}
            </>
          )}
          {isChef && navLink('/chef', 'Kitchen Dashboard')}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Cart icon — customers only */}
          {isCustomer && (
            <Link
              to="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-orange-50 hover:bg-orange-100 text-orange-600 transition-colors"
              aria-label="Open cart"
            >
              <span className="text-xl">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
          )}

          {/* User pill */}
          {user && (
            <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {(user.name || user.username).charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-gray-700 max-w-[8rem] truncate">
                {user.name || user.username}
              </span>
              <span className="text-xs text-gray-400 capitalize">{user.role}</span>
            </div>
          )}

          {/* Logout */}
          {user && (
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors px-3 py-1.5 rounded-full hover:bg-red-50"
            >
              <span>↩</span> Logout
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            <span className="text-xl">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
          {isCustomer && (
            <>
              {navLink('/menu', '🍔 Menu')}
              {navLink('/cart', `🛒 Cart${totalItems > 0 ? ` (${totalItems})` : ''}`)}
              {navLink('/history', '📋 Order History')}
            </>
          )}
          {isChef && navLink('/chef', '👨‍🍳 Kitchen Dashboard')}
          {user && (
            <button
              onClick={handleLogout}
              className="text-left text-sm font-semibold text-red-500 px-3 py-2 rounded-xl hover:bg-red-50 transition mt-1"
            >
              ↩ Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
