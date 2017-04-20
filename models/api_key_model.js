/**
 * Created by ahmedalaa on 4/17/17.
 */


var mongoose = require('mongoose');

var API_Key_model = mongoose.Schema(
    {
        api_key : {
            type: String,
            required: true,
            unique: true
        },
        creation_date: Date,
        valid_for: [String]
    }
);
var API_Key = mongoose.model('API_Key', API_Key_model);
module.exports = API_Key;