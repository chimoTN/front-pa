import React, { useState } from 'react';
import './style/Social.scss'

const Social = () => {
  const [tab, setTab] = useState('following'); // State pour gérer l'onglet actif

  // Données de test pour les différentes sections
  const followingList = ['User1', 'User2', 'User3'];
  const followersList = ['User4', 'User5', 'User6'];
  const friendsList = ['User7', 'User8', 'User9'];
  const groupsList = ['Group1', 'Group2', 'Group3'];

  return (
    <div className="social">
      <h2>My Social Network</h2>
      
      {/* Navigation entre les onglets */}
      <div className="tabs">
        <button 
          className={tab === 'following' ? 'active' : ''}
          onClick={() => setTab('following')}
        >
          Following
        </button>
        <button 
          className={tab === 'followers' ? 'active' : ''}
          onClick={() => setTab('followers')}
        >
          Followers
        </button>
        <button 
          className={tab === 'friends' ? 'active' : ''}
          onClick={() => setTab('friends')}
        >
          Friends
        </button>
        <button 
          className={tab === 'groups' ? 'active' : ''}
          onClick={() => setTab('groups')}
        >
          Groups
        </button>
      </div>

      {/* Contenu en fonction de l'onglet sélectionné */}
      <div className="tab-content">
        {tab === 'following' && (
          <div>
            <h3>Following</h3>
            <ul>
              {followingList.map((user, index) => (
                <li key={index}>{user}</li>
              ))}
            </ul>
          </div>
        )}
        {tab === 'followers' && (
          <div>
            <h3>Followers</h3>
            <ul>
              {followersList.map((user, index) => (
                <li key={index}>{user}</li>
              ))}
            </ul>
          </div>
        )}
        {tab === 'friends' && (
          <div>
            <h3>Friends</h3>
            <ul>
              {friendsList.map((user, index) => (
                <li key={index}>{user}</li>
              ))}
            </ul>
          </div>
        )}
        {tab === 'groups' && (
          <div>
            <h3>Groups</h3>
            <ul>
              {groupsList.map((group, index) => (
                <li key={index}>{group}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Social;
