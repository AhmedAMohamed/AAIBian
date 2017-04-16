var mongoose = require('mongoose');
var user_model = require('../models/user_model');

var connector = function(url, callback) {
    console.log("here");
    var options = {
        user: 'alaa',
        pass: 'ahmed'
    };
    mongoose.connect(url, options, function(error) {
        if(error) {
            console.log("why????");
            console.log(error);
            callback(false);
        }
        else {
            callback(true);
        }
    });
}
module.exports = connector;