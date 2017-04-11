var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var user_model = require('../models/user_model');
/* GET home page. */
var csv = require('fast-csv');
var fs  = require('fs');

router.get('/', function(req, res, next) {
    console.log("here");
    var options = {
        user: 'alaa',
        pass: 'ahmed'
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
                if (err) {
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


router.get('/trial', function (req, res, next) {
    fs.createReadStream(process.env.OPENSHIFT_DATA_DIR + 'atm_locations.csv').pipe(csv()).on('data', function (data) {
        console.log(data);
    }).on('end', function (data) {
        console.log("read finished");
    });
});
module.exports = router;
