import React, { useState } from 'react';
import '../src/style/Post.scss';

const Post = ({ username, codeContent, comments }) => {
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);
  const [likes, setLikes] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [postComments, setPostComments] = useState(comments);

  const toggleCodeView = () => {
    setIsCodeExpanded(!isCodeExpanded);
  };

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setPostComments([...postComments, newComment]);
      setNewComment('');
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        <h3>{username}</h3>
      </div>
      <div className="post-code">
        <pre>
          {isCodeExpanded ? codeContent : `${codeContent.substring(0, 100)}...`}
        </pre>
        <button onClick={toggleCodeView}>
          {isCodeExpanded ? 'Show Less' : 'Show More'}
        </button>
      </div>
      <div className="post-actions">
        <button onClick={handleLike}>👍 {likes}</button>
      </div>
      <div className="post-comments">
        <h4>Commentaires</h4>
        <ul>
          {postComments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
        <input
          type="text"
          value={newComment}
          onChange={handleCommentChange}
          placeholder="Ajouter un commentaire"
        />
        <button onClick={handleAddComment}>Post Comment</button>
      </div>
    </div>
  );
};

export default Post;
