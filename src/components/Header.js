import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { useUser } from '../context/appContext';
import '../style/Sidebar.scss';
import logo from '../assets/logo.png'; 

const Header = () => {
  const navigate = useNavigate();
  const { logout } = useUser();

  const handleLogout = () => {
    try {
      logout();
      navigate("/");
      console.log("Déconnexion réussie");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  // Éléments de navigation dynamiques
  const baseItems = [
    { label: 'Accueil', to: '/accueil' },
    { label: 'Editor', to: '/newEditor' },
    { label: 'Mes devs', to: '/saveDev' },

    { label: 'PipelineEditor', to: '/pipeline' },
    { label: 'Pipelines', to: '/pipelines' },
    { label: 'Mon profil', to: '/profil' },
  ];

  const profileMenuItems = [
    { label: 'Mon profil', icon: 'pi pi-user', command: () => navigate('/profil') },
    { label: 'Paramètres', icon: 'pi pi-cog', command: () => navigate('/parametres') },
    { label: 'Déconnexion', icon: 'pi pi-sign-out', command: handleLogout },
  ];

  return (
    <div className="header">
      <div className="logo">
        <img src={logo} alt="Logo" className="logo-image" />
      </div>
      <nav className="menu">
        {baseItems.map(item => (
          <Link key={item.to} to={item.to} className="menu-item">
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="profile-menu">
        <Dropdown 
          value={null}
          options={profileMenuItems}
          onChange={(e) => e.value.command()} 
          placeholder="Profil"
          className="p-button-rounded p-button-text profile-dropdown"
        />
      </div>
    </div>
  );
};

export default Header;
