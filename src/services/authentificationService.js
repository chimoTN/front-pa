import Axios from "axios";
import config from "../config";

const AuthService = () => {

    const login = (email, password) => {
        return Axios.post(config.URL_LOGIN, { mail: email, password: password }, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    const register = (formData) => {
        return Axios.post(config.URL_REGISTER, {
            mail: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            password: formData.password,
            passwordCheck: formData.confirm
        }, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };
    
    return {
        login,
        register
    };
}

export default AuthService;
