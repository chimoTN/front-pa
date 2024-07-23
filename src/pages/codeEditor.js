import React, { useState, useEffect } from 'react';
import '../style/codeEditeur.scss';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useLocation } from 'react-router-dom';
import CompilateurService from '../services/compilateurService';

const CodeEditor = () => {

  const location = useLocation();
  const [code, setCode] = useState(location.state?.code || '');
  const [terminal, setTerminal] = useState(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');

  const compilateurService = CompilateurService();

  const handleChange = (event) => {
    setCode(event.target.value);
  };


  const scriptDTO = {
    name: "HelloWorld",  
    protectionLevel: "PRIVATE", 
    language: "Python",  
    inputFiles: "",  
    outputFiles: "", 
    userId: 2
  };

  // const runCode = () => {
  //   const token = sessionStorage.getItem('token'); 
  //   console.log("token",token)
    
  //   Axios({
  //     method: 'post',
  //     url: `http://localhost:8080/api/scripts/execute/raw`,
  //     data: {
  //       scriptDTO: scriptDTO,
  //       scriptContent: code
  //     },
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${token}`
  //     },
  //   })
  //     .then((response) => {
  //       setTerminal(response.data);
  //       setShowTerminal(true);
  //     })
  //     .catch((err) => {
  //       console.log('error => ', err);
  //       setTerminal('Error executing code');
  //       setShowTerminal(true);
  //     });
  // };
  
  const runCode = async () => {
    const token = sessionStorage.getItem('token');
    console.log("token",token);

    try {
      const response = await compilateurService.executeScript(scriptDTO, code, token);
      setTerminal(response.data);
      setShowTerminal(true);
    } catch (err) {
      console.log('error => ', err);
      setTerminal('Error executing code');
      setShowTerminal(true);
    }
  };


  // const sharCode = () => {
  //   Axios.post(URL, { code })
  //     .then((response) => {
  //       setTerminal(response.data.output);
  //       setShowTerminal(true);
  //     })
  //     .catch((err) => {
  //       console.log('error => ', err);
  //       setTerminal('Error publication code');
  //       setShowTerminal(true);
  //     });
  // };


  const sharCode = async () => {
    try {
      const response = await CompilateurService().shareCode(code);
      setTerminal(response.data.output);
      setShowTerminal(true);
    } catch (err) {
      console.log('error => ', err);
      setTerminal('Error publication code');
      setShowTerminal(true);
    }
  };

  // const saveCode = () => {
  //   Axios.post(SAVE_URL, { name: saveName, code })
  //     .then((response) => {
  //       setShowSaveDialog(false);
  //     })
  //     .catch((err) => {
  //       console.log('Error saving code:', err);
  //     });
  // };

  const saveCode = async () => {
    try {
      await CompilateurService().saveCode(saveName, code);
      setShowSaveDialog(false);
    } catch (err) {
      console.log('Error saving code:', err);
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
            label={showTerminal ? 'Cacher Terminal' : 'Show Terminal'}
            className="p-button-secondary"
            onClick={() => setShowTerminal(!showTerminal)}
          />
        )}
      </div>

      {showTerminal && (
        <div className="terminal-container">
          {showTerminal && <pre className="terminal-output">{terminal}</pre>}
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
