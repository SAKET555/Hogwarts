const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    house: {
        type: String,
        enum: ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff', 'Hogwarts'],
        default: 'Hogwarts',
    },
    wand: {
        wood: String,
        core: String,
        length: String,
        flexibility: String,
    },
    language: {
        type: String,
        default: 'en',
    },
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
