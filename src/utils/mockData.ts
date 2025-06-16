import  { Game, Card, Player } from '../types';

// Create a mock deck for testing
export function createMockDeck(): Card[] {
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', 'J', 'Q', 'K'];
  const deck: Card[] = [];
  
  for (const suit of suits) {
    for (const rank of ranks) {
      let value = 0;
      
      if (rank === 'A') value = 1;
      else if (rank === 'J') value = 10;
      else if (rank === 'Q') value = 10;
      else if (rank === 'K') value = 10;
      else value = parseInt(rank);
      
      deck.push({
        id: `${rank}-${suit}`,
        suit,
        rank,
        value,
        isHidden: true
      });
    }
  }
  
  // Shuffle the deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  
  return deck;
}

// Create a mock game for testing
export function createMockGame(stake: number): Game {
  // Create a new deck
  const deck = createMockDeck();
  
  // Create AI players
  const aiPlayers: Player[] = [];
  for (let i = 0; i < 3; i++) {
    aiPlayers.push({
      id: `ai-${i + 1}`,
      username: `AI Player ${i + 1}`,
      avatar: `https://ui-avatars.com/api/?name=AI&background=777777&color=fff`,
      hand: [],
      isDropped: false,
      canDrop: true,
      score: 0,
      penalties: 0,
      isAI: true
    });
  }
  
  // Create user player
  const userPlayer: Player = {
    id: 'user-1',
    username: 'You',
    avatar: 'https://ui-avatars.com/api/?name=You&background=0D8ABC&color=fff',
    hand: [],
    isDropped: false,
    canDrop: true,
    score: 0,
    penalties: 0,
    isAI: false
  };
  
  // Deal cards to players
  const players = [userPlayer, ...aiPlayers];
  for (const player of players) {
    player.hand = deck.splice(0, 5);
    
    // Only show the user's cards
    if (!player.isAI) {
      player.hand.forEach(card => { card.isHidden = false; });
    }
  }
  
  // Create discard pile with one card
  const discardPile = [{ ...deck.pop()!, isHidden: false }];
  
  // Create the game
  return {
    id: `game-${Date.now()}`,
    players,
    currentPlayerIndex: 0,
    deck,
    discardPile,
    status: 'playing',
    stake,
    pot: stake * 4,
    lastActionAt: Date.now()
  };
}
 