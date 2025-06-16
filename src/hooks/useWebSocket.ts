import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketHook {
  socket: Socket | null;
  lastMessage: any;
  sendMessage: (event: string, data: any) => void;
  isConnected: boolean;
}

export function useSocketIO(url: string | null, authToken?: string): WebSocketHook {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!url) return;

    const newSocket = io(url, {
      auth: {
        token: authToken
      },
      transports: ['websocket']
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('✅ Socket.IO connected:', newSocket.id);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('❌ Socket.IO disconnected');
    });

    newSocket.onAny((event, data) => {
      setLastMessage({ event, data });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [url, authToken]);

  const sendMessage = useCallback((event: string, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('Socket not connected');
    }
  }, []);

  return { socket, lastMessage, sendMessage, isConnected };
}


export function useGameSocket(gameId: string | null, token: string) {
  const { socket, lastMessage, sendMessage, isConnected } = useSocketIO(
    'https://reemteamserver.onrender.com',
    token
  );

  useEffect(() => {
    if (isConnected && gameId) {
      sendMessage('joinGame', gameId);
    }
  }, [isConnected, gameId, sendMessage]);

  return { socket, lastMessage, sendMessage, isConnected };
}



export function useLobbyWebSocket(token: string) {
  const { socket, lastMessage, sendMessage, isConnected } = useSocketIO(
    'https://reemteamserver.onrender.com', // or your env var
    token
  );

  useEffect(() => {
    if (isConnected) {
      sendMessage('joinLobby', {});
    }
  }, [isConnected, sendMessage]);

  return { socket, lastMessage, sendMessage, isConnected };
}

 
