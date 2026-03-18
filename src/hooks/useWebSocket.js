import { useEffect, useRef, useState } from 'react';
import { socketClient } from '../services/websocket/socketClient';

export function useWebSocket() {
    const [isConnected, setIsConnected] = useState(socketClient.isConnected);
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        
        socketClient.connect();

        const unsubs = [
            socketClient.subscribe('connect', () => {
                if (isMounted.current) setIsConnected(true);
            }),
            socketClient.subscribe('disconnect', () => {
                if (isMounted.current) setIsConnected(false);
            }),
            socketClient.subscribe('error', (err) => {
                console.error("WS Error:", err);
            })
        ];

        return () => {
            isMounted.current = false;
            unsubs.forEach(unsub => unsub());
            socketClient.disconnect();
        };
    }, []);

    const sendMessage = (type, payload) => {
        if (!isConnected) {
            console.warn("Cannot send message, WS disconnected.");
            return;
        }
        socketClient.send({ type, ...payload });
    };

    return {
        isConnected,
        sendMessage,
        subscribe: socketClient.subscribe.bind(socketClient),
    };
}
