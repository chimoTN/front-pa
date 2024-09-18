import React, { useEffect, useState } from 'react';
import '../src/style/Post.scss';
import axios from "./context/axios_token";

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
        const response = await axios.get(`http://localhost:8080/api/scripts/${scriptId}/comments/`);
        console.log('Fetched comments:', response.data);
        setPostComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    const checkLikesAndDislikes = async () => {
      try {
        const likeResponse = await axios.get(`http://localhost:8080/api/likes/${scriptId}`);
        const dislikeResponse = await axios.get(`http://localhost:8080/api/dislikes/${scriptId}`);

        if (likeResponse.data) {
          setIsLiked(1);
        } else if (dislikeResponse.data) {
          setIsLiked(-1);
        } else {
          setIsLiked(0);
        }
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
    if (isLiked === 1) {
      // Remove like
      try {
        await axios.delete(`http://localhost:8080/api/likes/${scriptId}`);
        setLikes(likes - 1);
        setIsLiked(0);
      } catch (error) {
        console.error('Error removing like:', error);
      }
    } else {
      // Add like
      try {
        await axios.post(`http://localhost:8080/api/likes/${scriptId}`);
        setLikes(likes + 1);
        setIsLiked(1);

        if (isLiked === -1) {
          // Remove dislike if it was present
          await axios.delete(`http://localhost:8080/api/dislikes/${scriptId}`);
          setDislikes(dislikes - 1);
        }
      } catch (error) {
        console.error('Error adding like:', error);
      }
    }
  };

  const handleDislike = async () => {
    if (isLiked === -1) {
      try {
        await axios.delete(`http://localhost:8080/api/dislikes/${scriptId}`);
        setDislikes(dislikes - 1);
        setIsLiked(0);
      } catch (error) {
        console.error('Error removing dislike:', error);
      }
    } else {
      try {
        await axios.post(`http://localhost:8080/api/dislikes/${scriptId}`);
        setDislikes(dislikes + 1);
        setIsLiked(-1);

        if (isLiked === 1) {
          await axios.delete(`http://localhost:8080/api/likes/${scriptId}`);
          setLikes(likes - 1);
        }
      } catch (error) {
        console.error('Error adding dislike:', error);
      }
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const commentDTO = {
          scriptId: scriptId,
          content: newComment
        };

        const response = await axios.post(`http://localhost:8080/api/scripts/${scriptId}/comments/`, commentDTO, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('Comment added:', response.data);

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
