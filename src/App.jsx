import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext'; // Import Auth

import Home from './pages/Home';
import Articles from './pages/Articles';
import Messagerie from './pages/Messagerie';
import ClientProfile from './pages/ClientProfile';
import ProviderProfile from './pages/ProviderProfile';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Login from './pages/Login';     // Nouveau
import Register from './pages/Register'; // Nouveau
import AdminLogin from './pages/AdminLogin';

// Composant pour protéger les routes privées
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Routes Publiques */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Routes Protégées (ou Semi-Publiques si tu veux que Home soit visible par tous) */}
            {/* Ici je décide que Home est accessible à tous, mais Messagerie nécessite un compte */}
            <Route path="/" element={<Home />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/about" element={<About />} />
            <Route path="/fournisseur/:id" element={<ProviderProfile />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            {/* Routes strictement privées */}
            <Route path="/messagerie" element={
              <PrivateRoute><Messagerie /></PrivateRoute>
            } />
            <Route path="/client" element={
              <PrivateRoute><ClientProfile /></PrivateRoute>
            } />
            <Route path="/admin/*" element={
              <PrivateRoute><AdminDashboard /></PrivateRoute>
            } />
            
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;