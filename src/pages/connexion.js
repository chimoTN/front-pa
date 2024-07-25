import React, { useState } from "react";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { Link } from "react-router-dom";
import { useUser } from "../context/appContext";
import AuthService from "../services/authentificationService";

import 'primereact/resources/themes/saga-blue/theme.css';  
import 'primereact/resources/primereact.min.css';          
import 'primeicons/primeicons.css';                        

const Connexion = () => {
    let navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const { user, setUser } = useUser();
    const authService = AuthService();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Email:", email);
        console.log("Mot de passe:", password);
    };
    
    //const URL = `https://projet-annuel-1.onrender.com/api/users/signIn`;
    const URL = `http://localhost:8080/api/users/signIn`;
    
    const login = () => {
        Axios.post(URL, {
            mail: email,
            password: password
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })
        .then(response => {
            console.log("login", response);
            //console.log("token:", response.data.token);
            setUser(response.data);
            console.log("USER",user.token)
            //sessionStorage.setItem("token", response.data.token);
            sessionStorage.setItem("token", "Bearer " + response.data.token);
            navigate("/accueil");
        })
        .catch(err => {
            console.log('error => ', err);
            setMessage("Erreur login ou password");
        });
    };
    

    return (
        <div style={{ height: '100vh', marginLeft: "40%", marginTop: 100 }}>
            <Card title="Connexion" style={{ width: '360px' }}>
                <form onSubmit={handleSubmit} className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                            className="p-inputtext p-component"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="password">Mot de passe:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                            className="p-inputtext p-component"
                        />
                    </div>
                    <br/>
                    <Button onClick={login} label="Se connecter" className="p-button-success" />
                    <Link to='/inscription'>
                        <span type="primary" style={{color : "red"}}>S'inscrire</span>  
                    </Link>
                </form>
                {message && <p>{message}</p>}
            </Card>
        </div>
    );
};

export default Connexion;
