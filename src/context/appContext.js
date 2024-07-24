// authContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      setUser({ token });
    }
  }, []);

  const login = (token) => {
    setUser({ token });
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, setUser,  login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
