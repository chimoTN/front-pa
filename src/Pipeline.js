import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Button, Card, Container, Row, Col, Modal } from 'react-bootstrap';
import axios from "./context/axios_token";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CompilateurService from './services/compilateurService';
import {useNavigate} from "react-router-dom";

const ItemTypes = {
    SCRIPT: 'script',
};

const ScriptItem = ({ script, onOpen }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.SCRIPT,
        item: { script },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div ref={drag} className="available-script" style={{ opacity: isDragging ? 0.5 : 1, marginBottom: '10px' }}>
            <Card className="script-item text-center">
                <Card.Body>
                    <Card.Title>{script.name}</Card.Title>
                    <Button variant="info" size="sm" onClick={() => onOpen(script)}>
                        Ouvrir
                    </Button>
                </Card.Body>
            </Card>
        </div>
    );
};

const Pipeline = () => {
    const [availableScripts, setAvailableScripts] = useState([]);
    const [pipelineScripts, setPipelineScripts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentScriptContent, setCurrentScriptContent] = useState('');
    const [currentScriptLanguage, setCurrentScriptLanguage] = useState('python');
    const [initialInputFile, setInitialInputFile] = useState(null);

    const [nextId, setNextId] = useState(1);

    const compilateurService = CompilateurService();
    const navigate = useNavigate();


    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/scripts/private`)
            .then(response => {
                setAvailableScripts(response.data);
            })
            .catch(err => {
                console.error('Erreur lors de la récupération des scripts :', err);
            });
    }, []);


/*
    useEffect(() => {
        axios.get(`http://localhost:8080/api/scripts/private`)
            .then(response => {
                setAvailableScripts(response.data);
            })
            .catch(err => {
                console.error('Erreur lors de la récupération des scripts :', err);
            });
    }, []);
*/


    const handleAddToPipeline = (script) => {
        setNextId((prevId) => {
            const newId = prevId + 1;
            setPipelineScripts((prevScripts) => {
                const newPipelineScript = { id: newId, script: script };
                console.log(prevScripts);
                return [...prevScripts, newPipelineScript];
            });
            return newId;
        });
        /*
        setNextId((prevId) => {
            const newId = prevId + 1;
            setPipelineScripts((prevScripts) => {
                const newScript = { ...script, id: newId };
                console.log(prevScripts);
                return [...prevScripts, newScript];
            });
            return newId;
        });

         */
    };

    const handleRemoveFromPipeline = (id) => {
        setPipelineScripts((prev) => prev.filter((s) => s.id !== id));
    };

    const handleOpenModal = async (script) => {
        try {
            const response = await compilateurService.recupContent(script.id);
            setCurrentScriptContent(response.data);
            setCurrentScriptLanguage(script.language.toLowerCase());
            setShowModal(true);
        } catch (error) {
            console.error("Erreur lors de la récupération du contenu du script :", error);
        }
    };

    const handleCloseModal = () => setShowModal(false);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.SCRIPT,
        drop: (item) => handleAddToPipeline(item.script),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setInitialInputFile(file);
    };

    const handleStartPipeline = async () => {
        if (!initialInputFile) {
            alert("Veuillez sélectionner un fichier d'entrée.");
            return;
        }

        const formData = new FormData();
        formData.append('initialInputFile', initialInputFile);


        console.log("ajout dans form data")
        pipelineScripts.forEach(s => {
            console.log("script id : " + s.script.id)
            formData.append('scriptIds[]', s.script.id);
        });


        try {

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/pipelines`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            /*const response = await axios.post(`http://localhost:8080/api/pipelines`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });*/
            console.log('Réponse du serveur:', response.data);
            alert('Pipeline démarrée avec succès !');
            const pipelineId = response.data.id;
            navigate(`/pipelineSocket/${pipelineId}`);
        } catch (error) {
            console.error('Erreur lors du démarrage de la pipeline :', error.response ? error.response.data : error.message);
            alert('Erreur lors du démarrage de la pipeline : ' + (error.response ? error.response.data : error.message));
        }
    };


    return (
        <Container fluid className="d-flex">
            <Col md={3} className="available-scripts-container me-3">
                <input type="file" onChange={handleFileChange} />
                <div
                    className="available-scripts-list"
                    style={{
                        maxHeight: 'calc(100vh - 100px)',
                        overflowY: 'auto',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px'
                    }}
                >
                    {availableScripts.map((script) => (
                        <ScriptItem key={script.id} script={script} onOpen={handleOpenModal} />
                    ))}
                </div>
            </Col>

            <Col md={9} className="pipeline-container">
                <div style={{display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
                    {pipelineScripts.length > 0 && (
                        <Button className="mt-3 mb-3" variant="success" size="lg" onClick={handleStartPipeline}>
                            Démarrer la Pipeline
                        </Button>
                    )}
                </div>

                <Row className="pipeline-flow justify-content-center" ref={drop}
                     style={{backgroundColor: "white", padding: '20px', minHeight: '300px'}}>
                    {pipelineScripts.map((s, index) => (
                        <Col key={index} xs="auto" className="mb-3 d-flex align-items-center">
                            <Card className="script-item text-center">
                                <Card.Body className="d-flex flex-column align-items-center">
                                    <Card.Title>{s.script.name}</Card.Title>
                                    <Button className="mb-3 mt-2" variant="info" size="sm" onClick={() => handleOpenModal(s.script)}>
                                        Ouvrir
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleRemoveFromPipeline(s.id)}
                                    >
                                        Supprimer
                                    </Button>
                                </Card.Body>
                            </Card>
                            {index < pipelineScripts.length - 1 && <div className="arrow">→</div>}
                        </Col>
                    ))}
                </Row>
            </Col>

            <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Contenu du Script</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#1e1e1e', color: '#ffffff', maxHeight: '500px', overflowY: 'auto' }}>
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
        </Container>
    );
};

export default Pipeline;
