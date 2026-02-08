import axios from 'axios';
import { API_URLS } from '../config';

const API_URL = API_URLS.MESSAGES;

const getMessages = async (roomId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(API_URL + roomId, config);
    return response.data;
};

const sendMessage = async (messageData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.post(API_URL, messageData, config);
    return response.data;
};

const chatService = {
    getMessages,
    sendMessage,
};

export default chatService;
