/**
 * Created by ahmedalaa on 4/12/17.
 */

var mongoose = require('mongoose');

var ATM_schema = mongoose.Schema(
    {
        loc_name: { // area
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
        address: String,
        zone: { // government (Category)
            type: String,
            default: "cairo"
        },
        sector: {
            type: String,
            default: "atm"
        },
        group: {
            type: String,
            default: "General"
        }
    }
);
var ATM = mongoose.model('ATMs', ATM_schema);
module.exports = ATM;