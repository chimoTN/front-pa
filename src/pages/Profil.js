import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useUser } from '../context/appContext';

const Profile = () => {
  const { user } = useUser();
  const [profileData, setProfileData] = useState(null);
  const [friends, setFriends] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    if (user) {
      // Remplacez les URL ci-dessous par les vraies URL de vos API
      Axios.get(`http://localhost:8080/api/users/${user.id}/profile`)
        .then(response => {
          setProfileData(response.data);
        })
        .catch(err => {
          console.error('Error fetching profile data:', err);
        });

      Axios.get(`http://localhost:8080/api/users/${user.id}/friends`)
        .then(response => {
          setFriends(response.data);
        })
        .catch(err => {
          console.error('Error fetching friends data:', err);
        });

      Axios.get(`http://localhost:8080/api/users/${user.id}/following`)
        .then(response => {
          setFollowing(response.data);
        })
        .catch(err => {
          console.error('Error fetching following data:', err);
        });

      Axios.get(`http://localhost:8080/api/users/${user.id}/followers`)
        .then(response => {
          setFollowers(response.data);
        })
        .catch(err => {
          console.error('Error fetching followers data:', err);
        });
    }
  }, [user]);


  return (
    <div className="profile">
      <h1>Profil de {profileData?.name}</h1>
      <div className="profile-info">
        <h2>Informations Personnelles</h2>
        <p><strong>Nom:</strong> {profileData?.name}</p>
        <p><strong>Email:</strong> {profileData?.email}</p>
        {/* Ajoutez d'autres informations de profil ici */}
      </div>

      <div className="friends">
        <h2>Amis</h2>
        <ul>
          {friends.map(friend => (
            <li key={friend.id}>{friend.name}</li>
          ))}
        </ul>
      </div>

      <div className="following">
        <h2>Personnes que je suis</h2>
        <ul>
          {following.map(person => (
            <li key={person.id}>{person.name}</li>
          ))}
        </ul>
      </div>

      <div className="followers">
        <h2>Personnes qui me suivent</h2>
        <ul>
          {followers.map(person => (
            <li key={person.id}>{person.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
