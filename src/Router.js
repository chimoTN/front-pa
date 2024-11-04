// AppRouter.js
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import NotFoundPage from './pages/NotFoundPage';
import Connexion from './pages/connexion';
import Accueil from './Acueille';
import RegistrationForm from './pages/inscription';
import Sidebar from './components/Header';
import CodeEditor from './pages/codeEditor';
import ProfilePage from './pages/Profil';
import SavedDevelopments from './pages/SavedDevelopments';
import NewEditor from './pages/newEditor';
import PrivateRoute from './PrivateRoute';
import { UserProvider } from './context/appContext';
import Pipeline from "./Pipeline";
import JobStatusWebSocket from "./JobStatusWebSocket";
import PipelineStatus from "./PipelineStatus";
import Pipelines from "./Pipelines";


const AppRouter = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <HeaderWithConditionalRendering />
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Connexion />} />
          <Route path="/inscription" element={<RegistrationForm />} />
          
          {/* Routes privées */}
          <Route element={<PrivateRoute />}> 
            <Route path="/accueil" element={<Accueil />} />
            <Route path="/code" element={<CodeEditor />} />
            <Route path="/saveDev" element={<SavedDevelopments />} />
            <Route path="/profil" element={<ProfilePage />} />
            <Route path="/newEditor" element={<NewEditor />} />

            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/pipelines" element={<Pipelines />} />
            <Route path="/webSocket/:id" element={<JobStatusWebSocket />} />
            <Route path="/pipelineSocket/:id" element={<PipelineStatus />} />

          </Route>
          
          {/* Route pour la page 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

function HeaderWithConditionalRendering() {
  const location = useLocation();
  const excludeHeaderRoutes = ['/', '/inscription'];

  if (!excludeHeaderRoutes.includes(location.pathname)) {
    return <Sidebar />;
  }

  return null;
}

export default AppRouter;
