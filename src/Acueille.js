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
  const [loading, setLoading] = useState(true);
  const [contents, setContents] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchScripts = async () => {
      try {
        const response = await axios.get('https://projet-annuel-1.onrender.com/api/scripts');
        if (response.data.length === 0) {
          setPosts([
            // Exemple de données
          ]);
          setLoading(false);
        } else {
          console.log("bonjour d'ici");
          console.log("reponse : " + response.data)
          setPosts(response.data);

          const contentsMap = {};

          await Promise.all(
            response.data.map(async (post) => {
              console.log("post.id = " + post.id)
              const scriptContent = await axios.get(`https://projet-annuel-1.onrender.com/api/scripts/${post.id}/content`)
              console.log(scriptContent);
              contentsMap[post.id] = scriptContent.data;
            })
          );

          setContents(contentsMap);
          setLoading(false);
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
      const response = await axios.get(`https://projet-annuel-1.onrender.com/api/users/search?query=${searchQuery}`);
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

  if(loading) {
    return (<div>Chargements des posts...</div>);
  }

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
            <Post 
              key={post.id || Math.random()} // Utiliser une clé alternative temporaire si l'id est indéfini
              username={"username"} 
              codeContent={contents[post.id]} 
              script={post || {}} // Passer un objet vide par défaut si scriptDTO est indéfini
            />
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