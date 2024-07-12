import React from 'react';
import NotFoundImage from '../assets/noWhere.png'; // Assure-toi que le chemin est correct

const NotFoundPage = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Desoler cette page n'existe pas</h1>
            <img src={NotFoundImage} alt="404 Page Not Found" style={{ maxWidth: '50%', height: 'auto' }} />
        </div>
    );
}

export default NotFoundPage;
