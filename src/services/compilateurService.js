import Axios from 'axios';
import config from '../config';

const CompilateurService = () => {
    
    const token = sessionStorage.getItem('token');

    const compileScript = (scriptDTO, scriptContent) => {
        return Axios.post(`${config.URL_CODE_EXEC}/scripts`, {
            scriptDTO,
            scriptContent
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            }
        });
    };

    const executeScript = (initialScriptId, scriptToFileMap) => {
        return Axios.get(`${config.URL_CODE_EXEC}/scripts/execute`, {
            initialScriptId,
            scriptToFileMap
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            }
        });
    };

    const shareCode = (code) => {
        return Axios.post(`${config.URL_CODE_EXEC_JECPAS}/scripts/execute`, { code }, {
            headers: {
                'Authorization': `${token}`
            }
        });
    };

    const saveCode = (name, code) => {
        return Axios.post(`${config.URL_SAVE_CODE}/saveCode`, { name, code }, {
            headers: {
                'Authorization': `${token}`
            }
        });
    };

    return {
        compileScript,
        executeScript,
        shareCode,
        saveCode
    };
};

export default CompilateurService;
