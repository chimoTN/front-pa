import { Link } from 'react-router-dom';
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
    { label: 'Compilateur', to: '/code' },
    { label: 'Mes devs', to: '/saveDev' },
    { label: 'Mon profil', to: '/profil' },
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
      <div className="logout-button">
        <button onClick={handleLogout} className="logout-btn">Déconnexion</button>
      </div>
    </div>
  );
};

export default Header;
