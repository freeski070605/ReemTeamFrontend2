//  User related types
export interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  avatar: string;
  gamesPlayed: number;
  gamesWon: number;
  createdAt: number;
}

// Card and game types
export interface Card {
  id: string;
  suit: string;
  rank: string;
  value: number;
  isHidden: boolean;
}

export interface Player {
  id: string;
  username: string;
  avatar: string;
  hand: Card[];
  isDropped: boolean;
  canDrop: boolean;
  score: number;
  penalties: number;
  isAI: boolean;
}

export interface Game {
  id: string;
  players: Player[];
  currentPlayerIndex: number;
  deck: Card[];
  discardPile: Card[];
  status: 'waiting' | 'playing' | 'ended';
  stake: number;
  pot: number;
  winner?: string;
  winningMultiplier?: number;
  lastActionAt: number;
}

// Table types
export  interface TableStake {
  _id?: string;
  id: string;
  tableId: string;
  amount: number;
  maxPlayers: number;
  currentPlayers: number;
  activeGames: string[];
  isActive?: boolean;
} 

// Withdrawal types
export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  cashAppTag: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  timestamp: number;
  processedAt?: number;
}
 