/*
**
 * Created by ahmedalaa on 4/30/17.
 */

var mongoose = require('mongoose');

var area_schema = mongoose.Schema(
    {
        name: String,
        search_name: {
          type: String,
          unique: true
        },
        creation_date: Date
    }
);
var areas = mongoose.model('Areas', area_schema);
module.exports = areas;
