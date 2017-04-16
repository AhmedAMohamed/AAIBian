var express = require('express');
var csv = require('fast-csv');
var fs  = require('fs');
var sha1 = require('sha1');

var schedule = require('node-schedule');

var router = express.Router();

var Benefit = require('../models/benefit_model');
var startups = require('../Utils/startup_midelwares');

router.get('/trial', function (req, res, next) {
    var dat = [[]];
    fs.createReadStream((process.env.OPENSHIFT_DATA_DIR || '../../../CSVs/') + "benefits.csv").pipe(csv()).on('data', function (data) {
        if(data.length == 12) {
            dat.push(data);
        }
    }).on('end', function (dataLength) {
        console.log("read finished");
        //notify_date.setFullYear(notify_date.getFullYear());
        var counter = 25;
        dat.forEach(function (data) {
            var notify_date = new Date(Date.now());
            notify_date.setSeconds(notify_date.getSeconds() + counter);
            notify_date.setMinutes(notify_date.getMinutes() + 1);
            counter += 30;

            var d = {
                id: parseInt(data[0]),
                name: data[1],
                address: data[2],
                location:[
                    parseFloat(data[3]),
                    parseFloat(data[4])
                ],
                zone: data[5],
                contacts: [data[6], data[7], data[8]],
                industry: data[10],
                notification_date: notify_date ,
                offer: data[11]
            };
            var benefit = new Benefit(d);
            benefit.save(function(err, da){
                if(err) {
                    console.log(("error in inserting line"));
                }
                else {
                    console.log(da.notification_date);
                    var j = schedule.scheduleJob("benefit_staff_" + da.id, da.notification_date, startups[1].notifyAndScheduleDelete);
                }
            });
        });

        res.json("Done");
    });
});

router.get('/test', function (req, res, next) {
    startups[0].benefit_schedules();
    res.json("tttttttt");
});

router.get('/testTime', function (req, res, next) {
    var start = new Date(Date.now());
    var end = new Date(start.getTime() + 100000);
    console.log("yyyyyyyyyyyy");
    start.setMinutes(start.getMinutes()+1);
    console.log(start.getMinutes());
    var j = schedule.scheduleJob("ahmed",start, function () {
        console.log("Done");
    })
    res.json("hello");
});

router.get("/deleteEvent", function (req, res, next) {
   var j = schedule.scheduledJobs["ahmed"];
   console.log(j);
   j.cancel();
   console.log("Deleted");
});

router.get('/check', function (req, res, next) {
    res.json({"ahmed": Object.keys(schedule.scheduledJobs).length});
    console.log(Object.keys(schedule.scheduledJobs));
});

module.exports = router;
