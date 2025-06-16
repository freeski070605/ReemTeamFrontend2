const API_BASE_URL = 'https://reemteamserver.onrender.com';

// Helper to get auth headers
export function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'x-auth-token': token || ''
  };
}

// Auth API calls
export async function loginUser(username, password) {
  console.log('🔐 Logging in:', { username });
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    console.log('🔄 Login response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Login error response:', errorData);
      throw new Error(errorData.error || 'Login failed');
    }

    const data = await response.json();
    console.log('✅ Login success:', data);
    return data;
  } catch (error) {
    console.error('❗ Login exception:', error);
    throw error;
  }
}

export async function registerUser(username, email, password) {
  console.log('📬 Registering user:', { username, email });
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    console.log('🔄 Register response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Register error response:', errorData);
      throw new Error(errorData.error || 'Registration failed');
    }

    const data = await response.json();
    console.log('✅ Registration success:', data);
    return data;
  } catch (error) {
    console.error('❗ Register exception:', error);
    throw error;
  }
}

export async function fetchCurrentUser() {
  console.log('👤 Fetching current user');
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: getHeaders()
    });

    console.log('🔄 Current user response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Fetch user error response:', errorData);
      throw new Error(errorData.error || 'Failed to fetch user');
    }

    const data = await response.json();
    console.log('✅ Fetched user:', data);
    return data;
  } catch (error) {
    console.error('❗ Fetch user exception:', error);
    throw error;
  }
}

export async function updateProfile(userData) {
  console.log('🛠️ Updating profile with:', userData);
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/update`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });

    console.log('🔄 Update profile status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Update profile error:', errorData);
      throw new Error(errorData.error || 'Failed to update profile');
    }

    const data = await response.json();
    console.log('✅ Profile updated:', data);
    return data;
  } catch (error) {
    console.error('❗ Update profile exception:', error);
    throw error;
  }
}

export async function fetchTables() {
  console.log('📦 Fetching tables...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/tables`);

    console.log('🔄 Tables response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Fetch tables error:', errorData);
      throw new Error(errorData.error || 'Failed to fetch tables');
    }

    const data = await response.json();
    console.log('✅ Tables fetched:', data);
    return data;
  } catch (error) {
    console.error('❗ Fetch tables exception:', error);
    throw error;
  }
}

export async function fetchPlayerCount() {
  console.log('👥 Fetching player count...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/tables/player-count`);

    console.log('🔄 Player count status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Player count error:', errorData);
      throw new Error(errorData.error || 'Failed to fetch player count');
    }

    const data = await response.json();
    console.log('✅ Player count:', data.count);
    return data.count;
  } catch (error) {
    console.error('❗ Fetch player count exception:', error);
    throw error;
  }
}

export async function createGame(userId, stake) {
  console.log('🎮 Creating game for user:', userId, 'with stake:', stake);
  try {
    const response = await fetch(`${API_BASE_URL}/api/games`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ stake })
    });

    console.log('🔄 Create game response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Create game error:', errorData);
      throw new Error(errorData.error || 'Failed to create game');
    }

    const data = await response.json();
    console.log('✅ Game created:', data);
    return data;
  } catch (error) {
    console.error('❗ Create game exception:', error);
    throw error;
  }
}

export async function fetchGame(gameId) {
  console.log('📥 Fetching game:', gameId);
  try {
    const response = await fetch(`${API_BASE_URL}/api/games/${gameId}`, {
      headers: getHeaders()
    });

    console.log('🔄 Fetch game status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Fetch game error:', errorData);
      throw new Error(errorData.error || 'Failed to fetch game');
    }

    const data = await response.json();
    console.log('✅ Game data:', data);
    return data;
  } catch (error) {
    console.error('❗ Fetch game exception:', error);
    throw error;
  }
}

export async function joinGame(gameId, userId) {
  console.log('🧩 Joining game:', gameId, 'user:', userId);
  try {
    const response = await fetch(`${API_BASE_URL}/api/games/${gameId}/join`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({})
    });

    console.log('🔄 Join game status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Join game error:', errorData);
      throw new Error(errorData.error || 'Failed to join game');
    }

    const data = await response.json();
    console.log('✅ Joined game:', data);
    return data;
  } catch (error) {
    console.error('❗ Join game exception:', error);
    throw error;
  }
}

export async function performGameAction(gameId, userId, action, cardId, source) {
  console.log('🃏 Performing action:', { gameId, userId, action, cardId, source });
  try {
    const body = { action, ...(cardId && { cardId }), ...(source && { source }) };

    const response = await fetch(`${API_BASE_URL}/api/games/${gameId}/action`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });

    console.log('🔄 Game action status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Game action error:', errorData);
      throw new Error(errorData.error || 'Failed to perform game action');
    }

    const data = await response.json();
    console.log('✅ Action result:', data);
    return data;
  } catch (error) {
    console.error('❗ Game action exception:', error);
    throw error;
  }
}

// Withdrawal API calls
export async function submitWithdrawal(userId, amount, cashAppTag) {
  console.log('💸 Submitting withdrawal:', { userId, amount, cashAppTag });
  try {
    const response = await fetch(`${API_BASE_URL}/api/withdrawals`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ amount, cashAppTag })
    });

    console.log('🔄 Withdrawal status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Withdrawal error:', errorData);
      throw new Error(errorData.error || 'Failed to submit withdrawal');
    }

    const data = await response.json();
    console.log('✅ Withdrawal submitted:', data);
    return data;
  } catch (error) {
    console.error('❗ Withdrawal exception:', error);
    throw error;
  }
}

export async function fetchWithdrawalHistory(userId) {
  console.log('📜 Fetching withdrawal history for:', userId);
  try {
    const response = await fetch(`${API_BASE_URL}/api/withdrawals/user/${userId}`, {
      headers: getHeaders()
    });

    console.log('🔄 History fetch status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Fetch history error:', errorData);
      throw new Error(errorData.error || 'Failed to fetch withdrawal history');
    }

    const data = await response.json();
    console.log('✅ Withdrawal history:', data);
    return data;
  } catch (error) {
    console.error('❗ Withdrawal history exception:', error);
    throw error;
  }
}
