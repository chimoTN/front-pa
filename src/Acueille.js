import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from './Post'; 
import '../src/style/Accueil.scss';
import '../src/style/Post.scss';

const Accueil = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Remplacez par votre token d'authentification réel
  const token = 'votre_token_d_authentification';

  useEffect(() => {
    const fetchScripts = async () => {
      try {
        const response = await axios.get('/api/scripts', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.length === 0) {
          setPosts([
            {
              id: 1,
              username: 'John Doe',
              codeContent: `
                function sum(a, b) {
                  return a + b;
                }
              `,
              comments: ['Super!', 'Très intéressant.']
            },
            {
              id: 2,
              username: 'Jane Smith',
              codeContent: `
                const greet = (name) => {
                  return 'Hello, ' + name + '!';
                };
              `,
              comments: ['Merci pour le partage!', 'J\'ai une question.']
            },
            {
              id: 3,
              username: 'Alice Johnson',
              codeContent: `
                class Person {
                  constructor(name, age) {
                    this.name = name;
                    this.age = age;
                  }
                }
              `,
              comments: ['Cool!', 'J\'aime beaucoup.']
            }
          ]);
        } else {
          setPosts(response.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des scripts:', error);
        setPosts([
          {
            id: 1,
            username: 'John Doe',
            codeContent: `
              function sum(a, b) {
                return a + b;
              }
            `,
            comments: ['Super!', 'Très intéressant.']
          },
          {
            id: 2,
            username: 'Jane Smith',
            codeContent: `
              const greet = (name) => {
                return 'Hello, ' + name + '!';
              };
            `,
            comments: ['Merci pour le partage!', 'J\'ai une question.']
          },
          {
            id: 3,
            username: 'Alice Johnson',
            codeContent: `
              class Person {
                constructor(name, age) {
                  this.name = name;
                  this.age = age;
                }
              }
            `,
            comments: ['Cool!', 'J\'aime beaucoup.']
          }
        ]);
      }
    };

    fetchScripts();
  }, [token]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/api/search?query=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Erreur lors de la recherche des personnes:', error);
    }
  };

  const handleFollow = async (followeeId) => {
    const followerId = 1; // Remplacez cette valeur par l'ID réel de l'utilisateur connecté
    try {
      await axios.post(`http://localhost:8080/api/users/${followerId}/follow/${followeeId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(`Suivi de l'utilisateur avec l'ID: ${followeeId}`);
    } catch (error) {
      console.error('Erreur lors du suivi de l\'utilisateur:', error);
    }
  };

  const handleUnfollow = async (followeeId) => {
    const followerId = 1; // Remplacez cette valeur par l'ID réel de l'utilisateur connecté
    try {
      await axios.post(`http://localhost:8080/api/users/${followerId}/unfollow/${followeeId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(`Désabonné de l'utilisateur avec l'ID: ${followeeId}`);
    } catch (error) {
      console.error('Erreur lors du désabonnement de l\'utilisateur:', error);
    }
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
          <div key={person.id} className="person">
            <p>{person.name}</p>
            <p>{person.email}</p>
            <button onClick={() => handleFollow(person.id)}>Suivre</button>
            <button onClick={() => handleUnfollow(person.id)}>Se désabonner</button>
          </div>
        ))}
      </div>
      <div className="posts">
        {posts.map(post => (
          <Post key={post.id} username={post.username} codeContent={post.codeContent} comments={post.comments} />
        ))}
      </div>
    </div>
  );
};

export default Accueil;
