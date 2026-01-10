import { auth } from '../config/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function to get auth token from Firebase
const getToken = async () => {
    const user = auth.currentUser;
    if (user) {
        return await user.getIdToken();
    }
    return null;
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
    const token = await getToken();

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Authentication API
export const authAPI = {
    register: async (email, name, password) => {
        const data = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, name, password }),
        });
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        return data;
    },

    login: async (email, password) => {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    getCurrentUser: async () => {
        return await apiRequest('/auth/me');
    },
};

// Problems API
export const problemsAPI = {
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.difficulty && filters.difficulty !== 'all') {
            params.append('difficulty', filters.difficulty);
        }
        if (filters.category && filters.category !== 'all') {
            params.append('category', filters.category);
        }
        if (filters.search) {
            params.append('search', filters.search);
        }

        const queryString = params.toString();
        return await apiRequest(`/problems${queryString ? `?${queryString}` : ''}`);
    },

    getById: async (id) => {
        return await apiRequest(`/problems/${id}`);
    },
};

// Submissions API
export const submissionsAPI = {
    submit: async (problemId, code, language) => {
        return await apiRequest('/submissions', {
            method: 'POST',
            body: JSON.stringify({ problemId, code, language }),
        });
    },

    getRecent: async () => {
        return await apiRequest('/submissions/recent');
    },

    getForProblem: async (problemId) => {
        return await apiRequest(`/submissions/problem/${problemId}`);
    },
};

// Users API
export const usersAPI = {
    getProfile: async (userId) => {
        return await apiRequest(`/users/${userId}`);
    },

    getActivity: async (days = 365) => {
        return await apiRequest(`/users/activity?days=${days}`);
    },
};

// Check if backend is available
export const checkBackendHealth = async () => {
    try {
        const response = await fetch(`${API_URL.replace('/api', '')}/health`);
        return response.ok;
    } catch (error) {
        return false;
    }
};
