import useWebSocket from "./useWebSocketHook";

// Backward-compatible alias. Keep a single WebSocket implementation so the
// application never creates duplicate localhost/production connections.
export default function useNotifications(userEmail) {
    useWebSocket(userEmail);
}
