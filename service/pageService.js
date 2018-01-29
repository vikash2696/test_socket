
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PageSchema = new Schema({

    title: String,
    description: String,
    author:String
});

module.exports = mongoose.model('pages',PageSchema);