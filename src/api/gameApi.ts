import  { User, WithdrawalRequest, Game, TableStake } from '../types';

const   API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';  

// Helper to get auth headers
export function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'x-auth-token': token || ''
  };
}

// Auth API calls
export async function loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function registerUser(username: string, email: string, password: string): Promise<{ user: User; token: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function fetchCurrentUser(): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch user');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch user error:', error);
    throw error;
  }
}

export async function updateProfile(userData: Partial<User>): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/update`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update profile');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
}

// Game API calls
export async function fetchTables(): Promise<TableStake[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tables`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch tables');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch tables error:', error);
    throw error;
  }
}

export async function fetchPlayerCount(): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tables/player-count`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch player count');
    }
    
    const data = await response.json();
    return data.count;
  } catch (error) {
    console.error('Fetch player count error:', error);
    throw error;
  }
}

export  async function createGame(userId: string, stake: number): Promise<Game> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/games`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ stake })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create game');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Create game error:', error);
    throw error;
  }
} 

export async function fetchGame(gameId: string): Promise<Game> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/games/${gameId}`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch game');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch game error:', error);
    throw error;
  }
}

export  async function joinGame(gameId: string, userId: string): Promise<Game> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/games/${gameId}/join`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({})
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to join game');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Join game error:', error);
    throw error;
  }
} 

export  async function performGameAction(gameId: string, userId: string, action: string, cardId?: string, source?: string): Promise<Game> {
  try {
    const body: any = { action };
    if (cardId) body.cardId = cardId;
    if (source) body.source = source;
    
    const response = await fetch(`${API_BASE_URL}/api/games/${gameId}/action`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to perform game action');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Perform game action error:', error);
    throw error;
  }
} 

// Withdrawal API calls
export  async function submitWithdrawal(userId: string, amount: number, cashAppTag: string): Promise<WithdrawalRequest> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/withdrawals`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ amount, cashAppTag })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit withdrawal');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Submit withdrawal error:', error);
    throw error;
  }
} 

export async function fetchWithdrawalHistory(userId: string): Promise<WithdrawalRequest[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/withdrawals/user/${userId}`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch withdrawal history');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch withdrawal history error:', error);
    throw error;
  }
}

// Mock functions for development
export async function getMockTables(): Promise<TableStake[]> {
  return [
    { id: 'table-1', tableId: 'table-1', amount: 1, maxPlayers: 4, currentPlayers: 2, activeGames: [] },
    { id: 'table-2', tableId: 'table-2', amount: 1, maxPlayers: 4, currentPlayers: 3, activeGames: [] },
    { id: 'table-3', tableId: 'table-3', amount: 5, maxPlayers: 4, currentPlayers: 1, activeGames: [] },
    { id: 'table-4', tableId: 'table-4', amount: 5, maxPlayers: 4, currentPlayers: 0, activeGames: [] },
    { id: 'table-5', tableId: 'table-5', amount: 10, maxPlayers: 4, currentPlayers: 4, activeGames: [] },
    { id: 'table-6', tableId: 'table-6', amount: 20, maxPlayers: 4, currentPlayers: 2, activeGames: [] },
    { id: 'table-7', tableId: 'table-7', amount: 50, maxPlayers: 4, currentPlayers: 1, activeGames: [] },
  ];
}

export async function getMockWithdrawalHistory(): Promise<WithdrawalRequest[]> {
  return [
    {
      id: 'w1',
      userId: 'user1',
      amount: 50,
      cashAppTag: '$user1',
      status: 'approved',
      timestamp: Date.now() - 1000000,
      processedAt: Date.now() - 950000
    },
    {
      id: 'w2',
      userId: 'user1',
      amount: 100,
      cashAppTag: '$user1',
      status: 'pending',
      timestamp: Date.now() - 500000
    },
    {
      id: 'w3',
      userId: 'user1',
      amount: 25,
      cashAppTag: '$user1',
      status: 'rejected',
      adminNotes: 'Insufficient balance',
      timestamp: Date.now() - 2000000,
      processedAt: Date.now() - 1900000
    }
  ];
}
 