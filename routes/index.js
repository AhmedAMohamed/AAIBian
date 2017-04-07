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

            var a = new user_model({
                name: req.body.name,
                description: req.body.description,
                location: { lat: req.body.lat, lng: req.body.lng },
                history: {
                    event: 'created', email: req.body.email, date: new Date(),
                },
                approved: false,
            });
            a.save(function (err,op) {
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
