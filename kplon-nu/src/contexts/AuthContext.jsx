import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Mock users for demo
const MOCK_USERS = {
  'fifame.legba@gmail.com': {
    id: 1,
    email: 'fifame.legba@gmail.com',
    name: 'Fifamè Legba',
    role: 'student',
    avatar: null,
    school: 'Université d\'Abomey-Calavi',
    filiere: 'Informatique',
    points: 1240,
    streak: 7,
    password: 'password123',
  },
  'koffi.ahouant@univ-benin.bj': {
    id: 2,
    email: 'koffi.ahouant@univ-benin.bj',
    name: 'Prof. Koffi Ahouant',
    role: 'professor',
    avatar: null,
    school: 'Université de Parakou',
    filiere: 'Sciences Informatiques',
    password: 'password123',
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('kplon_user');
    const storedToken = localStorage.getItem('kplon_token');
    if (stored && storedToken) {
      setUser(JSON.parse(stored));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const found = MOCK_USERS[email.toLowerCase()];
    if (!found || found.password !== password) {
      throw new Error('Email ou mot de passe incorrect');
    }
    const { password: _, ...safeUser } = found;
    const fakeToken = `jwt_mock_${Date.now()}`;
    setUser(safeUser);
    setToken(fakeToken);
    localStorage.setItem('kplon_user', JSON.stringify(safeUser));
    localStorage.setItem('kplon_token', fakeToken);
    return safeUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('kplon_user');
    localStorage.removeItem('kplon_token');
  };

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('kplon_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
