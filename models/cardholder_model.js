/**
 * Created by ahmedalaa on 4/15/17.
 */


var mongoose = require('mongoose');

var cardHolder_schema = mongoose.Schema(
    {
        name: String,
        address: String,
        location: {
            type: [Number],
            index: '2d'
        },
        merchant: String,
        zone: String,
        id: {
            type: Number,
            unique: true
        },
        contacts: [String],
        validity_date: Number,
        industry: String,
        offer: String,
        creation_date: Date
    }
);
var benefit = mongoose.model('CardHolder', cardHolder_schema);
module.exports = benefit;