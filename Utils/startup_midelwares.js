
var Benefit = require('../models/benefit_model');
var schedule = require('node-schedule');
var messages = require('../Strings/messeges');

var selectKeys = function (starter, list) {
    var keys = [];
    list.forEach(function (key) {
        if (key.indexOf(starter) != -1) {
            keys.push(key);
        }
    });
    return keys;
};

var notifyMessege = function(mess) {
    console.log("Notification not implemented yet");
};

var getInterested = function (id) {

};

var notification_callbacks = {
    notifyAndScheduleDelete: function (ben, regIds) {
        notifyMessege(regIds, messages.benefit_expire(ben.name));

        var j = schedule.scheduleJob("delete_staff_benefit_" + ben.id, ben.deleteDate, function () {
            Benefit.findByIdAndRemove(ben._id, function (err, b) {
                if(err) {
                    console.log("Some error");
                }
            })
        } )
    },
    scheduleDeletion: function () {

    }

};

var onStart = {
    benefit_schedules: function () {
        console.log("Ahmed IS HERE ");
        var job_keys = Object.keys(schedule.scheduledJobs);
        var benefit_keys = selectKeys("benefit_staff_", job_keys);
        if (benefit_keys.length == 0) {
            // find all benefits in the DB then call schedule them again
            Benefit.find({}, function (err, benefits) {
                if (err) {

                }
                else {
                    console.log("data is processed");
                    console.log(benefits.length);
                    benefits.forEach(function (ben) {
                        var j = schedule.scheduleJob("benefit_staff_" + ben.id ,ben.notification_date,
                            notification_callbacks.notifyAndScheduleDelete(ben.name, getInterested(ben._id), ben._id));
                    });
                }
            });
        }
    },
    benefit_delete_schedule: function () {
        var job_keys = Object.keys(schedule.scheduledJobs);
        var to_delete_jobs = selectKeys("delete_staff_benefit_", job_keys);
        if (to_delete_jobs.length == 0) {
            Benefit.find({deleteDate: { $gte : new Date(Date.now())}}, function (err, bens) {
                if(err) {
                    console.log("Some error");
                }
                else {
                    bens.forEach(function (ben) {
                        var j = schedule.scheduleJob("delete_staff_benefit_" + ben.id, ben.deleteDate, function () {
                           Benefit.findByIdAndRemove(ben._id, function (err, be) {
                               if (err) {
                                   console.log("Some wrong");
                               }
                           })
                        });
                    });
                }

            });
            Benefit.find({deleteDate: { $lte : new Date(Date.now())}} , function (err, bens) {
                if (err) {
                    console.log("Some wrong");
                }
                else {
                    bens.forEach(function (ben) {
                       Benefit.findByIdAndRemove(ben._id, function (err, ben) {
                           if(err) {
                               console.log("Some wrong");
                           }
                       });
                    });
                }
            })
        }
    }
};


module.exports = [onStart, notification_callbacks];