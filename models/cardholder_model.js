/**
 * Created by ahmedalaa on 4/15/17.
 */

var mongoose = require('mongoose');

var cardHolder_schema = mongoose.Schema(
    {
        name: String,
        offer: String,
        type: String,
        sector: {
            type: String,
            default: "card"
        },
        address: String,
        location: {
            type: [Number],
            index: '2d'
        },
        zone: String,
        contacts: [String],
        notification_date: Date,
        deleteDate: Date,
        notified: {
            type: Boolean,
            default: false
        },
        img_path: {
            type: String,
            default: ""
        },
        pdf_path: {
            type: String,
            default: ""
        },
        creation_date: Date

    }
);
var cardModel = mongoose.model('CardHolder', cardHolder_schema);
module.exports = cardModel;