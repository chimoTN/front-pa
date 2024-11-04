import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Modal, Button, Spinner } from 'react-bootstrap';
import axios from "./context/axios_token";
import './style/PipelineStatus.css';

const PipelineStatus = () => {
    const { id } = useParams();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [fileContent, setFileContent] = useState(null);
    const [fileType, setFileType] = useState(null);
    const [selectedFile, setSelectedFile] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/pipelines/${id}/jobs`);
                console.log(response.data);

                const initialJobs = response.data.map((job, index, arr) => {
                    const isPending = job.status === 'PENDING';
                    const isFirstJob = index === 0;
                    const previousCompleted = index > 0 && arr[index - 1].status === 'COMPLETED';

                    return {
                        id: job.id,
                        scriptName: job.script_name,
                        inputFile: job.inputFile,
                        outputFile: job.outputFile,
                        status: isPending && (isFirstJob || previousCompleted) ? 'RUNNING' : job.status,
                    };
                });

                setJobs(initialJobs);
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des jobs:', error);
            }
        };

        fetchJobs();
    }, [id]);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('Connected to WebSocket');
                client.subscribe(`/topic/jobStatus/${id}`, (message) => {
                    const jobStatusMessage = JSON.parse(message.body);
                    console.log('Job Status Update:', jobStatusMessage);
                    updateJobStatus(jobStatusMessage);
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            }
        });

        client.activate();

        return () => {
            client.deactivate();
        };
    }, [id]);

    const updateJobStatus = (statusUpdate) => {
        setJobs((prevJobs) =>
            prevJobs.map(job => {
                if (job.id === statusUpdate.jobId) {
                    return { ...job, status: statusUpdate.status };
                }
                return job;
            })
        );
    };

    const handleFileClick = async (jobId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/pipelines/output/${jobId}`, {
                responseType: 'blob'
            });
            console.log(response.data)

            const contentType = response.headers['content-type'];
            const blob = new Blob([response.data], { type: contentType });

            if (contentType.startsWith('image')) {
                setFileContent(URL.createObjectURL(blob));
                setFileType('image');
            } else if (contentType.startsWith('text')) {
                const textContent = await blob.text();
                setFileContent(textContent);
                setFileType('text');
            } else {
                console.error("Type de fichier non pris en charge :", contentType);
                return;
            }

            setSelectedFile(`Job ${jobId} Output`);
            setShowModal(true);

        } catch (error) {
            console.error('Erreur lors de la récupération du fichier:', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFileContent(null);
        setFileType(null);
        if (fileType === 'image') URL.revokeObjectURL(fileContent);
    };

    return (
        <div className="pipeline-container container mt-5">
            <h2 className="text-center">Pipeline Execution Status - ID {id}</h2>
            {loading ? (
                <div className="d-flex justify-content-center mt-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <div className="pipeline">
                    {jobs.map((job, index) => (
                        <div key={job.id} className={`job-card ${job.status.toLowerCase()}`}>
                            <span className="job-status-icon">
                                {job.status === 'PENDING' && <i className="fas fa-hourglass-half"></i>}
                                {job.status === 'RUNNING' && <Spinner animation="border" size="sm" />}
                                {job.status === 'COMPLETED' && <i className="fas fa-check-circle"></i>}
                            </span>
                            <div className="job-content">
                                <h5>{job.scriptName}</h5>
                                <p><strong>Input File:</strong> {job.inputFile}</p>
                                <p><strong>Output File:</strong> {job.outputFile}</p>
                                <p>Status: <strong>{job.status}</strong></p>
                                {job.status === 'COMPLETED' && (
                                    <button className="btn btn-outline-primary btn-sm" onClick={() => handleFileClick(job.id)}>View Output</button>
                                )}
                            </div>
                            {index < jobs.length - 1 && <div className="job-arrow"><i className="fas fa-arrow-down"></i></div>}
                        </div>
                    ))}
                </div>
            )}

            <Modal show={showModal} onHide={handleCloseModal} dialogClassName="modal-dialog-centered">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedFile}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {fileType === 'image' ? (
                        <img src={fileContent} alt="Job Output" className="img-fluid" />
                    ) : (
                        <pre>{fileContent}</pre>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PipelineStatus;
