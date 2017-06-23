/**
 * Created by ahmedalaa on 4/15/17.
 */

var mongoose = require('mongoose');

var cardHolder_schema = mongoose.Schema(
    {
        name: String,
        offer: String,
        type: String,
        creation_date: Date
    }
);
var cardModel = mongoose.model('CardHolder', cardHolder_schema);
module.exports = cardModel;