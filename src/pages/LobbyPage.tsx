import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { useLobbyWebSocket } from '../hooks/useWebSocket';
import { fetchTables, fetchPlayerCount } from '../api/gameApi';
import { TableStake } from '../types';
import { Users, AlertCircle, Shield, Clock } from 'lucide-react';
import TableStakeCard from '../components/TableStakeCard';

export default function LobbyPage() {
  const { user } = useAuth();
  const { createGame } = useGame();
  const navigate = useNavigate();
  const [tables, setTables] = useState<TableStake[]>([]);
  const [playerCount, setPlayerCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');
  const { lastMessage, sendMessage, isConnected } = useLobbyWebSocket(token);

  // Fetch tables and player count on mount
  useEffect(() => {
  async function loadLobbyData() {
    setIsLoading(true);
    setError(null);
    
    try {
      const [fetchedTables, count] = await Promise.all([
        fetchTables(),
        fetchPlayerCount()
      ]);

      setTables(fetchedTables);
      setPlayerCount(count);

    } catch (error) {
      console.error('Error loading lobby data:', error);
      setError('Error loading lobby data');

      

    } finally {
      setIsLoading(false);
    }
  }

  loadLobbyData();
}, []);


  // Listen for WebSocket updates
  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data);
        
        if (data.type === 'playerCount') {
          setPlayerCount(data.count);
        } else if (data.type === 'tableUpdate') {
          setTables(tables => {
                     const updatedTables = [...tables];
            const index = updatedTables.findIndex(t => t.id === data.table.id);
            
            if (index !== -1) {
              updatedTables[index] = { ...updatedTables[index], ...data.table };
            } 
            
            return updatedTables;
          });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    }
  }, [lastMessage, tables]);

  // Join lobby on connect
  useEffect(() => {
    if (isConnected) {
      sendMessage({ type: 'joinLobby' });
    }
    
    return () => {
      if (isConnected) {
        sendMessage({ type: 'leaveLobby' });
      }
    };
  }, [isConnected, sendMessage]);

  const handleJoinTable = async (table: TableStake) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.balance < table.amount) {
      setError(`You need at least $${table.amount} to join this table`);
      return;
    }
    
    try {
        setIsLoading(true);
        const game = await createGame(user.id, table.amount);
        navigate(`/game/${game._id}`);
       
    } catch (error) {
      console.error('Error joining game:', error);
      setError('Error initializing game');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 rounded-lg" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1704213897535-500313098396?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxkYXJrJTIwYmx1ZSUyMGNhc2lubyUyMGdhbWluZyUyMHByb2ZpbGUlMjBpbnRlcmZhY2V8ZW58MHx8fHwxNzQ5ODIzNzYzfDA&ixlib=rb-4.1.0&fit=fillmax&h=500&w=800')" }}></div>
        
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center p-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 font-display text-white">Game Lobby</h1>
            <p className="text-gray-300">
              Join a table and start playing Tonk with other players
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 bg-gray-800/80 rounded-lg px-4 py-2 flex items-center">
            <Users className="text-primary-400 mr-2" />
            <span className="text-gray-300">
              <span className="font-semibold">{playerCount}</span> {playerCount === 1 ? 'player' : 'players'} online
            </span>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-900/30 border border-red-800 rounded-lg p-4 text-red-300 flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-6 animate-pulse">
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-6"></div>
              <div className="h-10 bg-gray-700 rounded"></div>
            </div>
          ))
        ) : (
          // Actual tables
          tables.map((table) => (
            <TableStakeCard 
              key={table.id}
              table={table}
              onJoin={() => handleJoinTable(table)}
              userBalance={user?.balance || 0}
              isLoading={isLoading}
            />
          ))
        )}
      </div>
      
      {tables.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Shield className="h-16 w-16 mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Tables Available</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            There are currently no game tables available. Please check back later.
          </p>
        </div>
      )}
      
      <div className="mt-12 bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">How to Play</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="text-primary-400 text-lg font-semibold mb-2">1. Select a Table</div>
            <p className="text-gray-300">
              Choose a table with your preferred stake amount. Make sure you have enough balance to join.
            </p>
          </div>
          
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="text-primary-400 text-lg font-semibold mb-2">2. Play Your Turn</div>
            <p className="text-gray-300">
              Draw cards, create spreads, and strategically discard to lower your hand value.
            </p>
          </div>
          
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="text-primary-400 text-lg font-semibold mb-2">3. Win the Pot</div>
            <p className="text-gray-300">
              Drop when your hand is low. The player with the lowest score wins the pot!
            </p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <a href="/rules" className="text-primary-400 hover:text-primary-300 font-medium">
            View Full Game Rules →
          </a>
        </div>
      </div>
      
      <div className="mt-8 bg-gray-800/80 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center text-gray-400">
          <Clock className="w-4 h-4 mr-2" />
          <span className="text-sm">Games typically last 5-10 minutes</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-400">Need help? </span>
          <a href="/support" className="text-primary-400 hover:text-primary-300">Contact support</a>
        </div>
      </div>
    </div>
  );
}
 
