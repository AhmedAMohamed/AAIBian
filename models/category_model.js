/*
**
 * Created by ahmedalaa on 4/30/17.
 */

var mongoose = require('mongoose');

var category_schema = mongoose.Schema(
    {
        name: String,
        search_name: String,
        img_path: {
            type: String,
            default: "/uploads/logo.jpg"
        },
        sector: String,
        creation_date: Date
    }
);
var categories = mongoose.model('Categories', category_schema);
module.exports = categories;
