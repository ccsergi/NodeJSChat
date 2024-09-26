var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApiSchema = new Schema({
    apiKey: {type: String, required: true},
});

module.exports = mongoose.model('api', ApiSchema);