const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('rekind_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('rekind_token', token);
}

export function removeAuthToken() {
  localStorage.removeItem('rekind_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.error || response.statusText || 'Network request failed';
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Auth
  register: (userData: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentials: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getMe: () => request<any>('/auth/me'),
  updateProfile: (profileData: any) => request<any>('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  changePassword: (passwordData: any) => request<any>('/auth/password', { method: 'PUT', body: JSON.stringify(passwordData) }),

  // Items
  getItems: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        query.append(k, String(v));
      }
    });
    return request<any>(`/items?${query.toString()}`);
  },
  getItem: (id: string) => request<any>(`/items/${id}`),
  createItem: (itemData: any) => request<any>('/items', { method: 'POST', body: JSON.stringify(itemData) }),
  updateItem: (id: string, itemData: any) => request<any>(`/items/${id}`, { method: 'PUT', body: JSON.stringify(itemData) }),
  deleteItem: (id: string) => request<any>(`/items/${id}`, { method: 'DELETE' }),
  toggleFavorite: (id: string) => request<any>(`/items/${id}/favorite`, { method: 'POST' }),
  getFavorites: () => request<any>('/favorites'),

  // Requests & Activity
  createRequest: (requestData: any) => request<any>('/requests', { method: 'POST', body: JSON.stringify(requestData) }),
  getActivity: () => request<any>('/activity'),
  updateRequestStatus: (id: string, status: string) => request<any>(`/requests/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Community Needs
  getCommunityNeeds: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        query.append(k, String(v));
      }
    });
    return request<any>(`/community-needs?${query.toString()}`);
  },
  createCommunityNeed: (needData: any) => request<any>('/community-needs', { method: 'POST', body: JSON.stringify(needData) }),
  offerToCommunityNeed: (id: string, offerData: any) => request<any>(`/community-needs/${id}/offer`, { method: 'POST', body: JSON.stringify(offerData) }),

  // Conversations & Messages
  getConversations: () => request<any>('/conversations'),
  getConversation: (id: string) => request<any>(`/conversations/${id}`),
  sendMessage: (conversationId: string, text: string) => request<any>(`/conversations/${conversationId}/messages`, { method: 'POST', body: JSON.stringify({ text }) }),
  startConversation: (data: { recipientId: string; itemId?: string; initialMessage?: string }) => request<any>('/conversations/start', { method: 'POST', body: JSON.stringify(data) }),

  // Notifications
  getNotifications: () => request<any>('/notifications'),
  markNotificationRead: (id: string) => request<any>(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => request<any>('/notifications/read-all', { method: 'PATCH' }),

  // Impact Dashboard
  getImpact: () => request<any>('/impact'),

  // AI Assistant
  getAiSuggestions: (promptData: any) => request<any>('/ai/suggest', { method: 'POST', body: JSON.stringify(promptData) }),
};
