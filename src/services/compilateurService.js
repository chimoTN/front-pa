import Axios from 'axios';
import config from '../config';

const CompilateurService = () => {
    const executeScript = (scriptDTO, scriptContent, token) => {
        return Axios.post(`${config.URL_CODE_EXEC}/scripts/execute/raw`, {
            scriptDTO,
            scriptContent
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    };

    const shareCode = (code) => {
        return Axios.post(`${config.URL_CODE_EXEC_JECPAS}/scripts/execute`, { code });
    };

    const saveCode = (name, code) => {
        return Axios.post(`${config.URL_SAVE_CODE}/saveCode`, { name, code });
    };

    return {
        executeScript,
        shareCode,
        saveCode
    };
};

export default CompilateurService;
