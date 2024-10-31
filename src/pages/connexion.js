import React, { useState } from "react";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import AuthService from "../services/authentificationService";
import { useUser } from "../context/appContext";

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


const Connexion = () => {
    let navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const { setUser } = useUser();
    const authService = AuthService();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        login();
    };

    const inscription = () => {
        navigate('/inscription');
    };

    const login = async () => {
        try {
            const response = await authService.login(email, password);
            setUser(response.data);
            
            sessionStorage.setItem("token", "Bearer " + response.data.token);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.userId);

            navigate("/newEditor");
        } catch (err) {
            setMessage("Erreur login ou mot de passe");
        }
    };

   

    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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

                    <Button type="submit" label="Se connecter" className="p-button-success p-mt-2" />
                    <br/><br/>
                    ----------------------- or -----------------------
                    <br/><br/>
                    <Button 
                        label="S'inscrire" 
                        className="p-button-secondary p-mt-2" 
                        onClick={inscription}
                        style={{marginTop:'30'}}
                    />

                </form>
                {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}
            </Card>
        </div>
    );
};

export default Connexion;
