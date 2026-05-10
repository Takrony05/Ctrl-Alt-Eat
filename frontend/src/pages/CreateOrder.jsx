import React, { useEffect, useState, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { getMenuItems } from '../services/api';

const CATEGORIES = ['Main Meal', 'Dessert', 'Drink', 'Side'];

const CATEGORY_ICONS = {
  'Main Meal': '🍔',
  'Dessert':   '🍰',
  'Drink':     '🥤',
  'Side':      '🍟',
};

function ItemCard({ item, onAdd }) {
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [added, setAdded] = useState(false);

  const toggleAddon = (addon) => {
    setSelectedAddons((prev) =>
      prev.find((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const handleAdd = () => {
    onAdd(item, selectedAddons);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const addonExtra = selectedAddons.reduce((s, a) => s + parseFloat(a.price || 0), 0);
  const totalPrice = (parseFloat(item.price) + addonExtra).toFixed(2);

  return (
    <div className="menu-card group">
      {/* Category badge */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-gray-900 text-base leading-snug">{item.name}</h3>
        <span className="text-lg ml-2 flex-shrink-0">{CATEGORY_ICONS[item.category] || '🍽️'}</span>
      </div>

      {item.description && (
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{item.description}</p>
      )}

      {/* Add-ons */}
      {item.available_addons?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Add-ons</p>
          <div className="flex flex-wrap gap-1.5">
            {item.available_addons.map((addon) => {
              const active = !!selectedAddons.find((a) => a.id === addon.id);
              return (
                <button
                  key={addon.id}
                  onClick={() => toggleAddon(addon)}
                  className={`addon-chip ${active ? 'addon-chip-active' : ''}`}
                >
                  {addon.name}
                  {parseFloat(addon.price) > 0 && (
                    <span className="ml-1 opacity-70">+${parseFloat(addon.price).toFixed(2)}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Price + Add button */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
        <span className="text-xl font-extrabold text-orange-500">${totalPrice}</span>
        <button
          onClick={handleAdd}
          className={`add-btn ${added ? 'add-btn-success' : ''}`}
        >
          {added ? '✓ Added!' : '+ Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default function CreateOrder() {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('Main Meal');
  const [menuData, setMenuData]   = useState({});
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  useEffect(() => {
    getMenuItems()
      .then((res) => setMenuData(res.data))
      .catch(() => setError('Failed to load menu. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const items = menuData[activeTab] || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Our Menu</h1>
        <p className="text-gray-500 mt-1">Choose from our fresh selection</p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-2xl w-fit">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`tab-btn ${activeTab === cat ? 'tab-btn-active' : ''}`}
          >
            <span className="mr-1.5">{CATEGORY_ICONS[cat]}</span>
            {cat}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="spinner-lg" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6 text-center">
          {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <span className="text-5xl block mb-3">{CATEGORY_ICONS[activeTab]}</span>
          No items in this category yet.
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onAdd={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
}
