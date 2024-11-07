const config = {

    URL_LOGIN: `${process.env.REACT_APP_API_URL}/users/signIn`,
    URL_REGISTER: `${process.env.REACT_APP_API_URL}/users/signUp`,

    URL_CREATE_SCRIPT: `${process.env.REACT_APP_API_URL}/scripts`,
    URL_UPLOAD_FILE: `${process.env.REACT_APP_API_URL}/files`,
    URL_EXECUTE_PIPELINE: `${process.env.REACT_APP_API_URL}/scripts/execute-pipeline`,
    URL_UPDATE_SCRIPT: `${process.env.REACT_APP_API_URL}/scripts`,
    
    
    URL_GET_PIPELINES: `${process.env.REACT_APP_API_URL}/pipelines`,
    URL_GET_PIPELINE_JOBS: (id) => `${process.env.REACT_APP_API_URL}/pipelines/${id}/jobs`,
    URL_GET_PIPELINE_OUTPUT: (jobId) => `${process.env.REACT_APP_API_URL}/pipelines/output/${jobId}`,
    
    
    URL_WEBSOCKET: `${process.env.REACT_APP_API_URL}/ws`

};

export default config;
