const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username required!']
    },
    password: {
        type: String,
        required: [true, 'Password required!']
    }
})

module.exports = mongoose.model('User', userSchema);