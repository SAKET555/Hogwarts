import axios from 'axios';

const API_URL = 'http://localhost:3000/api/messages/';

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
