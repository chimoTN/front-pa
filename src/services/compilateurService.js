import Axios from "axios"

const SERVER = "your_server_address"; // Remplacez par votre adresse serveur
const PORT = "your_port"; // Remplacez par votre port
const ACTUAL_TOKEN = "your_actual_token"; // Remplacez par votre token actuel

const CompilService = () => {

  const headers = {
    'Authorization': `Bearer ${ACTUAL_TOKEN}`,
    'Content-Type': 'application/json'
  };

  const getAllScripts = () => {
    return Axios.get(`http://${SERVER}:${PORT}/api/scripts`, { headers })
      .then(response => response.data)
      .catch(err => {
        console.error('Error fetching scripts:', err);
        throw err;
      });
  };

  const executeOnTheFly = (scriptContent) => {
    const data = {
      scriptDTO: {
        name: "HelloWorld",
        protectionLevel: "PRIVATE",
        language: "Python",
        inputFiles: "",
        outputFiles: "",
        userId: 1
      },
      scriptContent: scriptContent
    };

    return Axios.post(`http://${SERVER}:${PORT}/api/scripts/execute`, data, { headers })
      .then(response => response.data)
      .catch(err => {
        console.error('Error executing script:', err);
        throw err;
      });
  };

  const getAllScriptsFromOneUser = (userId) => {
    return Axios.get(`http://${SERVER}:${PORT}/api/scripts/fromUser/${userId}`, { headers })
      .then(response => response.data)
      .catch(err => {
        console.error('Error fetching user scripts:', err);
        throw err;
      });
  };

  const postScript = (scriptDTO, scriptContent) => {
    const data = {
      scriptDTO: scriptDTO,
      scriptContent: scriptContent
    };

    return Axios.post(`http://${SERVER}:${PORT}/api/scripts`, data, { headers })
      .then(response => response.data)
      .catch(err => {
        console.error('Error posting script:', err);
        throw err;
      });
  };

  const patchScript = (scriptId, scriptDTO, scriptContent) => {
    const data = {
      scriptDTO: scriptDTO,
      scriptContent: scriptContent
    };

    return Axios.patch(`http://${SERVER}:${PORT}/api/scripts/${scriptId}`, data, { headers })
      .then(response => response.data)
      .catch(err => {
        console.error('Error patching script:', err);
        throw err;
      });
  };

  const deleteScript = (scriptId) => {
    return Axios.delete(`http://${SERVER}:${PORT}/api/scripts/${scriptId}`, { headers })
      .then(response => response.data)
      .catch(err => {
        console.error('Error deleting script:', err);
        throw err;
      });
  };

  const executeOneSavedScript = (scriptId) => {
    return Axios.get(`http://${SERVER}:${PORT}/api/scripts/execute/${scriptId}`, { headers })
      .then(response => response.data)
      .catch(err => {
        console.error('Error executing saved script:', err);
        throw err;
      });
  };

};

export default CompilService;
