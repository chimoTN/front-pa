import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from './context/appContext'; 

const PrivateRoute = () => {
  const { user } = useUser();
  
  return user ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
