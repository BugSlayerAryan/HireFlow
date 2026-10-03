import { useEffect } from 'react';
import { toast } from 'react-toastify';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const useNotifications = (userEmail) => {
    useEffect(() => {
        if (!userEmail) return;

        const stompClient = Stomp.over(() => new SockJS('http://localhost:8081/ws-hireflow'));

        stompClient.connect({}, (frame) => {
            console.log('Connected to WebSocket: ' + frame);

            // Subscribe to private notifications
            stompClient.subscribe(`/user/${userEmail}/queue/notifications`, (notification) => {
                const data = JSON.parse(notification.body);
                toast.info(
                    <div>
                        <strong>{data.title}</strong>
                        <div>{data.message}</div>
                    </div>,
                    { icon: "🚀" }
                );
            });

            // Subscribe to global topics
            stompClient.subscribe('/topic/global', (notification) => {
                const data = JSON.parse(notification.body);
                toast.success(data.message);
            });
        });

        return () => {
            if (stompClient) stompClient.disconnect();
        };
    }, [userEmail]);
};

export default useNotifications;
