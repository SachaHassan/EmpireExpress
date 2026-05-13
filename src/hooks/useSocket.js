import { useEffect, useRef, useCallback, useState } from 'react';
import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || (import.meta.env.PROD ? '' : 'http://localhost:3001');

// Singleton socket - shared across all components
let sharedSocket = null;

function getSocket() {
  if (!sharedSocket) {
    sharedSocket = io(SERVER_URL, { transports: ['websocket', 'polling'] });
  }
  return sharedSocket;
}

export function useSocket() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // If already connected, set immediately
    if (socket.connected) setConnected(true);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  const emit = useCallback((event, data) => {
    return new Promise((resolve) => {
      const socket = getSocket();
      socket.emit(event, data, (response) => resolve(response));
    });
  }, []);

  const on = useCallback((event, handler) => {
    const socket = getSocket();
    socket.on(event, handler);
    return () => socket.off(event, handler);
  }, []);

  return { emit, on, connected };
}
