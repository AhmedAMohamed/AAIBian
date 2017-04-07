var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var user_model = require('../models/user_model');
/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("here");
    var options = {
        user: 'AhmedAMohamed',
        pass: 'gehad1234'
    };
    var uri = "mongodb://alaa:ahmed@ds153710.mlab.com:53710/aaibian";
    mongoose.connect(uri, options, function(error) {
        if(error) {
            user_model.save({},function (err,op) {
                if (error) {
                    res.json({"Ahmed":err});
                }
                else {
                    res.json({"Ahmed":"done"});
                }
            })
        }
        else {
            res.json({"Ahmed":"passed"});
        }
    });
});

module.exports = router;
