import Axios from 'axios';
import config from '../config';

const CompilateurService = () => {
    const token = localStorage.getItem('token');

    // Créer un nouveau script
    const createScript = (scriptDTO, scriptContent) => {
        return Axios.post(`http://localhost:8080/api/scripts`, {
            scriptDTO,
            scriptContent
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    };

    // Upload du fichier généré pour le script
    const uploadFile = (file) => {
        const formData = new FormData();
        formData.append('file', file);

        return Axios.post(`${config.URL_UPLOAD_FILE}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
    };

    // Exécuter le script via le pipeline
    const executePipeline = (initialScriptId, scriptToFileMap) => {
        return Axios.post(`${config.URL_EXECUTE_PIPELINE}`, {
          initialScriptId,
          scriptToFileMap
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      };

    // Mettre à jour un script existant
    const updateScript = (scriptId, scriptContent, scriptDTO) => {
        return Axios.patch(`${config.URL_UPDATE_SCRIPT}/${scriptId}`, {
            scriptDTO, // Inclut l'objet scriptDTO complet
            scriptContent
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    };

    const recupContent = (scriptId) => {
        return Axios.get(`http://localhost:8080/api/scripts/${scriptId}/content`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    }

    return {
        createScript,
        uploadFile,
        executePipeline,
        updateScript,
        recupContent
    };
};

export default CompilateurService;
