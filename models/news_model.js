/**
 * Created by ahmedalaa on 4/12/17.
 */

var mongoose = require('mongoose');

var news_schema = mongoose.Schema(
    {
        title: String,
        Body: String,
        creation_date: Date,
        to_delete_date: Date,
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        to_view: {
            type: Boolean,
            default: true
        },
        img_path: {
            type: String,
            default: process.env.OPENSHIFT_DATA_DIR + "/uploads/" + "logo.jpg"
        },
        media_path: {
            type: String,
            default: process.env.OPENSHIFT_DATA_DIR + "/uploads/" + "logo.jpg"
        }
    }
);
var news = mongoose.model('News', news_schema);
module.exports = news;