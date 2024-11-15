/*const config = {

    URL_LOGIN: `http://localhost:8080/api/users/signIn`,
    URL_REGISTER: `http://localhost:8080/api/users/signUp`,

    URL_CREATE_SCRIPT: `http://localhost:8080/api/scripts`,
    URL_GET_MY_SCRIPTS: `http://localhost:8080/api/scripts/private`,
    URL_UPLOAD_FILE: `http://localhost:8080/api/files`,
    URL_EXECUTE_PIPELINE: `http://localhost:8080/api/scripts/execute-pipeline`,
    URL_UPDATE_SCRIPT: `http://localhost:8080/api/scripts`,

    URL_GET_PIPELINES: `http://localhost:8080/api/pipelines`,
    URL_GET_PIPELINE_JOBS: (id) => `http://localhost:8080/api/pipelines/${id}/jobs`,
    URL_GET_PIPELINE_OUTPUT: (jobId) => `http://localhost:8080/api/pipelines/output/${jobId}`,

    URL_WEBSOCKET: `http://localhost:8080/ws`

};

export default config;*/

const config = {

    URL_LOGIN: `${process.env.REACT_APP_API_URL}/users/signIn`,
    URL_REGISTER: `${process.env.REACT_APP_API_URL}/users/signUp`,

    URL_CREATE_SCRIPT: `${process.env.REACT_APP_API_URL}/scripts`,
    URL_GET_MY_SCRIPTS: `${process.env.REACT_APP_API_URL}/scripts/private`,
    URL_UPLOAD_FILE: `${process.env.REACT_APP_API_URL}/files`,
    URL_EXECUTE_PIPELINE: `${process.env.REACT_APP_API_URL}/scripts/execute-pipeline`,
    URL_UPDATE_SCRIPT: `${process.env.REACT_APP_API_URL}/scripts`,
    
    
    URL_GET_PIPELINES: `${process.env.REACT_APP_API_URL}/pipelines`,
    URL_GET_PIPELINE_JOBS: (id) => `${process.env.REACT_APP_API_URL}/pipelines/${id}/jobs`,
    URL_GET_PIPELINE_OUTPUT: (jobId) => `${process.env.REACT_APP_API_URL}/pipelines/output/${jobId}`,
    
    
    URL_WEBSOCKET: `https://projet-annuel-1.onrender.com/ws`

};

export default config;
