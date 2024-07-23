import Axios from "axios"
import config from "../config";

const AuthService = () => {


    const login = (email, password) => {
        console.log("chemun ",config.URL_LOGIN)
        return Axios.post(config.URL_LOGIN, {mail: email, password: password}, {
            withCredentials: true 
        });
    };

    const register = (formData) => {
        return Axios.post(config.URL_REGISTER, {
          mail: formData.email,
          password: formData.password,
          passwordCheck: formData.confirm
        })
    };

    return {
        login,
        register
    }

}

export default AuthService;