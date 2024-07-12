import Axios from "axios"

const AuthService = () => {


    const postCode = (text,language) => {
        Axios.get(`jkj`, {
            text: text,
            language: language
        })
        .then(response => response)
        .catch(err => {
            console.log('error => ', err)
            setMessage("Incorrect login or password");
        })
    }


}

export default AuthService;