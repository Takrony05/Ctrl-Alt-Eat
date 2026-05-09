import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-indigo-600">KitchenDisplay</Link>
        <div className="space-x-6 font-medium">
          <Link to="/" className="text-gray-600 hover:text-indigo-600 transition">Dashboard</Link>
          <Link to="/create" className="text-gray-600 hover:text-indigo-600 transition">Create Order</Link>
          <Link to="/history" className="text-gray-600 hover:text-indigo-600 transition">History</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
