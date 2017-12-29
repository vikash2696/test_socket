
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({

    user_name: String,
    password: String,
    is_admin:String
});

module.exports = mongoose.model('users',UserSchema);