import React, { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useParams } from 'react-router-dom';
import config from './config';

const JobStatusWebSocket = () => {
    const { id } = useParams();

    useEffect(() => {
        const socket = new SockJS(`${config.URL_WEBSOCKET}`);
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('Connected to WebSocket');
                client.subscribe(`/topic/jobStatus/${id}`, (message) => {
                    const jobStatusMessage = JSON.parse(message.body);
                    console.log('Job Status Update:', jobStatusMessage);
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

    return <div>Listening for job status updates for pipeline {id}...</div>;
};

export default JobStatusWebSocket;
