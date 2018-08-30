var mongoose = require('mongoose');

var group_schema = mongoose.Schema(
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
var Group = mongoose.model('Group', group_schema);
module.exports = Group;
