const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userID: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    post: {
        type: String,
        required: true,
    },
    selectedFile: {
        type: String,
    },
    youTubeLink: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Post', postSchema);