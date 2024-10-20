import React, { useState,useRef } from 'react';
import '../style/newEditor.scss';
import '../style/codeEditeur.scss';

import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';

import { Button } from 'primereact/button';
import { FaPython, FaJsSquare } from 'react-icons/fa';

import Select from 'react-select';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';

import CompilateurService from '../services/compilateurService';

const options = [
  { value: 'javascript', label: 'JavaScript', icon: <FaJsSquare /> },
  { value: 'python', label: 'Python', icon: <FaPython /> },
];

const def = `function add(){
    return "First Compile then Run The Code.....";
  }
  console.log(add());`;

const defValue = ``;

const NewEditor = () => {
    const [source, setsource] = useState('');
    const [id, setId] = useState('');
    const [output, setoutput] = useState('');
    const [input, setinput] = useState('');
    const [selectedOption, setselectedOption] = useState(options[0]);
    const [nameFile, setNameFile] = useState('New File');
    const [scriptDTO, setScriptDTO] = useState({
      name: "yelloWorld",
      protectionLevel: "PRIVATE",
      language: "Python",
      inputFiles: "",
      outputFiles: "" 
    });
  
    const toast = useRef(null);
    const compilateurService = CompilateurService();
  
    function onChange(newValue) {
      setsource(newValue);
    }
  
    const changeScriptDTO = () => {
      setScriptDTO({
        name: nameFile,
        protectionLevel: "PRIVATE",
        language: selectedOption.value, // Assurez-vous que c'est une chaîne et non un objet
        inputFiles: "",
        outputFiles: "" 
      });
    };
  
    const nameChange = (e) => {
      setNameFile(e.target.value);
    };
  
    const handleChange = (selected) => {
      setselectedOption(selected);
    };
  
    const Compile = async () => {
      changeScriptDTO();
  
      try {
        const { data } = await compilateurService.executeScript(scriptDTO, source);
        setId(data.id);
        console.log("Script ID:", data.id);
      } catch (error) {
        setoutput("Error during compile: " + (error.response?.data?.message || error.message));
      }
    };
  
    const Run = async () => {
      try {
        const { data } = await compilateurService.executeScript(scriptDTO, source);
        if (data.stderr) {
          setoutput(data.stderr);
          setId(null);
          return;
        }
        setoutput(data.stdout);
        setId(null);
      } catch (error) {
        setoutput("Error during run: " + (error.response?.data?.message || error.message));
      }
    };
  
    const Save = async () => {
      try {
        await compilateurService.saveCode(nameFile, source);
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Code sauvegarder!' });
      } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'March pas!' });
        setoutput("Error during save: " + (error.response?.data?.message || error.message));
      }
    };
  
    const Share = async () => {
      try {
        await compilateurService.shareCode(source);
      } catch (error) {
        setoutput("Error during share: " + (error.response?.data?.message || error.message));
      }
    };
  
    return (
      <div className="container">
        <Toast ref={toast} /> {/* Ajouter le composant Toast ici */}
        <div className="select-div">
          <div className="title-div">Selectionner un language</div>
          <Select
            value={selectedOption}
            onChange={handleChange}
            options={options.map(option => ({
              ...option,
              label: (
                <div className="select-option">
                  {option.icon} {option.label}
                </div>
              ),
            }))}
          />
          <div className="title-div">Nom du fichier</div>
          <InputText value={nameFile} onChange={nameChange} />
        </div>
  
        <div className="editor-container">
          <div className="editor-and-output">
            <div className="editor-div">
              <nav className="navbar">
                  <Button label="Compile" icon="pi pi-cog" onClick={Compile} className="p-button-outlined p-button-primary" />
                  <Button label="Run" icon="pi pi-play" onClick={Run} className={`p-button-outlined ${id ? 'p-button-success' : 'p-button-disabled'}`} disabled={!id} />
                  <Button label="Save" icon="pi pi-save" onClick={Save} className="p-button-outlined" />
                  <Button label="Share" icon="pi pi-share-alt" onClick={Share} className="p-button-outlined" />
              </nav>
  
              <AceEditor
                defaultValue={defValue}
                width="100%"
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                mode={selectedOption.value}
                theme="monokai"
                fontSize={16}
                onChange={onChange}
                name="UNIQUE_ID_OF_DIV"
                editorProps={{ $blockScrolling: true }}
                setOptions={{ tabSize: 2 }}
              />
            </div>
  
            <div className="output-div">
              <div className="box">
                <b>Entrée du programme:</b>
                <textarea onChange={(e) => setinput(e.target.value)} />
              </div>
              <div className="box" style={{ height: '300px' }}> 
                <b>Sortie du programme:</b>
                <textarea value={output} disabled />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default NewEditor;
  
