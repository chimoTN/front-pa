import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button, Card, Container, Row, Col, Modal } from 'react-bootstrap';
import Axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CompilateurService from './services/compilateurService';

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

    const compilateurService = CompilateurService();

    useEffect(() => {
        Axios.get('http://localhost:8080/api/scripts')
            .then(response => {
                setAvailableScripts(response.data);
            })
            .catch(err => {
                console.error('Erreur lors de la récupération des scripts :', err);
            });
    }, []);

    const handleAddToPipeline = (script) => {
        setPipelineScripts((prev) => [...prev, script]);
    };

    const handleRemoveFromPipeline = (id) => {
        setPipelineScripts((prev) => prev.filter((script) => script.id !== id));
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

    return (
        <Container fluid className="d-flex">

            <Col md={3} className="available-scripts-container me-3">
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
                        <Button className="mt-3 mb-3" variant="success" size="lg" onClick={() => alert('Pipeline démarrée')}>
                            Démarrer la Pipeline
                        </Button>
                    )}
                </div>

                <Row className="pipeline-flow justify-content-center" ref={drop}
                     style={{backgroundColor: "white", padding: '20px', minHeight: '300px'}}>
                    {pipelineScripts.map((script, index) => (
                        <Col key={index} xs="auto" className="mb-3 d-flex align-items-center">
                            <Card className="script-item text-center">
                                <Card.Body className="d-flex flex-column align-items-center">
                                    <Card.Title>{script.name}</Card.Title>
                                    <Button className="mb-3 mt-2" variant="info" size="sm" onClick={() => handleOpenModal(script)}>
                                        Ouvrir
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleRemoveFromPipeline(script.id)}
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
