import React from 'react';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import './style/general.scss';
import AppRouter from './Router';
import { UserProvider } from './context/appContext';

const App = () => {
    return (
        <PrimeReactProvider>
            <UserProvider>
                <DndProvider backend={HTML5Backend}>
                    <AppRouter />
                </DndProvider>
            </UserProvider>
        </PrimeReactProvider>
    );
}

export default App;
