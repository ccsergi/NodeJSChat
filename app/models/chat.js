var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatSchema = new Schema({
    user: {type: String, required: true},
    room: {type: String, required: true},
    message: {type: String, required: true},
    timestamp: { type: Date, default: Date.now },

});

module.exports = mongoose.model('chat', ChatSchema);