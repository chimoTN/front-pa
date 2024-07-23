import React from 'react';
import Post from './Post'; // Assurez-vous d'importer correctement le composant Post

const Accueil = () => {
  // Exemple de données de posts
  const posts = [
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
    // Ajoutez d'autres posts si nécessaire
  ];

  return (
    <div className="accueil">
      <div className="posts">
        {posts.map(post => (
          <Post key={post.id} username={post.username} codeContent={post.codeContent} comments={post.comments} />
        ))}
      </div>
    </div>
  );
};

export default Accueil;
