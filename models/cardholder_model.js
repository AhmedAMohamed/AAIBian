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
        offer: String,
        type: String,
        creation_date: Date
    }
);
var benefit = mongoose.model('CardHolder', cardHolder_schema);
module.exports = benefit;