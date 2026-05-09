import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CreateOrder from './pages/CreateOrder';
import OrderHistory from './pages/OrderHistory';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateOrder />} />
          <Route path="/history" element={<OrderHistory />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
