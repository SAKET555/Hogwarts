import axios from 'axios';
import { API_URLS } from '../config';

const API_URL = API_URLS.CHAT;

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
