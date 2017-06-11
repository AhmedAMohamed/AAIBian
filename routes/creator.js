var express = require('express');
var csv = require('fast-csv');
var fs  = require('fs');
var path = require('path');
var usr = require('url');

var reserved_tokens = require('../Strings/reserved_tokens');

var API_KEY = require('../models/api_key_model');

var randomstring = require("randomstring");
var schedule = require('node-schedule');

var router = express.Router();

var Auth = require('../Utils/auth_layer');
var Benefit = require('../models/benefit_model');
var Medical = require('../models/medical_sector_model');
var ATM = require('../models/atm_model');
var Categories = require('../models/category_model');
var Areas = require('../models/area_model');
var startups = require('../Utils/helpers');
var types = require('../Strings/names_translations')[0];
var msg = require('../Strings/messeges');


router.post('/addBenefits', function (req, res, next) {
    if (Auth.general_creation_root.auth_check(req.body.email, req.body.password, req.body.api_key,req.body.token,
            req.body.privilege, req.body.task) || true) {
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
                    name: data[1],
                    address: data[2],
                    location: [
                        parseFloat(data[4]),
                        parseFloat(data[3])
                    ],
                    zone: data[5],
                    contacts: [data[6], data[7], data[8]],
                    industry: data[10],
                    creation_date: new Date(Date.now()),
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
                            startups[1].notifyAndScheduleBenefitDeletion(da, startups[2].get_interested(da._id));
                        });
                    }
                });
            });
            res.json(msg.valid_operation());
        });
    }
    else {
        res.json(msg.not_valid_operation());
    }
});

router.post('/addATM', function(req, res, next) {

    var dat = [[]];

    fs.createReadStream((process.env.OPENSHIFT_DATA_DIR || '../../../CSVs/') + "atm_locations.csv").pipe(csv()).
            on('data', function (data) {
                if(data.length == 6) {
                    dat.push(data);
                }
            }).on('end', function (dataLength) {
                console.log("read finished");
                var counter = 25;
                dat.forEach(function (data) {

                    var d = {
                        loc_name: data[2],
                        address: data[3],
                        location: [
                            parseFloat(data[5]),
                            parseFloat(data[4])
                        ],
                        creation_date: new Date(Date.now()),
                    };
                    var atm = new ATM(d);
                    atm.save(function (err, da) {
                        if (err) {
                            console.log(("error in inserting line"));
                        }
                        else {
                            console.log("Inserted");
                        }
                    });
                });
                res.json(msg.valid_operation());
            });
    console.log("Ahmed Alaa");
});

router.post('/addMedical', function (req, res, next) {
    if (Auth.general_creation_root.auth_check(req.body.email, req.body.password, req.body.api_key,
            req.body.token, req.body.privilege, req.body.task) || true) {
        var dat = [];
        var keys = Object.keys(types);
        keys.forEach(function (key) {
            fs.createReadStream((process.env.OPENSHIFT_DATA_DIR || '../../../CSVs/') + types[key] + ".csv" ).pipe(csv()).
            on('data', function (data) {
                dat.push(data);
                console.log(types[key]);
                if (types[key] == "معامل اشعة") {
                    var row = {
                        type : types[key],
                        id: types[key] + "_" + data[0],
                        name: data[1],
                        address: data[2],
                        zone: data[3],
                        phone_number: data[4],
//                        location: [
//                            parseFloat(data[6]),
//                            parseFloat(data[5])
//                        ]
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
                }
                else {
                    var row = {
                        type : types[key],
                        id: types[key] + "_" + data[0],
                        name: data[1],
                        address: data[2],
                        zone: data[3],
                        phone_number: data[4],
                        location: [
                            parseFloat(data[6]),
                            parseFloat(data[5])
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
                }

            }).on('end', function (dataLength) {
                console.log("finished");
            });

        });
        res.json(msg.not_valid_operation());
    }
    else {
        res.json(msg.not_valid_operation());
    }
});

router.post('/addAPI_Key', function (req, res, next) {
  var api_ke = req.body.api;
  console.log("Ahmed called it and it is " + api_ke);
  var api = {
    api_key: sha1(api_ke) + randomstring.generate(7),
    creation_date: new Date(Date.now()),
    valid_for: [reserved_tokens.all_user_api_key]
  };
  var ap = new API_KEY(api);
  ap.save(function(err, a) {
    if (err) {
      console.log("Error");
      res.json(msg.interna_error());
    }
    else {
      console.log("Valid");
      res.json(msg.valid_operation());
    }
  });
  res.json("Alaa");
});

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});

router.get('/trial/:id', function(req, res, next) {
    console.log(req.headers);
    res.json(req.params.id);

});

router.get('/add_areas', function(req, res, next) {
    Benefit.find().distinct('zone', function(err, bens) {
        if(err) {
            console.log("Error");
        }
        else {
            bens.forEach(function(area) {
                var a = {
                    name: area,
                    search_name: area,
                    sector: 'ben',
                    creation_date: new Date(Date.now())
                }
                var ar = new Areas(a);
                ar.save(function(err, area) {
                    if (err) {
                        console.log("Error");
                    }
                    else {
                        console.log("Inserted");
                    }
                });
            })
        }
    });
    Medical.find().distinct('zone', function(err, meds) {
        if(err) {
            console.log("Error");
        }
        else {
            meds.forEach(function(area) {
                var a = {
                    name: area,
                    search_name: area,
                    sector: 'med',
                    creation_date: new Date(Date.now())
                };
                var ar = new Areas(a);
                ar.save(function(err, area) {
                    if(err) {
                        console.log("Error");
                    }
                    else {
                        console.log("Inserted");
                    }
                });
            });
        }
    });
    ATM.find().distinct('loc_name', function(err, atms) {
        if (err) {
            console.log("Error");
        }
        else {
            atms.forEach(function(area) {
                var a = {
                    name: area,
                    search_name: area,
                    sector: 'atm',
                    creation_date: new Date(Date.now())
                };
                var ar = new Areas(a);
                ar.save(function(err, area) {
                    if(err) {
                        console.log("error");
                        console.log(err);
                    }
                    else {
                        console.log("Inserted");
                    }
                });
            });
        }
    });
    res.json({"done": "hhefas"});
});

router.get('/add_categories', function(req, res, next) {
    Benefit.find().distinct('industry', function(err, bens) {
        if(err) {
            console.log("Error");
        }
        else {
            bens.forEach(function(cat) {
                var a = {
                    name: cat,
                    search_name: cat,
                    sector: 'ben',
                    img_path: "data/logos/" + (cat.toLowerCase()).replace(/ /g, "_") + '.png',
                    creation_date: new Date(Date.now())
                }
                var ar = new Categories(a);
                ar.save(function(err, area) {
                    if (err) {
                        console.log("Error");
                    }
                    else {
                        console.log("Inserted B");
                    }
                });
            })
        }
    });
    Medical.find().distinct('type', function(err, meds) {
        var utf8 = require('utf8');
        if(err) {
            console.log("Error");
        }
        else {
            meds.forEach(function(cat) {
                var path = "data/logos/";
                if (cat == "اسنان") {
                    path += "dent.png";
                }
                else if (cat == "انف و اذن") {
                    path += "nose.png";
                }
                else if (cat == "باطنة") {
                    path += "stom.png";
                }
                else if (cat == "جلدية") {
                    path += "skin.png";
                }
                else if (cat == "علاج طبيعي") {
                    path += "natural.png";
                }
                else if (cat == "عيون") {
                    path += "eye.png";
                }
                else if (cat == "عظام") {
                    path += "bone.png";
                }
                else if (cat == "جراحة") {
                    path += "surg.png";
                }
                else if (cat == "صدر و قلب") {
                    path += "chest.png";
                }
                else  if (cat == "مسالك بولية") {
                    path += "masalek.png";
                }
                else if (cat == "مستشفيات") {
                    path += "hospitals.png";
                }
                else if (cat == "معامل تحاليل") {
                    path += "ta7lel.png";
                }
                else if (cat == "معامل أشعة") {
                    path += "xray.png";
                }
                var a = {
                    name: cat,
                    search_name: cat,
                    sector: 'med',
                    img_path: path,
                    creation_date: new Date(Date.now())
                };
                var ar = new Categories(a);
                ar.save(function(err, area) {
                    if(err) {
                        console.log("Error");
                    }
                    else {
                        console.log("Inserted M");
                    }
                });
            })
        }
    });
    res.json({"done": "hhefas"});
});


router.get('/test_notification', function(req, res, next) {
    var FCM = require('fcm-node');

    var serverKey = 'AAAA6_tt21g:APA91bGY8TlMcQxbiHzwpuly5vdZE92gbgGNAF_yaBMG0wIEdQUxMsk_xk4VlrtJB_9FA' +
    '-ruy1dMpA3XNOFaZwcYll2nMgF1c0GGaYE7sQIRAnpYIZXEqZVMGNXOe9_-GxYs2SQOrR2h'; //put your server key here
    var fcm = new FCM(serverKey);
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: '/topics/news',
        collapse_key: 'trial',

        data: {  //you can send only notification or only data(or include both)
            title: 'Ahmed',
            Body: 'my another value',
            id: "ahmed alaa "
        }
    };
    fcm.send(message, function(err, response){
            if (err) {
                console.log("Something has gone wrong!");
            } else {

                console.log("Successfully sent with response: ", response);
                res.json({
                    valid: true,
                    msg: "Done",

                });
            }
        });
});

module.exports = router;