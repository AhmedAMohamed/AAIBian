
var Benefit = require('../models/benefit_model');
var User = require('../models/user_model');
var schedule = require('node-schedule');
var messages = require('../Strings/messeges');
var tokens = require('../Strings/validation_tokens');
var reserved_tokens = require('../Strings/reserved_tokens');
var News = require('../models/news_model');
//var FCM = require('fcm-node');


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
    get_interested : function (ben_industry) {
        User.find({subscribed_in : { $in :[ben_industry]}}, function (err, users) {
            if (err) {
                console.log("Some Error");
            }
            else {
                return users;
            }
        });
    },
    schedule_news_deletion: function (news_id) {
        var to_delete_date = new Date(Date.now());
        to_delete_date.setDate(to_delete_date.getDate() + 7);
        var j = schedule.scheduleJob("delete_news_" + news_id, to_delete_date, function () {
           News.findByIdAndRemove(news_id, function (err, obj) {
               if (err) {
                   console.log("Error");
               }
               else {
                   console.log("Deleted");
               }
           });
        });
    },
    update_user_time: function (user_id, callback) {
        User.findByIdAndUpdate(user_id, {last_login: new Date(Date.now())}, {new : true}, function (err, t) {
           if (err) {
              callback(null);
           }
           else {
             callback(t);
           }
        });
    },
    update_user_login_status: function (user_id) {
        User.findByIdAndUpdate(user_id, {login_status: reserved_tokens.old_login}, {new : true}, function (err, user) {
            if (err) {
                return null;
            }
            else {
                return user;
            }
        });
    },
    get_user_data: function(user_id, callback) {
        User.findById(user_id, function(err, user) {
            if(err) {
                console.log(err);
                callback(null);
            }
            else {
                console.log(user);
                callback(user);
            }
        });
    }
};

var notification_schedules_helpers = {
    notifyAndScheduleBenefitDeletion: function (ben, users) {
        notifyMessage(users, messages.benefit_expire(ben.name));
        ben.notified = true;
        ben.save(function (err, upBen) {
            if (err) {
                console.log("Some error");
            }
            else {
                notification_schedules_helpers.scheduleBenefitDeletion(upBen);
            }
        });
    },
    scheduleBenefitDeletion: function (ben) {
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
    },
//    notifyNews: function (title, body, id, callback) {
////        var fcm = new FCM(reserved_tokens.server_name);
////        var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
////            to: '/topics/news',
////            collapse_key: 'trial',
////
////            data: {  //you can send only notification or only data(or include both)
////                title: title,
////                Body: body,
////                id: id
////            }
////        };
////        fcm.send(message, function(err, response){
////            if (err) {
////                callback(false);
////            } else {
////                callback(true);
////            }
////        });
//    }
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
                        var j = schedule.scheduleJob("benefit_staff_" + ben.id ,ben.notification_date, function () {
                            notification_schedules_helpers.notifyAndScheduleBenefitDeletion(ben, users_helpers.get_interested(ben.industry));
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
                      notification_schedules_helpers.notifyAndScheduleBenefitDeletion(ben, users_helpers.get_interested(ben.industry));
                   });
               }
            });
        }
    },
    benefit_delete_schedule: function () {
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
                            notification_schedules_helpers.notifyAndScheduleBenefitDeletion(ben, users_helpers.get_interested(ben.industry));
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
                        notification_schedules_helpers.notifyAndScheduleBenefitDeletion(ben, users_helpers.get_interested(ben.industry));
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
    },
    news_delete_schdule: function () {
        console.log("Here is news deletion");
        var job_keys = Object.keys(schedule.scheduledJobs);
        var to_delete_jobs = selectKeys("delete_news_", job_keys);
        if (to_delete_jobs.length == 0) {
            News.find({to_delete_date: {$lte: new Date(Date.now())}}, function (err, news) {
                if (err) {
                    console.log("Some wrong");
                }
                else {
                    news.forEach(function (n) {
                       News.findByIdAndRemove(n._id, function (e, i) {
                           if (e) {
                               console.log("Some error");
                           }
                           else {
                               console.log("Removed");
                           }
                       })
                    });
                }
            });

            News.find({to_delete_data: {$gte: new Date(Date.now())}}, function (err, news) {
                if (err) {
                    console.log("Some error");
                }
                else {
                    news.forEach(function (n) {
                        var j = schedule.scheduleJob("delete_news_" + n._id, n.to_delete_date, function () {
                            News.findByIdAndRemove(n._id, function (err, ne) {
                                if (err) {
                                    console.log("Some error");
                                }
                                else {
                                    console.log("Removed");
                                }
                            });
                        });
                    });
                }
            });
        }
    }
};


module.exports = {starters: starter_helper, notifiers: notification_schedules_helpers, users:users_helpers};
