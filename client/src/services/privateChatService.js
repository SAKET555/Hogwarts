import axios from 'axios';

const API_URL = 'http://localhost:3000/api/chat';

// Get all users for private chat
const getUsers = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(`${API_URL}/users`, config);
    return response.data;
};

export default {
    getUsers,
};
