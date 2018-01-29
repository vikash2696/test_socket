
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var QuestionSchema = new Schema({

    name: String,
    phone: String,
    address: String
});

module.exports = mongoose.model('questions',QuestionSchema);