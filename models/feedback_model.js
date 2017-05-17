/**
 * Created by ahmedalaa on 4/12/17.
 */


var mongoose = require('mongoose');

var feedback_schema = mongoose.Schema(
    {
        body: String,
        about: String,
        creation_date: Date,
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }
);
var feedback = mongoose.model('Feedback', feedback_schema);
module.exports = feedback;