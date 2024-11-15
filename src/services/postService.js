/*import axios from '../context/axios_token';

const PostService = {

    getComments: async (scriptId) => {
        return axios.get(`http://localhost:8080/api/scripts/${scriptId}/comments/`);
    },

    getLikeStatus: async (scriptId) => {
        const likeResponse = await axios.get(`http://localhost:8080/api/likes/${scriptId}`);
        const dislikeResponse = await axios.get(`http://localhost:8080/api/dislikes/${scriptId}`);
        return {
            isLiked: likeResponse.data ? 1 : (dislikeResponse.data ? -1 : 0)
        };
    },

    addLike: async (scriptId) => {
        return axios.post(`http://localhost:8080/api/likes/${scriptId}`);
    },

    removeLike: async (scriptId) => {
        return axios.delete(`http://localhost:8080/api/likes/${scriptId}`);
    },

    addDislike: async (scriptId) => {
        return axios.post(`http://localhost:8080/api/dislikes/${scriptId}`);
    },

    removeDislike: async (scriptId) => {
        return axios.delete(`http://localhost:8080/api/dislikes/${scriptId}`);
    },

    addComment: async (scriptId, content) => {
        const commentDTO = { scriptId, content };
        return axios.post(`http://localhost:8080/api/scripts/${scriptId}/comments/`, commentDTO, {
            headers: { 'Content-Type': 'application/json' }
        });
    }

};

export default PostService;*/

import axios from '../context/axios_token';

const PostService = {

    getComments: async (scriptId) => {
        return axios.get(`${process.env.REACT_APP_API_URL}/scripts/${scriptId}/comments/`);
    },

    getLikeStatus: async (scriptId) => {
        const likeResponse = await axios.get(`${process.env.REACT_APP_API_URL}/likes/${scriptId}`);
        const dislikeResponse = await axios.get(`${process.env.REACT_APP_API_URL}/dislikes/${scriptId}`);
        return {
            isLiked: likeResponse.data ? 1 : (dislikeResponse.data ? -1 : 0)
        };
    },

    addLike: async (scriptId) => {
        return axios.post(`${process.env.REACT_APP_API_URL}/likes/${scriptId}`);
    },

    removeLike: async (scriptId) => {
        return axios.delete(`${process.env.REACT_APP_API_URL}/likes/${scriptId}`);
    },

    addDislike: async (scriptId) => {
        return axios.post(`${process.env.REACT_APP_API_URL}/dislikes/${scriptId}`);
    },

    removeDislike: async (scriptId) => {
        return axios.delete(`${process.env.REACT_APP_API_URL}/dislikes/${scriptId}`);
    },

    addComment: async (scriptId, content) => {
        const commentDTO = { scriptId, content };
        return axios.post(`${process.env.REACT_APP_API_URL}/scripts/${scriptId}/comments/`, commentDTO, {
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
};

export default PostService;

