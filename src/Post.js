import React, { useEffect, useState } from 'react';
import '../src/style/Post.scss';
import PostService from './services/postService';

const Post = ({ username, codeContent, script }) => {
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);
  const [likes, setLikes] = useState(script.nbLikes);
  const [dislikes, setDislikes] = useState(script.nbDislikes);
  const [postComments, setPostComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(0);

  const scriptId = script.id;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await PostService.getComments(scriptId);
        setPostComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    const checkLikesAndDislikes = async () => {
      try {
        const { isLiked } = await PostService.getLikeStatus(scriptId);
        setIsLiked(isLiked);
      } catch (error) {
        console.error('Error checking likes and dislikes:', error);
      }
    };

    fetchComments();
    checkLikesAndDislikes();
  }, [scriptId]);

  const toggleCodeView = () => {
    setIsCodeExpanded(!isCodeExpanded);
  };

  const handleLike = async () => {
    try {
      if (isLiked === 1) {
        await PostService.removeLike(scriptId);
        setLikes(likes - 1);
        setIsLiked(0);
      } else {
        await PostService.addLike(scriptId);
        setLikes(likes + 1);
        setIsLiked(1);

        if (isLiked === -1) {
          await PostService.removeDislike(scriptId);
          setDislikes(dislikes - 1);
        }
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleDislike = async () => {
    try {
      if (isLiked === -1) {
        await PostService.removeDislike(scriptId);
        setDislikes(dislikes - 1);
        setIsLiked(0);
      } else {
        await PostService.addDislike(scriptId);
        setDislikes(dislikes + 1);
        setIsLiked(-1);

        if (isLiked === 1) {
          await PostService.removeLike(scriptId);
          setLikes(likes - 1);
        }
      }
    } catch (error) {
      console.error('Error handling dislike:', error);
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const response = await PostService.addComment(scriptId, newComment);
        if (response.status === 201) {
          setPostComments([...postComments, response.data]);
          setNewComment('');
        }
      } catch (error) {
        console.error('Error adding comment:', error);
      }
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

      <div style={{ display: 'flex', gap: '10px' }}>
        <div className="post-actions">
          <button
            onClick={handleLike}
            style={{ backgroundColor: isLiked === 1 ? 'blue' : 'gray' }}
          >
            👍 {likes}
          </button>
        </div>
        <div className="post-actions">
          <button
            onClick={handleDislike}
            style={{ backgroundColor: isLiked === -1 ? 'red' : 'gray' }}
          >
            👎 {dislikes}
          </button>
        </div>
      </div>

      <div className="post-comments">
        <h4>Commentaires</h4>
        <ul>
          {postComments.map((comment) => (
            <li key={comment.commentId}>{comment.content}</li>
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
