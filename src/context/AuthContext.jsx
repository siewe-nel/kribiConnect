import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si un utilisateur est déjà stocké au chargement
    const storedUser = localStorage.getItem('kribi_user');
    const token = localStorage.getItem('kribi_token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('kribi_user', JSON.stringify(userData));
    localStorage.setItem('kribi_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('kribi_user');
    localStorage.removeItem('kribi_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);