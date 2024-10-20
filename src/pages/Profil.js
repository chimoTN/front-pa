import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useUser } from '../context/appContext';
import '../style/Profile.scss';

const Profile = () => {

  const user = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    bio: 'Développeur passionné avec une expertise en React et Node.js.',
    profilePicture: 'https://via.placeholder.com/150', // URL d'une image de profil par défaut
  };

  const friends = [
    { id: 1, name: 'Alice Smith' },
    { id: 2, name: 'Bob Johnson' },
  ];

  const following = [
    { id: 1, name: 'Carol Williams' },
    { id: 2, name: 'David Brown' },
  ];

  const followers = [
    { id: 1, name: 'Eve Davis' },
    { id: 2, name: 'Frank Miller' },
  ];

  //const { user } = useUser();
  const [profileData, setProfileData] = useState(null);
  //const [friends, setFriends] = useState([]);
  //const [following, setFollowing] = useState([]);
  //const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setLoading(false);
      const fetchData = async () => {
        try {
          const [profileResponse, friendsResponse, followingResponse, followersResponse] = await Promise.all([
            Axios.get(`http://localhost:8080/api/users/${user.id}/profile`),
            Axios.get(`http://localhost:8080/api/users/${user.id}/friends`),
            Axios.get(`http://localhost:8080/api/users/${user.id}/following`),
            Axios.get(`http://localhost:8080/api/users/${user.id}/followers`)
          ]);
          setProfileData(profileResponse.data);
          //setFriends(friendsResponse.data);
          //setFollowing(followingResponse.data);
          //setFollowers(followersResponse.data);
        } catch (err) {
          //setError('Erreur lors de la récupération des données.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>Profil de {user?.name}</h1>
      </div>
      <div className="profile-info">
        <h2>Informations Personnelles</h2>
        <p><strong>Nom:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        {/* Ajoutez d'autres informations de profil ici */}
      </div>
      <div className="profile-sections">
        <div className="profile-section">
          <h2>Amis</h2>
          {friends.length > 0 ? (
            <ul>
              {friends.map(friend => (
                <li key={friend.id}>{friend.name}</li>
              ))}
            </ul>
          ) : (
            <p>Aucun ami trouvé.</p>
          )}
        </div>
        <div className="profile-section">
          <h2>Personnes que je suis</h2>
          {following.length > 0 ? (
            <ul>
              {following.map(person => (
                <li key={person.id}>{person.name}</li>
              ))}
            </ul>
          ) : (
            <p>Personne suivie.</p>
          )}
        </div>
        <div className="profile-section">
          <h2>Personnes qui me suivent</h2>
          {followers.length > 0 ? (
            <ul>
              {followers.map(person => (
                <li key={person.id}>{person.name}</li>
              ))}
            </ul>
          ) : (
            <p>Personne ne me suit encore.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
