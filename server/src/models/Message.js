const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
        // This will store the encrypted string
    },
    chatRoom: {
        type: String,
        default: 'CommonRoom', // Can be specific rooms or 'Global'
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true, // CreatedAt will serve as the timestamp
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
