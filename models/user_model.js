var mongoose = require('mongoose');

var reserved_tokens = require('../Strings/reserved_tokens');
var User_schema = mongoose.Schema(
    {
        name: String,
        reg_id: String,
        avatar: String,
        password: {
                        type: String,
                        required: true
                },
        email: {
                        type: String,
                        required: true,
                        unique: true,
                        trim: true,
                        index: true
                },
        privilege: String,
        subscribed_in: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Benefit'
        }],
        area: String,
        job_desc: String,
        login_status: {type: String, default: reserved_tokens.first_login},

        last_login: {type: Date}
    }
);
var Users = mongoose.model('User', User_schema);
module.exports = Users;
