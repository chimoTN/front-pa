import React, { useState, useRef, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';

import '../style/newEditor.scss';
import '../style/codeEditeur.scss';

import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';

import { Modal } from 'react-bootstrap';

import { Button } from 'primereact/button';
import { FaPython, FaJsSquare } from 'react-icons/fa';

import Select from 'react-select';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';

import CompilateurService from '../services/compilateurService';
import Dropzone from 'react-dropzone';

const options = [
  { value: 'javascript', label: 'JavaScript', icon: <FaJsSquare /> },
  { value: 'python', label: 'Python', icon: <FaPython /> },
];

const defValue = ``;

const NewEditor = ({ scriptContent }) => {
    const [source, setSource] = useState(scriptContent || '');
    const [id, setId] = useState('');
    const [fileId, setFileId] = useState(null); 
    const [output, setOutput] = useState('');
    const [input, setInput] = useState('');
    const [selectedOption, setSelectedOption] = useState(options[0]);
    const [nameFile, setNameFile] = useState('New File');
    const [inputFiles, setInputFiles] = useState('');
    const [outputFiles, setOutputFiles] = useState('');
    const [nameFileToUpload, setNameFileToUpload] = useState('New File');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);


    const [scriptDTO, setScriptDTO] = useState({
        name: nameFile,
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
  
    const nameChange = (e) => {
      setNameFile(e.target.value);
      console.log("New name", nameFile)
    };
  
    const handleChange = (selected) => {
      setSelectedOption(selected);
    };
  
    const Compile = async () => {
      setScriptDTO({
        name: nameFile,
        protectionLevel: "PRIVATE",
        language: "Python",
        inputFiles: "",
        outputFiles: "" 
      });

      try {
        const { data } = await compilateurService.createScript(scriptDTO, source);

        setId(data.id);

        setOutput('Compilation réussie !');

      } catch (error) {
        setOutput("Erreur lors de la compilation : " + (error.response?.data?.message || error.message));
      }
    };
  
    const Run = async () => {
      try {

        const scriptToFileMap = {
          [id]: fileId ? [fileId] : [] 
        };
    
        const { data } = await compilateurService.executePipeline(id, scriptToFileMap);

        setOutput(data);
      } catch (error) {
        setOutput("Erreur lors de l'exécution : " + (error.response?.data?.message || error.message));
      }
    };
  
    const Save = async () => {
      console.log("inputFiles = ",inputFiles , "outputFiles", outputFiles)
      try {

        const scriptDTO = {
          name: nameFile,             
          protectionLevel: "PRIVATE",
          language: "Python",
          inputFileExtensions: inputFiles,
          outputFileNames: outputFiles
        };

        await compilateurService.updateScript(id, source, scriptDTO); 

      } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Erreur', detail: "La sauvegarde a échoué !" });
        setOutput("Erreur lors de la sauvegarde : " + (error.response?.data?.message || error.message));
      }
    };

    // ======= SHAR PART ======= //

  
    // Open and close modal
    const openModal = () => setIsModalOpen(true);
  
    const [isUploadDialogVisible, setUploadDialogVisible] = useState(false);
  
    const Share = async () => {
      try {
        setUploadDialogVisible(true);
      } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Erreur', detail: "Erreur lors de l'ouverture de la boîte de dialogue de partage." });
      }
    };

    const onFileUpload = async (event) => {
      try {
        const file = event.files[0];
        const response = await compilateurService.uploadFile(new Blob([file], { type: 'text/plain' }), file.name);
        setFileId(response.data.id);
  
        setInputFiles(response.data.name);
        setOutputFiles(response.data.id);
  
        toast.current.show({ severity: 'success', summary: 'Succès', detail: 'Fichier partagé et sauvegardé avec succès!' });
        setUploadDialogVisible(false);
      } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Erreur', detail: "Erreur lors du partage du fichier." });
      }
    };

    useEffect(() =>{
      Save();
    },[inputFiles,outputFiles])

    useEffect(() => {
      if (scriptContent) {
        setSource(scriptContent);
      }
      console.log("scriptContent = ",scriptContent)
      console.log("source = ",source);
    }, [scriptContent]);


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
                
          
                <Button label="Share file" icon="pi pi-share-alt" onClick={Share} className="p-button-outlined" />
                  

                <Dialog
                  header="Partager un fichier"
                  visible={isUploadDialogVisible}
                  style={{ width: '30vw' }}
                  onHide={() => setUploadDialogVisible(false)}
                >
                  <FileUpload
                    mode="basic"
                    name="file"
                    accept=".txt"
                    maxFileSize={1000000} 
                    customUpload
                    uploadHandler={onFileUpload}
                    chooseLabel="Sélectionner un fichier"
                  />
                </Dialog>
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
