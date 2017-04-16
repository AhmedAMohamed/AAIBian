/**
 * Created by ahmedalaa on 4/12/17.
 */

var mongoose = require('mongoose');

var medical_schema = mongoose.Schema(
    {
        name: String,
        address: String,
        location: {
            type: [Number],
            index: '2d'
        },
        zone: String,
        type: String,
        phone_number: String
    }
);
var medical = mongoose.model('Medical', medical_schema);
module.exports = medical;