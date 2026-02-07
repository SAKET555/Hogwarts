const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get messages for a room
// @route   GET /api/messages/:roomId
// @access  Private
const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chatRoom: req.params.roomId })
            .populate('sender', 'name email house')
            .sort({ createdAt: 1 }); // Oldest first
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
    const { content, chatRoom } = req.body;

    if (!content || !chatRoom) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    try {
        var newMessage = {
            sender: req.user._id,
            content: content,
            chatRoom: chatRoom,
        };

        var message = await Message.create(newMessage);
        message = await message.populate('sender', 'name house');

        // logic to emit socket event could be here or handled in socket handler
        // For REST API, we just return the message
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMessages, sendMessage };
