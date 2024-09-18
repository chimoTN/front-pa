import React, { useEffect, useState } from 'react';
import axios from "./context/axios_token";
import Post from './Post';
import '../src/style/Accueil.scss';
import '../src/style/Post.scss';
import { Modal, Button } from 'react-bootstrap';
import UserProfile from './pages/UserProfile';

const Accueil = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUserId, setModalUserId] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchScripts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/scripts');
        if (response.data.length === 0) {
          setPosts([
            // Exemple de données
          ]);
        } else {
          console.log(response.data)
          setPosts(response.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des scripts:', error);
      }
    };
    fetchScripts();
  }, [token]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:8080/api/users/search?query=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Erreur lors de la recherche des personnes:', error);
    }
  };



  const openUserProfileModal = (userId) => {
    setModalUserId(userId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalUserId(null);
  };

  return (
      <div className="accueil">
        <form className="search-form" onSubmit={handleSearch}>
          <input
              type="text"
              placeholder="Chercher des personnes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Rechercher</button>
        </form>
        <div className="search-results">
          {searchResults.map(person => (
              <div key={person.userId} className="person" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1em', borderBottom: '1px solid #ddd' }}>
                <p>{person.firstName} {person.lastName}</p>
                <Button
                    variant="primary"
                    onClick={() => openUserProfileModal(person.userId)}
                    style={{ marginLeft: 'auto' }}
                >
                  Voir profil
                </Button>
              </div>
          ))}
        </div>
        <div className="posts">
          {posts.map(post => (
              <Post key={post.scriptDTO.id} username={"username"} codeContent={post.scriptContent} script={post.scriptDTO} />
          ))}
        </div>

        <Modal
            show={isModalOpen}
            onHide={closeModal}
            size="lg"
            fullscreen
            centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Profil de l'utilisateur</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalUserId && <UserProfile userId={modalUserId} />}
          </Modal.Body>
        </Modal>
      </div>
  );
};

export default Accueil;