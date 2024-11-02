import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CompilateurService from '../services/compilateurService';
import { Modal } from 'react-bootstrap';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {atomDark} from "react-syntax-highlighter/src/styles/prism";

const SavedDevelopments = () => {
    const [scripts, setScripts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentScriptContent, setCurrentScriptContent] = useState('');
    const [currentScriptLanguage, setCurrentScriptLanguage] = useState('python');
    const navigate = useNavigate();

    const compilateurService = CompilateurService();

    useEffect(() => {
        Axios.get('http://localhost:8080/api/scripts')
            .then(response => {
                setScripts(response.data);
            })
            .catch(err => {
                console.error('Error fetching scripts:', err);
            });
    }, []);

    const handleRunScript = async (script) => {
        try {
            const response = await compilateurService.recupContent(script.id);
            const scriptContent = response.data;
            setCurrentScriptContent(scriptContent);
            setCurrentScriptLanguage(script.language.toLowerCase());
            setShowModal(true);
        } catch (error) {
            console.error("Erreur lors de la récupération du script:", error);
        }
    };

    const handleCloseModal = () => setShowModal(false);

    return (
        <div className="saved-developments">
            <h2>Mes Développements Sauvegardés</h2>
            <DataTable value={scripts} responsiveLayout="scroll">
                <Column field="name" header="Nom" />
                <Column field="language" header="Langage" />
                <Column
                    body={(rowData) => (
                        <Button
                            label="Ouvrir"
                            className="p-button-success"
                            onClick={() => handleRunScript(rowData)}
                        />
                    )}
                    header="Actions"
                />
            </DataTable>

            <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Contenu du Script</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#2d2d2d', color: '#ffffff', maxHeight: '500px', overflowY: 'auto' }}>
                    <SyntaxHighlighter language={currentScriptLanguage} style={atomDark}>
                        {currentScriptContent}
                    </SyntaxHighlighter>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SavedDevelopments;
