import  { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { useParams } from 'react-router-dom';
import { Card, Player } from '../types';
import PlayingCard from './PlayingCard';
import { Users, Clock, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';

export default function GameBoard() {
  const { gameId } = useParams<{ gameId: string }>();
  const { user } = useAuth();
  const { game, performAction, isLoading } = useGame();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Get current player
  const currentPlayer = game?.players.find(p => p.id === user?.id);
  const isCurrentTurn = game && currentPlayer && game.players[game.currentPlayerIndex]?.id === user?.id;
  const hasDrawn = currentPlayer?.hasDrawn || false;

  // Handle card selection
  const handleCardClick = useCallback((card: Card) => {
    if (!isCurrentTurn || hasDrawn) return;
    setSelectedCard(selectedCard === card.id ? null : card.id);
  }, [isCurrentTurn, hasDrawn, selectedCard]);

  // Handle draw from deck
  const handleDrawFromDeck = useCallback(async () => {
    if (!gameId || !user || !isCurrentTurn || hasDrawn) return;
    
    setActionLoading('draw-deck');
    setError(null);
    
    try {
      await performAction(gameId, user.id, 'draw', undefined, 'deck');
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setActionLoading(null);
    }
  }, [gameId, user, isCurrentTurn, hasDrawn, performAction]);

  // Handle draw from discard
  const handleDrawFromDiscard = useCallback(async () => {
    if (!gameId || !user || !isCurrentTurn || hasDrawn || !game?.discardPile?.length) return;
    
    setActionLoading('draw-discard');
    setError(null);
    
    try {
      await performAction(gameId, user.id, 'draw', undefined, 'discard');
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setActionLoading(null);
    }
  }, [gameId, user, isCurrentTurn, hasDrawn, game?.discardPile, performAction]);

  // Handle discard
  const handleDiscard = useCallback(async () => {
    if (!gameId || !user || !selectedCard || !hasDrawn) return;
    
    setActionLoading('discard');
    setError(null);
    
    try {
      await performAction(gameId, user.id, 'discard', selectedCard);
      setSelectedCard(null);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setActionLoading(null);
    }
  }, [gameId, user, selectedCard, hasDrawn, performAction]);

  // Handle drop
  const handleDrop = useCallback(async () => {
    if (!gameId || !user || !currentPlayer?.canDrop) return;
    
    setActionLoading('drop');
    setError(null);
    
    try {
      await performAction(gameId, user.id, 'drop');
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setActionLoading(null);
    }
  }, [gameId, user, currentPlayer?.canDrop, performAction]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!game) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-400">Loading game...</div>
        </div>
      </div>
    );
  }

  const renderPlayer = (player: Player, position: 'top' | 'left' | 'right' | 'bottom') => {
    const isCurrentPlayer = player.id === user?.id;
    const isActivePlayer = game.players[game.currentPlayerIndex]?.id === player.id;
    
    const positionClasses = {
      top: 'absolute top-4 inset-x-0 flex justify-center',
      left: 'absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center',
      right: 'absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center',
      bottom: 'absolute bottom-4 inset-x-0 flex justify-center'
    };

    return (
      <div className={positionClasses[position]}>
        <div className={`bg-gray-800 rounded-lg p-3 min-w-48 ${isActivePlayer ? 'ring-2 ring-primary-500' : ''}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <img 
                src={player.avatar} 
                alt={player.username}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="font-medium text-sm">{player.username}</div>
                <div className="text-xs text-gray-400">Score: {player.score}</div>
              </div>
            </div>
            {isActivePlayer && (
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </div>
          
          {player.isDropped ? (
            <div className="text-center py-2">
              <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-1" />
              <div className="text-xs text-green-400">Dropped</div>
            </div>
          ) : (
            <div className="flex gap-1 justify-center">
              {player.hand.map((card, index) => (
                <div key={card.id || index} className="w-8 h-12 relative">
                  {isCurrentPlayer ? (
                    <PlayingCard
                      card={card}
                      onClick={() => handleCardClick(card)}
                      selected={selectedCard === card.id}
                      className="w-full h-full text-xs"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-900 border border-blue-700 rounded-sm flex items-center justify-center">
                      <div className="text-white text-xs">?</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {player.penalties > 0 && (
            <div className="text-xs text-red-400 text-center mt-1">
              Penalty: {player.penalties} turns
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-green-800 to-green-900 rounded-lg overflow-hidden">
      {/* Game Status Bar */}
      <div className="absolute top-0 left-0 right-0 bg-gray-900/80 p-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">Pot: ${game.pot}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-sm">
              {game.players.filter(p => !p.isDropped).length}/{game.players.length} active
            </span>
          </div>
        </div>
        
        <div className="text-sm text-gray-300">
          {game.status === 'playing' ? 'Game in Progress' : 'Waiting for Players'}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-16 left-4 right-4 bg-red-900/90 border border-red-700 rounded-lg p-3 flex items-center gap-2 z-10">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div className="text-red-300 text-sm">{error}</div>
        </div>
      )}

      {/* Players */}
      {game.players.map((player, index) => {
        const positions = ['bottom', 'left', 'top', 'right'];
        const position = positions[index] as 'top' | 'left' | 'right' | 'bottom';
        return renderPlayer(player, position);
      })}

      {/* Center Area - Deck and Discard */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center gap-8">
          {/* Deck */}
          <div className="text-center">
            <button
              onClick={handleDrawFromDeck}
              disabled={!isCurrentTurn || hasDrawn || actionLoading === 'draw-deck'}
              className={`w-20 h-28 rounded-lg border-2 transition-all ${
                isCurrentTurn && !hasDrawn
                  ? 'bg-blue-900 border-blue-600 hover:bg-blue-800 cursor-pointer'
                  : 'bg-gray-700 border-gray-600 cursor-not-allowed opacity-50'
              }`}
            >
              {actionLoading === 'draw-deck' ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
              ) : (
                <div className="text-white text-sm">DECK</div>
              )}
            </button>
            <div className="text-xs text-gray-400 mt-1">{game.deck.length} cards</div>
          </div>

          {/* Discard Pile */}
          <div className="text-center">
            <button
              onClick={handleDrawFromDiscard}
              disabled={!isCurrentTurn || hasDrawn || !game.discardPile.length || actionLoading === 'draw-discard'}
              className={`transition-all ${
                isCurrentTurn && !hasDrawn && game.discardPile.length
                  ? 'cursor-pointer hover:scale-105'
                  : 'cursor-not-allowed opacity-50'
              }`}
            >
              {game.discardPile.length > 0 ? (
                <PlayingCard 
                  card={game.discardPile[0]} 
                  className="w-20 h-28"
                />
              ) : (
                <div className="w-20 h-28 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center">
                  <div className="text-gray-500 text-xs">EMPTY</div>
                </div>
              )}
            </button>
            <div className="text-xs text-gray-400 mt-1">Discard</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isCurrentTurn && (
        <div className="absolute bottom20 left-1/2 transform -translate-x-1/2 flex gap-2">
          {hasDrawn && selectedCard && (
            <button
              onClick={handleDiscard}
              disabled={actionLoading === 'discard'}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {actionLoading === 'discard' ? 'Discarding...' : 'Discard'}
            </button>
          )}
          
          {currentPlayer?.canDrop && (
            <button
              onClick={handleDrop}
              disabled={actionLoading === 'drop'}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {actionLoading === 'drop' ? 'Dropping...' : `Drop (${currentPlayer.score})`}
            </button>
          )}
        </div>
      )}

      {/* Game Over Overlay */}
      {game.status === 'ended' && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-6 text-center max-w-sm">
            <h3 className="text-xl font-bold mb-4">Game Over!</h3>
            {game.winner && (
              <div className="mb-4">
                <div className="text-green-400 font-medium">
                  Winner: {game.players.find(p => p.id === game.winner)?.username}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  Prize: ${game.pot} {game.winningMultiplier && game.winningMultiplier > 1 && `(${game.winningMultiplier}x)`}
                </div>
              </div>
            )}
            <button
              onClick={() => window.location.href = '/lobby'}
              className="btn btn-primary"
            >
              Return to Lobby
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
 