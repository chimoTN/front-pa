import axios from 'axios';

axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        console.log("je récupère le token a partir de axios_token : " + token)
        if (token) {
            console.log("c'est bon !")
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        console.log('request URL:', config.url);
        console.log('request headers:', config.headers);

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

window.addEventListener('beforeunload', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
});

export default axios;