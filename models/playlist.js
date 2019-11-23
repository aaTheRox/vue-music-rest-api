const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
    title: String,
    description: String,
    archived: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('playlists', PlaylistSchema);