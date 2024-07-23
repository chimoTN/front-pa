const config = {

    URL_LOGIN: `${process.env.REACT_APP_API_URL}/users/signIn`,
    URL_REGISTER: `${process.env.REACT_APP_API_URL}/users/signUp`,

    URL_CODE_EXEC: `${process.env.REACT_APP_API_URL}/scripts/execute/raw`,
    URL_CODE_EXEC_JECPAS: `${process.env.REACT_APP_API_URL}/scripts/execute`,
    URL_SAVE_CODE: `${process.env.REACT_APP_API_URL}/saveCode`,
};

export default config;
