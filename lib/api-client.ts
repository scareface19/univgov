// Client API pour faciliter les appels depuis le frontend

const API_BASE = '/api';

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Courses API
export const coursesApi = {
  getAll: (params?: { faculty?: string; semester?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/courses${query ? `?${query}` : ''}`);
  },
  create: (data: any) => apiCall('/courses', { method: 'POST', body: JSON.stringify(data) }),
};

// Enrollments API
export const enrollmentsApi = {
  get: (params?: { studentId?: string; courseId?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/enrollments${query ? `?${query}` : ''}`);
  },
  enroll: (data: { studentId: string; courseId: string }) =>
    apiCall('/enrollments', { method: 'POST', body: JSON.stringify(data) }),
};

// Suggestions API
export const suggestionsApi = {
  getAll: (params?: { status?: string; category?: string; sort?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/suggestions${query ? `?${query}` : ''}`);
  },
  create: (data: any) =>
    apiCall('/suggestions', { method: 'POST', body: JSON.stringify(data) }),
  vote: (suggestionId: string, userId: string) =>
    apiCall('/suggestions', {
      method: 'PUT',
      body: JSON.stringify({ suggestionId, action: 'vote', userId }),
    }),
  updateStatus: (suggestionId: string, status: string) =>
    apiCall('/suggestions', {
      method: 'PUT',
      body: JSON.stringify({ suggestionId, action: 'updateStatus', status }),
    }),
};

// Votes API
export const votesApi = {
  getAll: (params?: { active?: string; category?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/votes${query ? `?${query}` : ''}`);
  },
  vote: (voteId: string, optionId: number, userId: string) =>
    apiCall('/votes', {
      method: 'POST',
      body: JSON.stringify({ action: 'vote', voteId, optionId, userId }),
    }),
};

// Messages API
export const messagesApi = {
  getConversations: (userId: string) =>
    apiCall(`/messages?userId=${userId}&type=conversations`),
  getMessages: (conversationId: string) =>
    apiCall(`/messages?conversationId=${conversationId}`),
  send: (data: { senderId: string; recipientId: string; content: string; conversationId?: string }) =>
    apiCall('/messages', { method: 'POST', body: JSON.stringify(data) }),
  markAsRead: (conversationId: string, userId: string) =>
    apiCall('/messages', {
      method: 'PUT',
      body: JSON.stringify({ conversationId, userId }),
    }),
};

// Complaints API
export const complaintsApi = {
  getAll: (params?: { userId?: string; status?: string; category?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/complaints${query ? `?${query}` : ''}`);
  },
  create: (data: any) =>
    apiCall('/complaints', { method: 'POST', body: JSON.stringify(data) }),
  update: (complaintId: string, action: string, data: any) =>
    apiCall('/complaints', {
      method: 'PUT',
      body: JSON.stringify({ complaintId, action, ...data }),
    }),
};

// Utility hook pour React
export function useApi() {
  return {
    courses: coursesApi,
    enrollments: enrollmentsApi,
    suggestions: suggestionsApi,
    votes: votesApi,
    messages: messagesApi,
    complaints: complaintsApi,
  };
}


