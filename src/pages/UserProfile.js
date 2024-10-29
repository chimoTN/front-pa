import React, { useEffect, useState } from 'react';
import { FaCheck, FaUserPlus } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserService from '../services/userService';

const UserProfile = ({ userId }) => {
    const [profileData, setProfileData] = useState(null);
    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [modalTitle, setModalTitle] = useState('');

    useEffect(() => {
        UserService.getProfileData(userId)
            .then(response => setProfileData(response.data))
            .catch(err => console.error('Error fetching profile data:', err));

        UserService.getFollowing(userId)
            .then(response => setFollowing(response.data))
            .catch(err => console.error('Error fetching following data:', err));

        UserService.getFollowers(userId)
            .then(response => setFollowers(response.data))
            .catch(err => console.error('Error fetching followers data:', err));

        UserService.checkIsFollowing(userId)
            .then(response => setIsFollowing(response.data))
            .catch(err => console.error('Error checking if following:', err));
    }, [userId]);

    const handleFollow = () => {
        if (!isFollowing) {
            UserService.followUser(userId)
                .then(response => {
                    if (response.status === 200) {
                        setIsFollowing(true);
                        setProfileData(prevData => ({
                            ...prevData,
                            nbFollowers: prevData.nbFollowers + 1
                        }));
                    } else {
                        console.error('Failed to follow user');
                    }
                })
                .catch(err => console.error('Error following user:', err));
        }
    };

    const handleUnfollow = () => {
        if (isFollowing) {
            UserService.unfollowUser(userId)
                .then(response => {
                    if (response.status === 200) {
                        setIsFollowing(false);
                        setProfileData(prevData => ({
                            ...prevData,
                            nbFollowers: prevData.nbFollowers - 1
                        }));
                    } else {
                        console.error('Failed to unfollow user');
                    }
                })
                .catch(err => console.error('Error unfollowing user:', err));
        }
    };

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
                <h1 style={{ fontSize: '1.5em' }}>Profil de {profileData?.firstName} {profileData?.lastName}</h1>
                
                <div>
                    {userId === localStorage.getItem('userId') ? null : isFollowing ? (
                        <button
                            onClick={handleUnfollow}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0.5em 1em',
                                border: 'none',
                                borderRadius: '0.5em',
                                backgroundColor: '#28a745',
                                color: 'white',
                                fontSize: '1em',
                                cursor: 'pointer'
                            }}
                        >
                            <FaCheck style={{ marginRight: '0.5em' }} />
                            Ne plus suivre
                        </button>
                    ) : (
                        <button
                            onClick={handleFollow}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0.5em 1em',
                                border: 'none',
                                borderRadius: '0.5em',
                                backgroundColor: '#007bff',
                                color: 'white',
                                fontSize: '1em',
                                cursor: 'pointer'
                            }}
                        >
                            <FaUserPlus style={{ marginRight: '0.5em' }} />
                            Suivre
                        </button>
                    )}
                </div>
            </div>

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
                <p style={{ fontSize: '1em' }}><strong>Nom :</strong> {profileData?.firstName}</p>
                <p style={{ fontSize: '1em' }}><strong>Prénom :</strong> {profileData?.lastName}</p>
            </div>

            <Modal
                show={isModalOpen}
                onHide={closeModal}
                centered
                size="lg"
                style={{ height: '100vh' }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {modalData.length > 0 ? (
                            modalData.map(user => (
                                <li key={user.userId} style={{ padding: '0.5em 0', borderBottom: '1px solid #ddd' }}>
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

export default UserProfile;
