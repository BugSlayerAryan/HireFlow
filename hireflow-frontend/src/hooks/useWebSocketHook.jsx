import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'react-toastify';

const useWebSocket = (userEmail) => {
    useEffect(() => {
        if (!userEmail) return;

        const socket = new SockJS('http://localhost:8081/ws-hireflow');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log('STOMP: ' + str),
            onConnect: (frame) => {
                console.log('Connected: ' + frame);

                // Subscribe to private notifications
                stompClient.subscribe(`/user/${userEmail}/queue/notifications`, (message) => {
                    const notification = JSON.parse(message.body);
                    toast.info(
                        <div>
                            <div className="fw-bold">{notification.title}</div>
                            <div className="small">{notification.message}</div>
                        </div>,
                        {
                            icon: "🚀",
                            theme: "dark"
                        }
                    );
                });

                // Subscribe to public topics (e.g., job updates)
                stompClient.subscribe('/topic/jobs', (message) => {
                    const notification = JSON.parse(message.body);
                    toast.success(notification.message);
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        stompClient.activate();

        return () => {
            if (stompClient) stompClient.deactivate();
        };
    }, [userEmail]);
};

export default useWebSocket;
