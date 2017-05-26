/**
 * Created by ahmedalaa on 4/12/17.
 */

var mongoose = require('mongoose');

var ATM_schema = mongoose.Schema(
    {
        loc_name: {
            type: String,
            required: true
        },
        location: {
            type: [Number],
            index: '2d'
        },
        creation_date: {
            type: Date
        },
        address: String
    }
);
var ATM = mongoose.model('ATMs', ATM_schema);
module.exports = ATM;