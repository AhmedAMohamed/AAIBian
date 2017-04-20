var express = require('express');
var csv = require('fast-csv');
var fs  = require('fs');
var sha1 = require('sha1');
var path = require('path');

var schedule = require('node-schedule');

var router = express.Router();

var Auth = require('../Utils/auth_layer');
var Benefit = require('../models/benefit_model');
var Medical = require('../models/medical_sector_model');
var startups = require('../Utils/helpers');
var types = require('../Strings/names_translations')[0];

router.post('/addBenefits', function (req, res, next) {
    if (Auth.general_creation_root.auth_check(req.body.email, req.body.password, req.body.api_key,
            req.body.token, req.body.privilege, req.body.task)) {
        var dat = [[]];
        fs.createReadStream((process.env.OPENSHIFT_DATA_DIR || '../../../CSVs/') + "benefits.csv").pipe(csv()).
        on('data', function (data) {
            if(data.length == 12) {
                dat.push(data);
            }
        }).on('end', function (dataLength) {
            console.log("read finished");
            var counter = 25;
            dat.forEach(function (data) {
                var notify_date = new Date(Date.now());
                notify_date.setSeconds(notify_date.getSeconds() + counter);
                notify_date.setMinutes(notify_date.getMinutes() + 1);
                notify_date.setFullYear(notify_date.getFullYear() + 1);

                var to_delete_date = new Date(Date.now());
                to_delete_date.setMinutes(to_delete_date.getMinutes() + 2);
                to_delete_date.setSeconds(to_delete_date.getSeconds() + 2 * counter);
                to_delete_date.setFullYear(to_delete_date.getFullYear() + 1);
                to_delete_date.setHours(to_delete_date.getHours());
                counter += 30;

                var d = {
                    id: parseInt(data[0]),
                    name: data[1],
                    address: data[2],
                    location: [
                        parseFloat(data[3]),
                        parseFloat(data[4])
                    ],
                    zone: data[5],
                    contacts: [data[6], data[7], data[8]],
                    industry: data[10],
                    notification_date: notify_date,
                    deleteDate: to_delete_date,
                    notified: false,
                    offer: data[11]
                };
                var benefit = new Benefit(d);
                benefit.save(function (err, da) {
                    if (err) {
                        console.log(("error in inserting line"));
                    }
                    else {
                        console.log("Notify id " + da.id + " at " + da.notification_date);
                        console.log("Delete id " + da.id + " at " + da.deleteDate);
                        var j = schedule.scheduleJob("benefit_staff_" + da.id, da.notification_date, function () {
                            startups[1].notifyAndScheduleDelete(da, startups[2].getInterested(da._id));
                        });
                    }
                });
            });
            res.json({"valid": true, "msg": "Operation finished"});
        });
    }
    else {
        res.json({"valid":false, msg: "Not authorized"});
    }
});

router.post('/addMedical', function (req, res, next) {
    if (Auth.general_creation_root.auth_check(req.body.email, req.body.password, req.body.api_key,
            req.body.token, req.body.privilege, req.body.task)) {
        var dat = [];
        var keys = Object.keys(types);
        keys.forEach(function (key) {
            fs.createReadStream((process.env.OPENSHIFT_DATA_DIR || '../../../CSVs/') + types[key] + ".csv" ).pipe(csv()).
            on('data', function (data) {
                dat.push(data);
                var row = {
                    type : types[key],
                    id: types[key] + "_" + data[0],
                    name: data[1],
                    address: data[2],
                    zone: data[3],
                    phone_number: data[4],
                    location: [
                        parseFloat(data[5]),
                        parseFloat(data[6])
                    ]
                }
                var medical = new Medical(row);
                medical.save(function (err, dent) {
                    if (err) {
                        console.log(err);
                        console.log("Some error");
                    }
                    else {
                        console.log("Done row in " + types[key]);
                    }
                })
            }).on('end', function (dataLength) {
                console.log("finished");
            });

        });
        res.json({"valid": true, "msg": "Operation finished"});
    }
    else {
        res.json({"valid":false, msg: "Not authorized"});
    }
});

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
})

router.get('/data', function(req,res){
    res.json([{"id": 1, "name": "Mymm", "city": "Pantano do Sul"},
        {"id": 2, "name": "Skyble", "city": "Guilmaro"},
        {"id": 3, "name": "Tagfeed", "city": "Gnosjö"},
        {"id": 4, "name": "Realcube", "city": "Jrashen"},
        {"id": 5, "name": "Bluejam", "city": "Zhangjiawo"},
        {"id": 6, "name": "Jayo", "city": "Obonoma"},
        {"id": 7, "name": "Cogidoo", "city": "Sungsang"},
        {"id": 8, "name": "Avavee", "city": "Diawara"},
        {"id": 9, "name": "Tagtune", "city": "Monywa"},
        {"id": 10, "name": "Centimia", "city": "Retkovci"}]);
});


module.exports = router;
