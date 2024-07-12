import React from 'react';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css'; 

import './style/general.scss';
import AppRouter from './Router';
import {UserProvider} from './context/appContext';
const App = () => {
  return (
    <PrimeReactProvider>
      <UserProvider>
        <AppRouter />
      </UserProvider>
    </PrimeReactProvider>
  );
}

export default App;
