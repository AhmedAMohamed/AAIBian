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

var User = require('../models/user_model');
var Auth = require('../Utils/auth_layer');
var Benefit = require('../models/benefit_model');
var Medical = require('../models/medical_sector_model');
var ATM = require('../models/atm_model');
var CardHolder = require('../models/cardholder_model');
var Categories = require('../models/category_model');
var Groups = require('../models/group_model');
var News = require('../models/news_model');
var Areas = require('../models/area_model');
var startups = require('../Utils/helpers');
var types = require('../Strings/names_translations')[0];
var msg = require('../Strings/messeges');


router.post('/addBenefits', function (req, res, next) {
    if (Auth.general_creation_root.auth_check(req.body.email, req.body.password, req.body.api_key,req.body.token,
            req.body.privilege, req.body.task) || true) {
        var dat = [[]];
        fs.createReadStream((process.env.OPENSHIFT_DATA_DIR || '/Users/ahmedalaa/Desktop/aaib_data/') + "branches_data_final.csv").pipe(csv()).
        on('data', function (data) {
            if(data.length >= 12) {
                dat.push(data);
            }
        }).on('end', function (dataLength) {
            console.log("read finished");
            
            dat.forEach(function (data) {
                var notify_date = new Date(Date.now());
                notify_date.setFullYear(notify_date.getFullYear()+1);
                var dl = (String)(data[13]).split("/");
                if(dl.length == 3) {
                    var notify_date = new Date(dl[0],dl[1]-1,dl[2]);
                }
                
                var to_delete_date = new Date(notify_date);
                to_delete_date.setHours(to_delete_date.getHours() + 3);

                var d = {
                    name: data[1],
                    address: data[4],
                    location: [
                        data[3],
                        data[2]
                    ],
                    zone: data[5],
                    group : data[6] == "" ? "General" : data[6],
                    sector : 'ben',
                    industry : data[8],
                    offer : data[9],
                    contacts: [data[10], data[11], data[12]],
                    creation_date: new Date(Date.now()),
                    notification_date: notify_date,
                    deleteDate: to_delete_date,
                    notified: false,
                    img_path: '/data/logos/' + (data[13]=="" ? 'trial' : data[13]) + '.png',
                    index : data[0]
                };
                var benefit = new Benefit(d);
                benefit.save(function (err, da) {
                    if (err) {
                        console.log(err);
                        console.log(("error in inserting line"));
                    }
                    else {
                        console.log("Notify id " + da.id + " at " + da.notification_date);
                        console.log("Delete id " + da.id + " at " + da.deleteDate);
                        console.log("row inserted");
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
    fs.createReadStream((process.env.OPENSHIFT_DATA_DIR || '/Users/ahmedalaa/Desktop/aaib_data/') + "atm.csv").pipe(csv()).
            on('data', function (data) {
                // if(data.length == 12) {
                    dat.push(data);
                // }
            }).on('end', function (dataLength) {
                console.log("read finished");
                var counter = 25;
                dat.forEach(function (data) {

                    var d = {
                        loc_name: data[1],
                        address: data[4],
                        location: [
                            parseFloat(data[3]),
                            parseFloat(data[2])
                        ],
                        creation_date: new Date(Date.now()),
                        zone : data[5],
                        group : data[6],
                        offer : data[9]
                    };
                    var atm = new ATM(d);
                    atm.save(function (err, da) {
                        if (err) {
                            console.log(err);
                            console.log(("error in inserting line"));
                        }
                        else {
                            console.log("Inserted");
                        }
                    });
                });
                res.json(msg.valid_operation());
            });
});

router.post('/addMedical', function (req, res, next) {
    console.log("in add medical");
    if (true) {
        var dat = [];
        fs.createReadStream('/Users/ahmedalaa/Desktop/aaib_data/' + "med.csv" ).pipe(csv()).
        on('data', function (data) {
            dat.push(data);
            var to_delete_date = new Date(Date.now());
            to_delete_date.setFullYear(to_delete_date.getFullYear() + 1);
            var row = {
                type : data[8],
                id: data[0],
                name: data[1],
                address: data[4],
                zone: data[5],
                phone_number: [data[10], data[11],data[12]],
                location: [
                    parseFloat(data[3]),
                    parseFloat(data[2])
                ],
                group : data[6],
                offer: data[9],
                deleteDate: to_delete_date,
                creation_date: new Date(Date.now())
            }
            var medical = new Medical(row);
            medical.save(function (err, dent) {
                if (err) {
                    console.log(err);
                    return;
                    console.log("Some error");
                }
                else {
                    console.log("Done row in " + data[0]);
                }
            })
        }).on('end', function (dataLength) {
            console.log("finished");
        });
    
        res.json(msg.not_valid_operation());
    }
    else {
        res.json(msg.not_valid_operation());
    }
});

router.post('/addCardHolder', function (req, res, next) {
    
    if (true) {
        var dat = [];
        fs.createReadStream('/Users/ahmedalaa/Desktop/aaib_data/' + "card.csv" ).pipe(csv()).
        on('data', function (data) {
            dat.push(data);
            var to_delete_date = new Date(Date.now());
            to_delete_date.setFullYear(to_delete_date.getFullYear() + 1);
            var row = {
                name: data[1],
                offer: data[9],
                type: data[8],
                address: data[4],
                location: [
                    data[3],
                    data[2]
                ],
                group : data[6],
                zone: data[5],
                contacts: [data[10], data[11], data[12]],
                notification_date: new Date(Date.now()),
                deleteDate: to_delete_date,
                creation_date: new Date(Date.now())
            }
            var medical = new CardHolder(row);
            medical.save(function (err, dent) {
                if (err) {
                    console.log(err);
                    return;
                    console.log("Some error");
                }
                else {
                    console.log("Done row in " + data[0]);
                }
            })
        }).on('end', function (dataLength) {
            console.log("finished");
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
        if(err) {
            console.log("Error");
        }
        else {
            meds.forEach(function(cat) {
                var path = "data/logos/";
                if (cat == "اسنان") {
                    path += "dent.png";
                }
                else if (cat == "انف واذن") {
                    path += "nose.png";
                }
                else if (cat == "باطنة") {
                    path += "stom.png";
                }
                else if (cat == "جلدية") {
                    path += "skin.png";
                }
                else if (cat == "علاج طبيعى") {
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
    ATM.find().distinct('zone', function(err, atms) {
        if(err) {
            console.log(err);
        }
        else {
            atms.forEach(function(cat) {
                var a = {
                    name: cat,
                    search_name: cat,
                    sector: 'atm',
                    creation_date: new Date(Date.now())
                };
                var ar = new Categories(a);
                ar.save(function(err, arr) {
                    if(err) {
                        console.log("Error")
                    }
                    else {
                        console.log("Inserted");
                    }
                });
            });
        }
    })
    res.json({"done": "hhefas"});
});


router.get('/test_notification', function(req, res, next) {

    var FCM = require('fcm-node');

    var serverKey = 'AAAA6_tt21g:APA91bGY8TlMcQxbiHzwpuly5vdZE92gbgGNAF_yaBMG0wIEdQUxMsk_xk4VlrtJB_9FA' +
    '-ruy1dMpA3XNOFaZwcYll2nMgF1c0GGaYE7sQIRAnpYIZXEqZVMGNXOe9_-GxYs2SQOrR2h'; //put your server key here

    News.find({}, function(err, news) {
        if (err) {
            res.json(msg.not_valid_operation());
        }
        else {
            var fcm = new FCM(serverKey);
            var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                to: '/topics/news',
                collapse_key: 'trial',
                notification: {
                    "body" : "This week’s edition is now available.",
                    "title": "Portugal vs. Denmark",
                },
                data: news[0],
                priority : "high"
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
        }
    });
});


router.post('/addCategories', function (req, res, next) {
    if (Auth.general_creation_root.auth_check(req.body.email, req.body.password, req.body.api_key,req.body.token,
            req.body.privilege, req.body.task) || true) {
        var dat = [[]];
        fs.createReadStream((process.env.OPENSHIFT_DATA_DIR || '/Users/ahmedalaa/Desktop/aaib_data/') + "category.csv").pipe(csv()).
        on('data', function (data) {
            if(data.length == 3) {
                dat.push(data);
            }
        }).on('end', function (dataLength) {
            console.log("read finished");
            var counter = 25;
            dat.forEach(function (data) {
                var d = {
                    name: data[1],
                    search_name: data[1],
                    creation_date: new Date(Date.now())
                };
                if(data[2] == "Staff Beneffits") {
                    d.sector = "ben";
                }
                else if(data[2] == "Medical Benefits") {
                    d.sector = "med";
                }
                else if(data[2] == "ATMs") {
                    d.sector = "atm";
                }
                else if(data[2] == "CardHolder") {
                    d.sector = "card";
                }
                var cat = new Categories(d);
                cat.save(function(err,c) {
                    if(err) console.log("row not inserted");
                    else {
                        console.log("row inserted");
                    }
                })
            });
            res.json(msg.valid_operation());
        });
    }
    else {
        res.json(msg.not_valid_operation());
    }
});

router.post('/addAreas', function (req, res, next) {
    if (Auth.general_creation_root.auth_check(req.body.email, req.body.password, req.body.api_key,req.body.token,
            req.body.privilege, req.body.task) || true) {
        var dat = [[]];
        fs.createReadStream((process.env.OPENSHIFT_DATA_DIR || '/Users/ahmedalaa/Desktop/aaib_data/') + "area.csv").pipe(csv()).
        on('data', function (data) {
            if(data.length == 3) {
                dat.push(data);
            }
        }).on('end', function (dataLength) {
            console.log("read finished");
            var counter = 25;
            dat.forEach(function (data) {
                var d = {
                    name: data[1],
                    search_name: data[1],
                    creation_date: new Date(Date.now()),
                    sector: data[2]
                };
                var arr = new Areas(d);
                arr.save(function(err,c) {
                    if(err) console.log("row not inserted");
                    else {
                        console.log("row inserted");
                    }
                })
            });
            res.json(msg.valid_operation());
        });
    }
    else {
        res.json(msg.not_valid_operation());
    }
});

router.post('/addGroups', function (req, res, next) {
    if (Auth.general_creation_root.auth_check(req.body.email, req.body.password, req.body.api_key,req.body.token,
            req.body.privilege, req.body.task) || true) {
        var dat = [[]];
        fs.createReadStream((process.env.OPENSHIFT_DATA_DIR || '/Users/ahmedalaa/Desktop/aaib_data/') + "group.csv").pipe(csv()).
        on('data', function (data) {
            if(data.length == 3) {
                dat.push(data);
            }
        }).on('end', function (dataLength) {
            console.log("read finished");
            var counter = 25;
            dat.forEach(function (data) {
                var d = {
                    name: data[1],
                    search_name: data[1],
                    creation_date: new Date(Date.now()),
                    sector: data[2]
                };
                var arr = new Groups(d);
                arr.save(function(err,c) {
                    if(err) console.log("row not inserted");
                    else {
                        console.log("row inserted");
                    }
                })
            });
            res.json(msg.valid_operation());
        });
    }
    else {
        res.json(msg.not_valid_operation());
    }
});

router.post('/addUsers', function (req, res, next) {
    if (Auth.general_creation_root.auth_check(req.body.email, req.body.password, req.body.api_key,req.body.token,
            req.body.privilege, req.body.task) || true) {
        var dat = [[]];
        fs.createReadStream((process.env.OPENSHIFT_DATA_DIR || '/Users/ahmedalaa/Desktop/aaib_data/') + "users.csv").pipe(csv()).
        on('data', function (data) {
            if(data.length == 2) {
                dat.push(data);
            }
        }).on('end', function (dataLength) {
            console.log("read finished");
            var counter = 25;
            dat.forEach(function (data) {
                var d = {
                    name: data[1],
                    password: "new_user123",
                    email: data[0],
                    privilege: "",
                    subscribed_in: [""],
                    area: "Cairo",
                    job_desc: "User"
                };
                var arr = new User(d);
                arr.save(function(err,c) {
                    if(err) console.log("row not inserted");
                    else {
                        console.log("row inserted");
                    }
                })
            });
            res.json(msg.valid_operation());
        });
    }
    else {
        res.json(msg.not_valid_operation());
    }
});

module.exports = router;