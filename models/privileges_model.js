

var mongoose = require('mongoose');

var privilege_schema = mongoose.Schema(
    {
        root: [String],
        admin: [String],
        last_update: Date
    }
);
var news = mongoose.model('Privileges', privilege_schema);
module.exports = news;