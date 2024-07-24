import React, { useState } from 'react';
import '../style/codeEditeur.scss';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useUser } from "../context/appContext";

const CodeEditor = () => {
  const location = useLocation();
  const [code, setCode] = useState(location.state?.code || '');
  const [terminal, setTerminal] = useState(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');

  //const [user, setUser] = useUser();

  const handleChange = (event) => {
    setCode(event.target.value);
  };

  const parseCode = (code) => {
    return code
    //return code.replace(/\r?\n|\r/g, "\\n").replace(/\s+/g, " ").trim());
  };

  const scriptDTO = {
    name: "yelloWorld",
    protectionLevel: "PRIVATE",
    language: "Python",
    inputFiles: "",
    outputFiles: ""
  };

  const runCode = async () => {
    const token = sessionStorage.getItem('token');
    
    
    const scriptContent = parseCode(code);
    console.log("scriptContent", scriptDTO,scriptContent);
    
    if (!token) {
      console.error('No token found');
      setTerminal('Unauthorized: No token found');
      return;
    }

    
    try {
      const postResponse = await axios.post(
        'https://projet-annuel-1.onrender.com/api/scripts',
        {
          scriptDTO: {
            name: "yelloWorld",
            protectionLevel: "PRIVATE",
            language: "Python",
            inputFiles: "",
            outputFiles: ""
          },
          scriptContent: "print('Hello, world!')"
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      console.log("RESPONSE : ",postResponse)

      // const executeResponse = await axios.post(
      //   `https://projet-annuel-1.onrender.com/api/scripts/execute/${postResponse.data.id}`,
      //   {
      //     fileIds: [],
      //     scriptIds: []
      //   },
      //   {
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Authorization': `Bearer ${token}`
      //     }
      //   }
      // );

      setTerminal(postResponse.data);
      setShowTerminal(true);

    } catch (err) {
      console.log('error => ', err);
      setTerminal('Error executing code');
      setShowTerminal(true);
    }
  };

  const sharCode = async () => {
    const token = sessionStorage.getItem('token');
    console.log("token", token);

    const scriptContent = parseCode(code);
    console.log("scriptContent", scriptContent);

    try {
      const response = await axios.post(
        'https://projet-annuel-1.onrender.com/api/scripts',
        {
          scriptDTO,
          scriptContent: code
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setTerminal(response.data.output);
      setShowTerminal(true);
    } catch (err) {
      console.log('error => ', err);
      setTerminal('Error publication code');
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
            'Authorization': `Bearer ${token}`
          }
        }
      );
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
