
import { Link } from 'react-router-dom';

import React, { useState,useContext, useEffect } from 'react';
import  Axios  from 'axios';
import { useNavigate } from 'react-router-dom';

import '../style/Sidebar.scss'

const Sidebar = () => {
  const navigate = useNavigate();


  const handleLogout = () => {
    try {
  
      const recupToken = {
        token : sessionStorage.getItem('token')
      }
    
      const config = {
          headers: { Authorization: `Bearer ${recupToken.token}` }
      };

      Axios.post(`http://localhost:8080/user/logout/`, null, config )
      //on ferme dans le local storage
      .then(() => sessionStorage.clear())
      //on redirige vers la page de connexion
      .then(() => navigate("/"))

      console.log("Déconnexion réussie");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };
 

  // Éléments de navigation dynamiques
  const baseItems = [
    { label: 'Home', to: '/accueil' },
    { label: 'compilateur', to: '/code' },
    { label: 'mes dev', to: '/saveDev' },
    { label: 'Mon profil', to: '/profil' },
  ];

  return (
    <div className="header">
      <div className="logo">
        Logo/Title
      </div>
      <nav className="menu">
        {baseItems.map(item => (
          <Link key={item.to} to={item.to} className="menu-item">
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="logout-button">
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;

