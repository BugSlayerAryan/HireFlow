import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "react-toastify";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api").replace(/\/+$/, "");
const WS_BASE_URL = API_BASE_URL.endsWith("/api") ? API_BASE_URL.slice(0, -4) : API_BASE_URL;

const useWebSocket = (userEmail) => {
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return undefined;

        const stompClient = new Client({
            webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws-hireflow`),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            debug: () => {},
            onConnect: () => {
                console.info("HireFlow notifications connected");

                stompClient.subscribe("/user/queue/notifications", (message) => {
                    try {
                        const notification = JSON.parse(message.body);
                        toast.info(
                            <div>
                                <div className="fw-bold">{notification.title}</div>
                                <div className="small">{notification.message}</div>
                            </div>,
                            { icon: "🚀", theme: "dark" }
                        );
                    } catch (error) {
                        console.warn("Unable to read notification", error);
                    }
                });

                stompClient.subscribe("/topic/jobs", (message) => {
                    try {
                        const notification = JSON.parse(message.body);
                        toast.success(notification.message || notification.title || "Job update received");
                    } catch (error) {
                        console.warn("Unable to read job notification", error);
                    }
                });

                stompClient.subscribe("/topic/global", (message) => {
                    try {
                        const notification = JSON.parse(message.body);
                        toast.info(notification.message || notification.title || "HireFlow update received");
                    } catch (error) {
                        console.warn("Unable to read global notification", error);
                    }
                });
            },
            onStompError: (frame) => {
                console.warn("Notification broker error:", frame.headers?.message || frame.body);
            },
            onWebSocketError: (error) => {
                console.warn("Notification connection unavailable:", error);
            },
        });

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, [userEmail]);
};

export default useWebSocket;
