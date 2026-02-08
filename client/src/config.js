const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_URLS = {
    AUTH: `${API_BASE_URL}/api/auth/`,
    USERS: `${API_BASE_URL}/api/users/`,
    MESSAGES: `${API_BASE_URL}/api/messages/`,
    CHAT: `${API_BASE_URL}/api/chat`,
};

export default API_BASE_URL;
