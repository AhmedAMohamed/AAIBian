/**
 * Created by ahmedalaa on 4/12/17.
 */

var mongoose = require('mongoose');

var news_schema = mongoose.Schema(
    {
        title: String,
        Body: String,
        creation_date: Date,
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        to_view: Boolean
    }
);
var news = mongoose.model('News', news_schema);
module.exports = news;