import Axios from 'axios';
import axios from "../context/axios_token"; 

const UserService = {

    getProfileData: (userId) => {
        return Axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}`);
    },

    getFollowing: (userId) => {
        return Axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}/following`);
    },

    getFollowers: (userId) => {
        return Axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}/followers`);
    },

    followUser: (userId) => {
        return axios.post(`${process.env.REACT_APP_API_URL}/users/${userId}/follows`);
    },

    unfollowUser: (userId) => {
        return axios.delete(`${process.env.REACT_APP_API_URL}/users/${userId}/follows`);
    },

    checkIsFollowing: (userId) => {
        return Axios.get(`${process.env.REACT_APP_API_URL}/users/isFollowing/${userId}`);
    }
};

export default UserService;
