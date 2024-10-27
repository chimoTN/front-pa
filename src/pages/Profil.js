import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useUser } from '../context/appContext';
import { FaCheck, FaUserPlus } from "react-icons/fa";
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
    const { user } = useUser();
    const [profileData, setProfileData] = useState(null);
    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [isFollowing, setIsFollowing] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [modalTitle, setModalTitle] = useState('');

    useEffect(() => {
        if (user) {
            const userId = localStorage.getItem("userId");
            Axios.get(`http://localhost:8080/api/users/${userId}`)
                .then(response => {
                    setProfileData(response.data);
                })
                .catch(err => {
                    console.error('Error fetching profile data:', err);
                });

            Axios.get(`http://localhost:8080/api/users/${userId}/following`)
                .then(response => {
                    setFollowing(response.data);
                })
                .catch(err => {
                    console.error('Error fetching following data:', err);
                });

            Axios.get(`http://localhost:8080/api/users/${userId}/followers`)
                .then(response => {
                    setFollowers(response.data);
                })
                .catch(err => {
                    console.error('Error fetching followers data:', err);
                });
        }
    }, [user, isFollowing]);

    const openModal = (type) => {
        if (type === 'followers') {
            setModalTitle('Abonnés');
            setModalData(followers);
        } else if (type === 'following') {
            setModalTitle('Abonnements');
            setModalData(following);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="profile" style={{ fontSize: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
                <h1 style={{ fontSize: '1.5em' }}>Profil de {user?.firstName} {user?.lastName}</h1>
            </div>

            {/* Section pour afficher les statistiques */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                padding: '2em 0',
                borderBottom: '0.1em solid #ddd',
                marginBottom: '2em'
            }}>
                <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => openModal('followers')}>
                    <h3 style={{ fontSize: '1.2em' }}>{profileData?.nbFollowers || 0}</h3>
                    <p style={{ fontSize: '1em' }}>Abonnés</p>
                </div>
                <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => openModal('following')}>
                    <h3 style={{ fontSize: '1.2em' }}>{profileData?.nbFollowing || 0}</h3>
                    <p style={{ fontSize: '1em' }}>Abonnements</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.2em' }}>{profileData?.nbPosts || 0}</h3>
                    <p style={{ fontSize: '1em' }}>Posts</p>
                </div>
            </div>

            <div className="profile-info">
                <h2 style={{ fontSize: '1.5em' }}>Informations Personnelles</h2>
                <p style={{ fontSize: '1em' }}><strong>Nom :</strong> {user?.firstName}</p>
                <p style={{ fontSize: '1em' }}><strong>Prénom :</strong> {user?.lastName}</p>
            </div>



            <Modal
                show={isModalOpen}
                onHide={closeModal}
                centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {modalData.length > 0 ? (
                            modalData.map(user => (
                                <li key={user.id} style={{ padding: '0.5em 0', borderBottom: '1px solid #ddd' }}>
                                    {user.firstName} {user.lastName}
                                </li>
                            ))
                        ) : (
                            <p>Aucun résultat trouvé</p>
                        )}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Profile;
