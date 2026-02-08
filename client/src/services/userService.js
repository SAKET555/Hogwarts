import axios from 'axios';
import { API_URLS } from '../config';

const API_URL = API_URLS.USERS;

const getProfile = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(API_URL + 'profile', config);
    return response.data;
};

const updateProfile = async (userData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.put(API_URL + 'profile', userData, config);

    // Update local storage if needed, or rely on context
    if (response.data) {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('user', JSON.stringify({ ...currentUser, ...response.data }));
    }

    return response.data;
};

const userService = {
    getProfile,
    updateProfile,
};

export default userService;
