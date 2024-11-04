import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from "./context/axios_token";
import './style/Pipelines.css';

const Pipelines = () => {
    const [pipelines, setPipelines] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [client, setClient] = useState(null);

    useEffect(() => {
        const fetchPipelines = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/pipelines");
                setPipelines(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors de la récupération des pipelines:", error);
            }
        };

        fetchPipelines();
    }, []);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('Connected to WebSocket');

                pipelines.forEach(pipeline => {
                    if (pipeline.status === "RUNNING") {
                        stompClient.subscribe(`/topic/pipelineStatus/${pipeline.id}`, (message) => {
                            const pipelineStatusMessage = JSON.parse(message.body);
                            console.log('Pipeline Status Update:', pipelineStatusMessage);
                            updatePipelineStatus(pipelineStatusMessage);
                        });
                    }
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            }
        });

        stompClient.activate();
        setClient(stompClient);

        return () => {
            stompClient.deactivate();
        };
    }, [pipelines]);

    const updatePipelineStatus = (statusUpdate) => {
        setPipelines((prevPipelines) =>
            prevPipelines.map(pipeline => {
                if (pipeline.id === statusUpdate.pipelineId) {
                    return { ...pipeline, status: statusUpdate.status };
                }
                return pipeline;
            })
        );
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "COMPLETED":
                return "completed";
            case "RUNNING":
                return "running";
            case "FAILED":
                return "failed";
            default:
                return "";
        }
    };

    const handleDetailsClick = (id) => {
        navigate(`/pipelineSocket/${id}`);
    };

    return (
        <div className="pipelines-container container mt-5">
            {loading ? (
                <div className="d-flex justify-content-center mt-5">
                    <span className="spinner-border text-primary"></span>
                </div>
            ) : (
                pipelines.map((pipeline) => (
                    <div
                        key={pipeline.id}
                        className={`pipeline-card ${getStatusClass(pipeline.status)}`}
                    >
                        <div className="pipeline-info">
                            <h5 className="pipeline-name">{pipeline.name}</h5>
                            <p className="pipeline-status">
                                Statut: <strong>{pipeline.status}</strong>
                                {pipeline.status === "RUNNING" && (
                                    <span className="loading-spinner spinner-border spinner-border-sm text-warning ms-2"></span>
                                )}
                            </p>
                        </div>
                        <button
                            className="btn btn-outline-primary btn-sm details-button"
                            onClick={() => handleDetailsClick(pipeline.id)}
                        >
                            Détails
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default Pipelines;
