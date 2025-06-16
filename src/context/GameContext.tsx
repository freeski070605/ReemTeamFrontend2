import  { createContext, useState, useContext, ReactNode } from 'react';
import { Game } from '../types';
import { createGame as apiCreateGame, fetchGame as apiFetchGame, joinGame as apiJoinGame, performGameAction } from '../api/gameApi';

interface GameContextType {
  game: Game | null;
  isLoading: boolean;
  error: string | null;
  createGame: (userId: string, stake: number) => Promise<Game>;
  joinGame: (gameId: string, userId: string) => Promise<Game>;
  fetchGame: (gameId: string) => Promise<Game>;
  performAction: (gameId: string, userId: string, action: string, cardId?: string) => Promise<Game>;
}

const GameContext = createContext<GameContextType>({
  game: null,
  isLoading: false,
  error: null,
  createGame: async () => ({ id: '', players: [], currentPlayerIndex: 0, deck: [], discardPile: [], status: 'waiting', stake: 0, pot: 0, lastActionAt: 0 }),
  joinGame: async () => ({ id: '', players: [], currentPlayerIndex: 0, deck: [], discardPile: [], status: 'waiting', stake: 0, pot: 0, lastActionAt: 0 }),
  fetchGame: async () => ({ id: '', players: [], currentPlayerIndex: 0, deck: [], discardPile: [], status: 'waiting', stake: 0, pot: 0, lastActionAt: 0 }),
   performAction: async () => ({ id: '', players: [], currentPlayerIndex: 0, deck: [], discardPile: [], status: 'waiting', stake: 0, pot: 0, lastActionAt: 0 }), 
});

export function useGame() {
  return useContext(GameContext);
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createGame = async (userId: string, stake: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newGame = await apiCreateGame(userId, stake);
      setGame(newGame);
      return newGame;
    } catch (error) {
      setError((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const joinGame = async (gameId: string, userId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const joinedGame = await apiJoinGame(gameId, userId);
      setGame(joinedGame);
      return joinedGame;
    } catch (error) {
      setError((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGame = async (gameId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedGame = await apiFetchGame(gameId);
      setGame(fetchedGame);
      return fetchedGame;
    } catch (error) {
      setError((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

   const performAction = async (gameId: string, userId: string, action: string, cardId?: string, source?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedGame = await performGameAction(gameId, userId, action, cardId, source);
      setGame(updatedGame);
      return updatedGame;
    } catch (error) {
      setError((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }; 

  const value = {
    game,
    isLoading,
    error,
    createGame,
    joinGame,
    fetchGame,
    performAction,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}
 