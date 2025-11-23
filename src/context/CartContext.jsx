// src/context/CartContext.jsx
import React, { createContext, useContext, useState } from 'react';

// Création du contexte
const CartContext = createContext();

// Provider : c'est l'enveloppe qui va donner l'info à tout le site
export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  // Fonction pour ajouter au panier
  const addToCart = () => {
    setCartCount(prevCount => prevCount + 1);
  };

  return (
    <CartContext.Provider value={{ cartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personnalisé pour utiliser le panier facilement
export const useCart = () => useContext(CartContext);