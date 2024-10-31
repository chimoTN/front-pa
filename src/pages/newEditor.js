import React, { useState, useRef } from 'react';
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

const defValue = ``;

const NewEditor = () => {
    const [source, setSource] = useState('');
    const [id, setId] = useState('');
    const [output, setOutput] = useState('');
    const [input, setInput] = useState('');
    const [selectedOption, setSelectedOption] = useState(options[0]);
    const [nameFile, setNameFile] = useState('New File');
    const [scriptDTO, setScriptDTO] = useState({
        name: "New File",
        protectionLevel: "PRIVATE",
        language: "Python",
        inputFiles: "",
        outputFiles: "" 
    });
  
    const toast = useRef(null);
    const compilateurService = CompilateurService();

    function onChange(newValue) {
      setSource(newValue);
    }
  
    const changeScriptDTO = () => {
      setScriptDTO({
        name: nameFile,
        protectionLevel: "PRIVATE",
        language: "Python",
        inputFiles: "",
        outputFiles: "" 
      });
    };
  
    const nameChange = (e) => {
      setNameFile(e.target.value);
    };
  
    const handleChange = (selected) => {
      setSelectedOption(selected);
    };
  
    const Compile = async () => {
      changeScriptDTO();

      try {
        const { data } = await compilateurService.createScript(scriptDTO, source);
        console.log(" === Compile ===", data)

        setId(data.id);

        setOutput('Compilation réussie !');

      } catch (error) {
        setOutput("Erreur lors de la compilation : " + (error.response?.data?.message || error.message));
      }
    };
  
    const Run = async () => {
      try {

        const scriptToFileMap = {
          [id]: [], 
        };
    
        const { data } = await compilateurService.executePipeline(id, scriptToFileMap);
    
        console.log(" === RUN === :", data)

        setOutput(data);
      } catch (error) {
        setOutput("Erreur lors de l'exécution : " + (error.response?.data?.message || error.message));
      }
    };
  
    const Save = async () => {
      try {
        await compilateurService.updateScript(id, source);
        toast.current.show({ severity: 'success', summary: 'Succès', detail: 'Code sauvegardé !' });
      } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Erreur', detail: "La sauvegarde a échoué !" });
        setOutput("Erreur lors de la sauvegarde : " + (error.response?.data?.message || error.message));
      }
    };

    
    const Share = async () => {
      try {
        await compilateurService.uploadFile(new Blob([source], { type: 'text/plain' }));
        toast.current.show({ severity: 'success', summary: 'Succès', detail: 'Code partagé !' });
      } catch (error) {
        setOutput("Erreur lors du partage : " + (error.response?.data?.message || error.message));
      }
    };

    return (
      <div className="container">
        <Toast ref={toast} />
        <div className="select-div">
          <div className="title-div">Sélectionnez un langage</div>
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
                

                <Button 
                  label="Run" 
                  icon="pi pi-play" 
                  onClick={Run} 
                  className={`p-button-outlined ${id ? 'p-button-primary' : 'p-button-disabled'}`} 
                  disabled={!id} 
                />

                <Button label="Save" icon="pi pi-save" onClick={Save} className="p-button-outlined" />
                <Button label="Share - Save file" icon="pi pi-share-alt" onClick={Share} className="p-button-outlined" />
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
                setOptions={{
                  useWorker: false,
                  tabSize: 2
               }}
              />
            </div>
  
            <div className="output-div">
              <div className="box">
                <b>Entrée du programme :</b>
                <textarea onChange={(e) => setInput(e.target.value)} />
              </div>
              <div className="box" style={{ height: '300px' }}> 
                <b>Sortie du programme :</b>
                <textarea value={output} disabled />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
export default NewEditor;
