
var Benefit = require('../models/benefit_model');
var User = require('../models/user_model');
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

var notifyMessage = function(users, mess) {
    console.log("Notification not implemented yet");
};

var users_helpers = {
    getInterested : function (ben_id) {
        User.find({subscribed_in : { $in :[ben_id]}}, function (err, users) {
            if (err) {
                console.log("Some Error");
            }
            else {
                return users;
            }
        });
    }
};

var notification_schedules_helpers = {
    notifyAndScheduleDelete: function (ben, users) {
        notifyMessage(users, messages.benefit_expire(ben.name));
        ben.notified = true;
        ben.save(function (err, upBen) {
            if (err) {
                console.log("Some error");
            }
            else {
                notification_schedules_helpers.scheduleDeletion(upBen);
            }
        });
    },
    scheduleDeletion: function (ben) {
        var j = schedule.scheduleJob("delete_staff_benefit_" + ben.id, ben.deleteDate, function () {
            Benefit.findByIdAndRemove(ben._id, function (err, b) {
                if(err) {
                    console.log("Some error");
                }
                else {
                    console.log("Deleted from schedule");
                }
            });
        });
    }
};

var starter_helper = {
    benefit_schedules: function () {
        console.log("Ahmed IS HERE ");
        var job_keys = Object.keys(schedule.scheduledJobs);
        var benefit_keys = selectKeys("benefit_staff_", job_keys);
        if (benefit_keys.length == 0) {
            // find all benefits in the DB then call schedule them again
            Benefit.find({notification_date: {$gte : new Date(Date.now())}, notified: false}, function (err, benefits) {
                if (err) {

                }
                else {
                    console.log("data is processed");
                    console.log(benefits.length);
                    benefits.forEach(function (ben) {
                        console.log("Schedule benefit " + ben.id + " to notify at " + ben.notification_date);
                        var j = schedule.scheduleJob("benefit_staff_" + ben.id ,ben.notification_date, function () {
                            notification_schedules_helpers.notifyAndScheduleDelete(ben, users_helpers.getInterested(ben._id));
                        });
                    });
                }
            });

            Benefit.find({notification_date: {$lte : new Date(Date.now())} , notified: true }, function (err, bens) {
               if (err) {
                   console.log("Some error");
               }
               else {
                   console.log("here");
                   console.log(bens.length);
                   bens.forEach(function (ben) {
                      notification_schedules_helpers.notifyAndScheduleDelete(ben, users_helpers.getInterested(ben._id));
                   });
               }
            });
        }
    },
    benefit_delete_schedule: function () {
        console.log("Here in delete_schedule function");
        var job_keys = Object.keys(schedule.scheduledJobs);
        var to_delete_jobs = selectKeys("delete_staff_benefit_", job_keys);
        if (to_delete_jobs.length == 0) {
            Benefit.find({notification_date: { $gte : new Date(Date.now())}, notified : false}, function (err, bens) {
                if(err) {
                    console.log("Some error");
                }
                else {
                    bens.forEach(function (ben) {
                        var j = schedule.scheduleJob("benefit_staff_" + ben.id, ben.notification_date, function () {
                            notification_schedules_helpers.notifyAndScheduleDelete(ben, users_helpers.getInterested(ben._id));
                        });
                    });
                }

            });
            Benefit.find({notification_date: {$lte : new Date(Date.now())}, notified: true}, function (err, bens) {
                if (err) {
                    console.log("Some wrong");
                }
                else {
                    bens.forEach(function (ben) {
                        notification_schedules_helpers.notifyAndScheduleDelete(ben, users_helpers.getInterested(ben._id));
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
                           else {
                               console.log("Deleted");
                           }
                       });
                    });
                }
            });
        }
    }
};


module.exports = [starter_helper, notification_schedules_helpers, users_helpers];