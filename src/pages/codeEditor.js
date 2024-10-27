import React, { useState } from 'react';
import '../style/codeEditeur.scss';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useLocation } from 'react-router-dom';
import axios from "../context/axios_token";


const CodeEditor = () => {
  const location = useLocation();
  const [code, setCode] = useState(location.state?.code || '');
  const [terminal, setTerminal] = useState(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');

  const handleChange = (event) => {
    setCode(event.target.value);
  };

  const parseCode = (code) => {
    return code; // Vous pouvez personnaliser le parsing ici si nécessaire
  };

  const scriptDTO = {
    name: "yelloWorld",
    location: "",
    protectionLevel: "PRIVATE",
    language: "Python",
    inputFileExtensions: "",
    outputFileNames: ""
  };

  const sharCode = async () => {
    //const token = sessionStorage.getItem('token');
    const token = localStorage.getItem('token')
    console.log("token dans ShareCode : ", token);

    const scriptContent = parseCode(code);
    console.log("scriptContent", scriptContent);

    try {
      const response = await axios.post(
          'http://localhost:8080/api/scripts',
          {
            scriptDTO,
            scriptContent
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization':`${token}`
            }
          }
      );
      setTerminal(response.data.output);
      setShowTerminal(true);
    } catch (err) {
      console.error('Error =>', err);
      setTerminal('Error publishing code');
      setShowTerminal(true);
    }
  };

  const runCode = async () => {
    const token = sessionStorage.getItem('token');

    const scriptContent = parseCode(code);
    console.log("scriptContent", scriptDTO, scriptContent);

    if (!token) {
      console.error('No token found');
      setTerminal('Unauthorized: No token found');
      return;
    }

    try {
      // Crée un script avec le contenu fourni
      const postResponse = await axios.post(
        'http://localhost:8080/api/scripts',
        {
          scriptDTO,
          scriptContent
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
          },
          withCredentials: true
        }
      );

      console.log("POST Response:", postResponse);

      // Préparer le corps pour l'exécution
      const scriptId = postResponse.data.id;

      const executeResponse = await axios.post(
        'http://localhost:8080/api/scripts/execute-pipeline',
        {
          initialScriptId: scriptId,
          scriptToFileMap: {
            [scriptId]: [] // Map des fichiers associés au script
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
          }
        }
      );

      console.log("Execute Response:", executeResponse);
      setTerminal(JSON.stringify(executeResponse.data, null, 2));
      setShowTerminal(true);

    } catch (err) {
      console.error('Error =>', err);
      setTerminal('Error executing code');
      setShowTerminal(true);
    }
  };


  const saveCode = async () => {
    const token = sessionStorage.getItem('token');
    console.log("token", token);

    const scriptContent = parseCode(code);
    console.log("scriptContent", scriptContent);

    try {
      const response = await axios.post(
        'https://projet-annuel-1.onrender.com/api/scripts/save',
        {
          name: saveName,
          code
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
          }
        }
      );
      setShowSaveDialog(false);
    } catch (err) {
      console.error('Error saving code:', err);
    }
  };

  const handleSave = () => {
    setShowSaveDialog(true);
  };

  return (
    <div style={{ padding: 50 }}>
      <div className="code-editor-container">
        <textarea
          className="code-input"
          value={code}
          onChange={handleChange}
          placeholder="Écrivez votre code ici..."
          rows="10"
          cols="50"
        />
      </div>

      <div className="button-container">
        <Button label="Sauvegarder" className="p-button-info" onClick={handleSave} />
        <Button label="RUN" className="p-button-success" onClick={runCode} />
        <Button label="PARTAGER" className="p-button-success" onClick={sharCode} />
        {showTerminal && (
          <Button
            label={showTerminal ? 'Cacher Terminal' : 'Afficher Terminal'}
            className="p-button-secondary"
            onClick={() => setShowTerminal(!showTerminal)}
          />
        )}
      </div>

      {showTerminal && (
        <div className="terminal-container">
          <pre className="terminal-output">{terminal}</pre>
        </div>
      )}

      <Dialog
        header="Sauvegarder le Code"
        visible={showSaveDialog}
        style={{ width: '50vw' }}
        onHide={() => setShowSaveDialog(false)}
      >
        <div className="p-field">
          <label htmlFor="saveName">Nom du fichier</label>
          <br />
          <br />
          <InputText
            id="saveName"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            required
          />
        </div>
        <br />
        <Button label="Sauvegarder" className="p-button-success" onClick={saveCode} />
      </Dialog>
    </div>
  );
};

export default CodeEditor;
