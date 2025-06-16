import   { useState, useEffect, useRef, useCallback } from 'react'; 

interface WebSocketHook {
  lastMessage: MessageEvent | null;
  sendMessage: (data: any) => void;
  isConnected: boolean;
}

export function useWebSocket(url: string | null): WebSocketHook {
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

   useEffect(() => {
    if (!url) {
      return;
    }

    // Clean up previous connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    // For Socket.IO connection, use io library in production
    // For now, simulate WebSocket connection
    const connectToSocket = () => {
      try {
        // In development, simulate socket connection
        const mockSocket = {
          readyState: 1, // OPEN
          send: (data: string) => {
            console.log('Mock socket send:', data);
          },
          close: () => {
            setIsConnected(false);
          }
        };
        
        wsRef.current = mockSocket as any;
        setIsConnected(true);
        console.log('Mock WebSocket connected');
        
        // Simulate periodic messages for demo
        const interval = setInterval(() => {
          if (wsRef.current) {
            const mockEvent = {
              data: JSON.stringify({
                type: 'playerCount',
                count: Math.floor(Math.random() * 50) + 20
              })
            } as MessageEvent;
            setLastMessage(mockEvent);
          }
        }, 10000);
        
        return () => {
          clearInterval(interval);
          if (wsRef.current) {
            wsRef.current.close();
          }
        };
      } catch (error) {
        console.error('WebSocket connection error:', error);
        setIsConnected(false);
      }
    };

    const cleanup = connectToSocket();

    return () => {
      if (cleanup) cleanup();
    };
  }, [url]); 

  const sendMessage = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.error('WebSocket not connected');
    }
  }, []);

  return { lastMessage, sendMessage, isConnected };
}

export  function useGameWebSocket(gameId: string | null) {
  const wsUrl = gameId ? `ws://localhost:5000/socket.io/?EIO=4&transport=websocket` : null;
  
  const { lastMessage, sendMessage, isConnected } = useWebSocket(wsUrl);
  
  // Send join game message when connected
  useEffect(() => {
    if (isConnected && gameId) {
      sendMessage({ type: 'joinGame', gameId });
    }
  }, [isConnected, gameId, sendMessage]);
  
  return { lastMessage, sendMessage, isConnected };
} 

export  function useLobbyWebSocket() {
  const wsUrl = `ws://localhost:5000/socket.io/?EIO=4&transport=websocket`;
  
  const { lastMessage, sendMessage, isConnected } = useWebSocket(wsUrl);
  
  // Send join lobby message when connected
  useEffect(() => {
    if (isConnected) {
      sendMessage({ type: 'joinLobby' });
    }
  }, [isConnected, sendMessage]);
  
  return { lastMessage, sendMessage, isConnected };
} 
 