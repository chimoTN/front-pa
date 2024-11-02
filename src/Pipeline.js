import React, {useEffect, useState} from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import './style/Pipeline.css';
import Axios from "axios";

const ItemTypes = {
    SCRIPT: 'script',
};

const ScriptItem = ({ script }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.SCRIPT,
        item: { script },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div ref={drag} className="available-script" style={{ opacity: isDragging ? 0.5 : 1 }}>
            <Card className="script-item text-center">
                <Card.Body>
                    <Card.Title>{script.name}</Card.Title>
                </Card.Body>
            </Card>
        </div>
    );
};

const Pipeline = () => {
    const [availableScripts, setAvailableScripts] = useState([]);
    const [scripts, setScripts] = useState([]);
    const [nextId, setNextId] = useState(1);

    useEffect(() => {
        Axios.get('http://localhost:8080/api/scripts')
            .then(response => {
                setAvailableScripts(response.data);
                console.log(response.data);
            })
            .catch(err => {
                console.error('Error fetching scripts:', err);
            });
    }, []);

    const addScriptToPipeline = (script) => {

        setNextId((prevId) => {
            const newId = prevId + 1;
            setScripts((prevScripts) => {
                const newScript = { ...script, id: newId };
                return [...prevScripts, newScript];
            });
            return newId;
        });
    };

    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.SCRIPT,
        drop: (item) => addScriptToPipeline(item.script),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const removeScript = (id) => {
        setScripts((prevScripts) => prevScripts.filter((script) => script.id !== id));
    };

    return (
            <Container fluid className="d-flex">
                <Col md={3} className="available-scripts-container">
                    <h4>Scripts Disponibles</h4>
                    <div className="available-scripts-list">
                        {['Script 1', 'Script 2', 'Script 3'].map((name, index) => (
                            <ScriptItem key={index} script={{ name, inputFile: `Input ${index + 1}`, outputFile: `Output ${index + 1}` }} />
                        ))}
                    </div>
                </Col>

                <Col md={9} className="pipeline-container">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        {scripts.length > 0 && (
                            <Button variant="success" size="lg" onClick={() => alert('Pipeline démarrée')}>
                                Démarrer la Pipeline
                            </Button>
                        )}
                    </div>

                    <Row className="pipeline-flow justify-content-center" ref={drop} style={{ backgroundColor: isOver ? '#e0e0e0' : '#f8f9fa', padding: '20px', minHeight: '300px' }}>
                        {scripts.map((script, index) => (
                            <Col key={index} xs="auto" className="mb-3 d-flex align-items-center">
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
                                <div className="arrow">→</div>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Container>
    );
};

export default Pipeline;
