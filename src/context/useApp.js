import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAppContext } from '../contexte/AppContext';
import SubscriptionLevel from '../controller/SubscriptionLevel';

const ProtectedRoute = ({ subscriptionRequired, component: Component, ...props }) => {
  const { user } = useAppContext();

  if (
    user.id_abonnement === subscriptionRequired ||
    user.id_abonnement === SubscriptionLevel.MASTER
  ) {
    return <Route {...props} element={<Component />} />;
  } else {
    return <Navigate to="/Profil" />;
  }
};

export default ProtectedRoute;