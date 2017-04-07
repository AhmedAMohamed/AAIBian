var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("here");
    var options = {
        user: 'alaa',
        pass: 'ahmed'
    };
    var uri = "mongodb://alaa:ahmed@ds153710.mlab.com:53710/aaibian";
    mongoose.connect(uri, options, function(error) {
        if(error) {
            res.json({"Ahmed":"error"});
        }
        else {
            res.json({"Ahmed":"passed"});
        }
    });
});

module.exports = router;
