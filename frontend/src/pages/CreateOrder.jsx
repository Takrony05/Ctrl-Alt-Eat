import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { getMenuItems } from '../services/api';
import { MainMealIcon, DessertIcon, DrinkIcon, SideIcon, PlateIcon } from '../components/Icons';

const CATEGORIES = ['Main Meal', 'Dessert', 'Drink', 'Side'];

const CATEGORY_ICONS = {
  'Main Meal': <MainMealIcon />,
  'Dessert':   <DessertIcon />,
  'Drink':     <DrinkIcon />,
  'Side':      <SideIcon />,
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
    <div className="menu-card group relative overflow-hidden flex flex-col">
      <div className="-mt-5 -mx-5 mb-4 relative h-48 flex-shrink-0 bg-[rgba(var(--glass-color),0.02)]" style={{ borderBottom: '1px solid var(--border)' }}>
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`absolute inset-0 items-center justify-center ${item.image_url ? 'hidden' : 'flex'}`}>
           <span className="text-6xl opacity-10" style={{ color: 'var(--cream)' }}>{CATEGORY_ICONS[item.category] || <PlateIcon />}</span>
        </div>
        <div className="absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-lg backdrop-blur-md border z-10" style={{ background: 'rgba(var(--glass-color), 0.4)', borderColor: 'var(--border)', color: 'var(--orange)' }}>
          {CATEGORY_ICONS[item.category] || <PlateIcon />}
        </div>
      </div>

      <div className="flex items-start justify-between mb-2">
        <h3 className="font-bold text-xl leading-snug" style={{ color: 'var(--cream)' }}>{item.name}</h3>
      </div>

      {item.description && (
        <p className="text-sm mb-5 line-clamp-2 leading-relaxed" style={{ color: 'var(--cream-muted)' }}>{item.description}</p>
      )}

      {item.available_addons?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--cream-subtle)' }}>Add-ons</p>
          <div className="flex flex-wrap gap-1.5">
            {item.available_addons.map((addon) => {
              const active = !!selectedAddons.find((a) => a.id === addon.id);
              return (
                <button key={addon.id} onClick={() => toggleAddon(addon)}
                  className={`addon-chip ${active ? 'addon-chip-active' : ''}`}>
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

      <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: '1px solid var(--border)' }}>
        <span className="text-xl font-extrabold" style={{ color: 'var(--orange)' }}>${totalPrice}</span>
        <button onClick={handleAdd} className={`add-btn ${added ? 'add-btn-success' : ''}`}>
          {added ? '✓' : `+ Add to Cart`}
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
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tight" style={{ color: 'var(--cream)' }}>Our Menu</h1>
        <p className="mt-2 font-medium" style={{ color: 'var(--cream-muted)' }}>Fresh flavors delivered to your table.</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 p-1.5 rounded-[20px] w-full sm:w-fit justify-center sm:justify-start backdrop-blur-md" style={{ background: 'rgba(var(--glass-color),0.04)', border: '1px solid var(--border)' }}>
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setActiveTab(cat)}
            className={`tab-btn ${activeTab === cat ? 'tab-btn-active' : ''}`}>
            <span className="text-base">{CATEGORY_ICONS[cat]}</span>
            {cat}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="spinner-lg" />
        </div>
      )}

      {error && (
        <div className="rounded-2xl p-6 text-center" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="text-center py-20" style={{ color: 'var(--cream-subtle)' }}>
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
