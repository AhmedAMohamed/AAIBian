/**
 * Created by ahmedalaa on 4/12/17.
 */
var mongoose = require('mongoose');

var benefit_schema = mongoose.Schema(
    {
        name: String,
        address: String,
        location: {
            type: [Number],
            index: '2d'
        },
        zone: String,
        id: {
            type: Number,
            unique: true
        },
        contacts: [String],
        creation_date: {
            type: Date,
            get: v => v.getTime(),
            set: v => new Date(v)
        },
        notification_date: Date,
        deleteDate: Date,
        notified: {
            type: Boolean,
            default: false
        },
        industry: String,
        offer: String
    }
);
var benefit = mongoose.model('Benefits', benefit_schema);
module.exports = benefit;