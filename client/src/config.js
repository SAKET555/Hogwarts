const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
// Slash Guard: Ensure no trailing slash on the base URL to prevent double slashes later
const API_BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

console.log("🪄 Magical API Endpoint initialized at:", API_BASE_URL);

export const API_URLS = {
    AUTH: `${API_BASE_URL}/api/auth/`,
    USERS: `${API_BASE_URL}/api/users/`,
    MESSAGES: `${API_BASE_URL}/api/messages/`,
    CHAT: `${API_BASE_URL}/api/chat`,
};

export default API_BASE_URL;
