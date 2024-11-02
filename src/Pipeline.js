// src/components/Pipeline.js
import React, { useState } from 'react';
import './style/Pipeline.css';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';

const Pipeline = () => {
    const [scripts, setScripts] = useState([]);

    const addScript = () => {
        const newScript = {
            id: scripts.length + 1,
            name: `Script ${scripts.length + 1}`,
            inputFile: `Input ${scripts.length + 1}`,
            outputFile: `Output ${scripts.length + 1}`
        };
        setScripts([...scripts, newScript]);
    };

    const removeScript = (id) => {
        const updatedScripts = scripts.filter(script => script.id !== id);
        setScripts(updatedScripts);
    };

    const handleStartPipeline = () => {
        alert('Pipeline démarrée');
    };

    return (
        <Container className="pipeline-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button className="btn-add-script" onClick={addScript}>
                    Ajouter un Script
                </button>

                {scripts.length > 0 && (
                    <Button className="btn-add-script" variant="success" size="lg" onClick={handleStartPipeline}>
                        Démarrer la Pipeline
                    </Button>
                )}
            </div>

            <Row className="pipeline-flow justify-content-center">
                {scripts.map((script, index) => (
                    <React.Fragment key={script.id}>
                        <Col xs="auto" className="mb-3 d-flex align-items-center">
                            <Card className="script-item text-center">
                                <Card.Body className="d-flex flex-column align-items-center">
                                    <Card.Title>{script.name}</Card.Title>
                                    <Card.Text>Entrée : {script.inputFile}</Card.Text>
                                    <Card.Text>Sortie : {script.outputFile}</Card.Text>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => removeScript(script.id)}
                                    >
                                        Supprimer
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        {/* Affichage de la flèche uniquement entre les scripts */}
                        {index < scripts.length - 1 && (
                            <div className="arrow-container">
                                <div className="arrow">→</div>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </Row>
        </Container>
    );
};

export default Pipeline;

