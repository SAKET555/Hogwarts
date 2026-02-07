import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import chatService from '../services/chatService';
import privateChatService from '../services/privateChatService';
import io from 'socket.io-client';
import { encryptMessage, decryptMessage } from '../utils/encryption';
import '../styles/Chat.css';

const ENDPOINT = 'http://localhost:3000';
var socket, selectedChatCompare;

const Chat = () => {
    const { user } = useUser();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socketConnected, setSocketConnected] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedChat, setSelectedChat] = useState({ type: 'room', id: 'CommonRoom', name: `${user?.house || 'Hogwarts'} Common Room` });
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Fetch users for private chat
    useEffect(() => {
        const fetchUsers = async () => {
            if (!user?.token) return;
            try {
                const data = await privateChatService.getUsers(user.token);
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users", error);
            }
        };
        fetchUsers();
    }, [user]);

    // Socket connection and message handling
    useEffect(() => {
        const token = user?.token;
        if (!token) return;

        socket = io(ENDPOINT);
        socket.emit("join_room", selectedChat.id);
        socket.on('connect', () => setSocketConnected(true));
        socket.on('receive_message', (receivedMessage) => {
            setMessages((prev) => [...prev, receivedMessage]);
        });

        // Fetch history
        const fetchMessages = async () => {
            try {
                const data = await chatService.getMessages(selectedChat.id, token);
                setMessages(data);
            } catch (error) {
                console.error("Failed to load messages", error);
            }
        };

        fetchMessages();

        return () => {
            socket.disconnect();
        };
    }, [user, selectedChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const encryptedContent = encryptMessage(newMessage);
            const messageData = {
                content: encryptedContent,
                chatRoom: selectedChat.id,
            };

            const savedMessage = await chatService.sendMessage(messageData, user.token);

            socket.emit("send_message", {
                ...savedMessage,
                room: selectedChat.id
            });

            setMessages([...messages, savedMessage]);
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    const selectChat = (chatType, chatId, chatName) => {
        // Leave current room
        if (socket) {
            socket.emit("leave_room", selectedChat.id);
        }

        // Join new room
        setSelectedChat({ type: chatType, id: chatId, name: chatName });
        setMessages([]);

        if (socket) {
            socket.emit("join_room", chatId);
        }
    };

    // Generate private room ID (consistent for both users)
    const getPrivateRoomId = (userId1, userId2) => {
        return [userId1, userId2].sort().join('_');
    };

    return (
        <div className="chat-page">
            {/* Sidebar with user list */}
            <div className="chat-sidebar">
                <h3>Chats</h3>

                {/* Common Room */}
                <div
                    className={`chat-item ${selectedChat.id === 'CommonRoom' ? 'active' : ''}`}
                    onClick={() => selectChat('room', 'CommonRoom', `${user?.house || 'Hogwarts'} Common Room`)}
                >
                    <div className="chat-icon">🏰</div>
                    <div className="chat-info">
                        <div className="chat-name">Common Room</div>
                        <div className="chat-subtitle">{user?.house || 'Hogwarts'}</div>
                    </div>
                </div>

                <div className="divider">
                    <span>Private Chats</span>
                </div>

                {/* User list for private chats */}
                {users.map((chatUser) => {
                    const privateRoomId = getPrivateRoomId(user._id, chatUser._id);
                    return (
                        <div
                            key={chatUser._id}
                            className={`chat-item ${selectedChat.id === privateRoomId ? 'active' : ''}`}
                            onClick={() => selectChat('private', privateRoomId, chatUser.name)}
                        >
                            <div className="chat-icon">{chatUser.house === 'Gryffindor' ? '🦁' : chatUser.house === 'Slytherin' ? '🐍' : chatUser.house === 'Ravenclaw' ? '🦅' : '🦡'}</div>
                            <div className="chat-info">
                                <div className="chat-name">{chatUser.name}</div>
                                <div className="chat-subtitle">{chatUser.house}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main chat area */}
            <div className="chat-container">
                <div className="chat-header">
                    <h2>{selectedChat.name}</h2>
                    <span className="chat-type-badge">{selectedChat.type === 'room' ? '🏰 Group' : '🔒 Private'}</span>
                </div>
                <div className="messages-box parchment">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${msg.sender?._id === user._id ? 'sent' : 'received'}`}
                        >
                            <div className="message-sender">{msg.sender?.name}</div>
                            <div className="message-content">{decryptMessage(msg.content)}</div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <form className="chat-input-area" onSubmit={sendMessage}>
                    <input
                        type="text"
                        placeholder="Send a magical message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit" className="magical-btn">Send</button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
