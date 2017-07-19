var path = require('path');
var multiparty = require('connect-multiparty');
var util = require('util')
var express = require('express');
var fs = require('fs');
var router = express.Router();
var mongoose = require('mongoose');

var Auth = require('../Utils/auth_layer');
var User = require('../models/user_model');
var Areas = require('../models/area_model');
var Categories = require('../models/category_model');
var API_Key = require('../models/api_key_model');
var Cardholder = require('../models/cardholder_model');
var reserved_tokens = require('../Strings/reserved_tokens');
var validation_tokens = require('../Strings/validation_tokens');
var messeges = require('../Strings/messeges');
var tokens = require('../Strings/validation_tokens');
var ATMs = require('../models/atm_model');
var Benefit = require('../models/benefit_model');
var Medical = require('../models/medical_sector_model');
var News = require('../models/news_model');
var FeedBack = require('../models/feedback_model');
var Privilege = require('../models/privileges_model');
var helpers = require('../Utils/helpers');
var schedule = require('node-schedule');
var sha1 = require('sha1');
var randomstring = require("randomstring");
var FCM = require('fcm-node');


router.post('/add_user', function (req, res) {
    Auth.auth_check(req.body.user_id, req.body.api_key, function(key) {
      if (key) {
          Auth.check_admin(req.body.user_id, req.body.privilege, reserved_tokens.function_name.add_user, function(user) {
              if (user) {
                  var new_user_data = req.body.new_user;
                  var data = {
                      email: new_user_data.email,
                      password: new_user_data.password,
                      name: new_user_data.name,
                      privilege: (new_user_data.privilege == tokens.privilege.GM && user.privilege == tokens.privilege.root)
                          ?tokens.privilege.root : new_user_data.privilege,
                      subscribed_in: ["VALID_FOR_ALL"],
                      login_status: reserved_tokens.first_login,
                      last_login: new Date(Date.now())
                  };
                  var new_user = new User(data);
                  new_user.save(function (err, emp) {
                      if (err) {
                        res.json(messeges.interna_error());
                      }
                      else {
                          res.json(messeges.valid_operation());
                      }
                  });
              }
              else {
                res.json(messeges.not_valid_operation());
              }
          });
      }
      else {
        res.json(messeges.not_valid_operation());
      }
    });
});

router.post('/add_news', multiparty() , function (req, res) {
    var user_id = req.body.user_id;
    var api_key = req.body.api_key;
    var privilege = req.body.privilege;
    var news = req.body.news;
    Auth.auth_check(user_id, api_key, function(validations) {
        if(validations) {
            Auth.check_admin(user_id, privilege, reserved_tokens.function_name.add_news, function(user) {
                if(user) {
                    var to_delete_date = new Date(Date.now());
                    to_delete_date.setDate(to_delete_date.getDate() + 7);
                    var file_temp_path = req.files.file.path;
                    var file_name = req.files.file.originalFilename;
                    var file_name_path = randomstring.generate(7) + file_name;
                    var newPath = reserved_tokens.upload_dir + '/' + file_name_path;
                    fs.readFile(file_temp_path, function (err, data) {
                        if (err) {
                            res.json(messeges.interna_error());
                        }
                        else {
                            var writeStream = fs.createWriteStream(newPath);
                            writeStream.write(data);
                            writeStream.end();
                            var data = {
                               title: req.body.news.title,
                               Body: req.body.news.Body,
                               creation_date: new Date(Date.now()),
                               to_delete_date: to_delete_date,
                               media_path: "/data/uploads/" + file_name_path,
                               creator: user_id
                           };
                           var news = new News(data);
                           news.save(function(err, sNews) {
                               if(err) {
                                   res.json(messeges.interna_error());
                               }
                               else {
                                   fs.unlink(file_temp_path);
                                   helpers['users'].schedule_news_deletion(sNews._id);
                                   helpers['notifiers'].notifyNews(sNews, function(valid) {
                                      if(valid) {
                                          res.json(messeges.valid_operation());
                                      }
                                      else {
                                          res.json(messeges.not_valid_operation());
                                      }
                                   });
                               }
                           });
                        }
                    });
                }
                else {
                    res.json(messeges.not_valid_operation());
                }
            });
        }
        else {
            res.json(messeges.not_valid_operation());
        }
    });
});

router.post('/add_category', multiparty(), function(req, res, next) {
    Auth.auth_check(req.body.user_id, req.body.api_key, function(key) {
       if (key) {
            Auth.check_admin(req.body.user_id, req.body.privilege, reserved_tokens.function_name.add_cat, function(user) {
                if (user) {
                    var file_temp_path = req.files.file.path;
                    var file_name = req.files.file.originalFilename;
                    var file_new_name = randomstring.generate(7) + file_name;
                    var file_upload_path = reserved_tokens.upload_dir + '/' +  file_new_name;
                    fs.readFile(file_temp_path, function(err, data) {
                        fs.writeFile(file_upload_path, data, function(err) {
                            if (err) {
                                res.json(messeges.interna_error());
                            }
                            else {
                                var dat = {
                                    sector: req.body.new_category.sector,
                                    name: req.body.new_category.name,
                                    search_name: req.body.new_category.name,
                                    creation_date: new Date(Date.now()),
                                    img_path: "data/uploads/" + file_new_name
                                };

                                var cat = new Categories(dat);
                                fs.unlink(file_temp_path);
                                cat.save(function(err, sCat) {
                                   if (err) {
                                       res.json(messeges.interna_error());
                                   }
                                   else {
                                       res.json(messeges.valid_operation());
                                   }
                                });
                            }
                        });
                    });
                }
                else {
                    res.json(messeges.not_valid_operation());
                }
            });
       }
       else {
          res.json(messeges.not_valid_operation());
       }
    });
});

router.post('/add_area', function(req, res, next) {
  Auth.auth_check(req.body.user_id, req.body.api_key, function(key) {
    if (key) {
      Auth.check_admin(req.body.user_id, req.body.privilege, reserved_tokens.function_name.add_area, function(user) {
        if (user) {
            var new_area_data = req.body.new_area;
            var d = {
                name: new_area_data.name,
                search_name: new_area_data.name,
                sector: new_area_data.sector,
                creation_date: new Date(Date.now())
            };
            var aArea = new Areas(d);
            aArea.save(function(err, area) {
                if (err) {
                    res.json(messeges.interna_error());
                }
                else {
                    res.json(messeges.valid_operation());
                }
            });
        }
        else {
          res.json(messeges.not_valid_operation());
        }
      });
    }
    else {
        res.json(messeges.not_valid_operation())
    }
  });
});

router.post('/add_benefit', multiparty(), function(req, res, next) {

    Auth.auth_check(req.body.user_id, req.body.api_key, function(key) {
        if (key) {
          Auth.check_admin(req.body.user_id, req.body.privilege, reserved_tokens.function_name.add_benefit, function(user) {
            if (user) {
                var counter = 7;
                var file_temp_path = req.files.file.path;
                var file_name = req.files.file.originalFilename;
                if (req.files.file.type.indexOf('pdf') == -1) {
                    console.log("NOt valid");
                    res.json({
                        valid: false,
                        msg: "Can not upload this type of files",
                    });
                }
                else {
                    var file_new_name =  randomstring.generate(7) + file_name;
                    var file_upload_path = reserved_tokens.upload_dir + '/' + file_new_name;
                    fs.readFile(file_temp_path, function(err, data) {
                        fs.writeFile(file_upload_path, data, function(err) {
                            if (err) {
                                res.json(messeges.interna_error());
                            }
                            else {
                                var notify_date = new Date(Date.now());
                                notify_date.setSeconds(notify_date.getSeconds() + counter);
                                notify_date.setMinutes(notify_date.getMinutes() + 1);
                                notify_date.setFullYear(notify_date.getFullYear() + 1);

                                var to_delete_date = req.body.new_benefit.delete_date;

                                counter += 30;
                                var d = {
                                    name: req.body.new_benefit.name,
                                    address: req.body.new_benefit.address,
                                    location: [
                                        parseFloat(req.body.new_benefit.location.lat),
                                        parseFloat(req.body.new_benefit.location.lng)
                                    ],
                                    zone: req.body.new_benefit.zone,
                                    contacts: req.body.new_benefit.contacts,
                                    industry: req.body.new_benefit.industry,
                                    creation_date: new Date(Date.now()),
                                    notification_date: notify_date,
                                    deleteDate: to_delete_date,
                                    notified: false,
                                    offer: req.body.new_benefit.offer,
                                    pdf_path: "/data/uploads/" + file_new_name
                                };
                                var benefit = new Benefit(d);
                                benefit.save(function (err, da) {
                                    if (err) {
                                        res.json(messeges.not_valid_operation());
                                    }
                                    else {
                                        console.log("Notify id " + da.id + " at " + da.notification_date);
                                        console.log("Delete id " + da.id + " at " + da.deleteDate);
                                        var j = schedule.scheduleJob("benefit_staff_" + da.id, da.notification_date, function () {
                                            helpers[1].notifyAndScheduleBenefitDeletion(da, helpers[2].get_interested(da._id));
                                        });
                                        res.json(messeges.valid_operation());
                                    }
                                });
                            }
                        })
                    });
                }

            }
            else {
                res.json(messeges.not_valid_operation());
            }
          });
        }
        else {
            res.json(messeges.not_valid_operation());
        }
    });
});

router.post('/add_atm', function(req, res, next) {
    Auth.auth_check(req.body.user_id, req.body.api_key, function(key) {
          if (key) {
              Auth.check_admin(req.body.user_id, req.body.privilege, reserved_tokens.function_name.add_atm, function(user) {
                  if (user) {
                    var d = {
                        loc_name: req.body.new_atm.loc_name,
                        address: req.body.new_atm.address,
                        creation_date: new Date(Date.now()),
                        location: [
                            parseFloat(req.body.new_atm.location.lat),
                            parseFloat(req.body.new_atm.location.lng),
                        ],
                        zone: req.body.new_atm.city,
                        id: req.body.new_atm.id
                    };
                    var atm = new ATMs(d);
                    atm.save(function(err, nATM) {
                        if (err) {
                            res.json(messeges.interna_error());
                        }
                        else {
                            res.json(messeges.valid_operation());
                        }
                    });
                  }
                  else {
                    res.json(messeges.not_valid_operation());
                  }
              });
          }
          else {
            res.json(messeges.not_valid_operation());
          }
    });
});

router.post('/add_medical', multiparty(), function(req, res, next) {

    Auth.auth_check(req.body.user_id, req.body.api_key, function(key) {
        if (key) {
          Auth.check_admin(req.body.user_id, req.body.privilege, reserved_tokens.function_name.add_medical, function(user) {
            if (user) {
                var file_temp_path = req.files.file.path;
                var file_name = req.files.file.originalFilename;
                if (req.files.file.type.indexOf('pdf') == -1) {
                    console.log("NOt valid");
                    res.json({
                        valid: false,
                        msg: "Can not upload this type of files",
                    });
                }
                else {
                    var file_new_name =  randomstring.generate(7) + file_name;
                    var file_upload_path = reserved_tokens.upload_dir + '/' + file_new_name;
                    fs.readFile(file_temp_path, function(err, data) {
                        fs.writeFile(file_upload_path, data, function(err) {
                            if (err) {
                                console.log(err);
                                console.log("not valid");
                                res.json(messeges.interna_error());
                            }
                            else {
                                console.log(req.body);
                                var d = {
                                    name: req.body.new_medical.name,
                                    address: req.body.new_medical.address,
                                    location: [
                                        parseFloat(req.body.new_medical.location.lat),
                                        parseFloat(req.body.new_medical.location.lng)
                                    ],
                                    zone: req.body.new_medical.zone.name,
                                    type: req.body.new_medical.type.name,
                                    phone_number: req.body.new_medical.phone_numbers,
                                    id: new Date(Date.now()).getTime(),
                                    pdf_path: "/data/uploads/" + file_new_name,
                                    creation_date: new Date(Date.now()),
                                    notification_date: new Date(Date.now()),
                                    deleteDate: req.body.new_medical.delete_date,
                                    offer: req.body.new_medical.offer
                                };
                                var medical = new Medical(d);
                                medical.save(function (err, da) {
                                    if (err) {
                                        res.json(messeges.not_valid_operation());
                                    }
                                    else {
                                        res.json(messeges.valid_operation());
                                    }
                                });
                            }
                        })
                    });
                }
            }
            else {
                res.json(messeges.not_valid_operation());
            }
          });
        }
        else {
            res.json(messeges.not_valid_operation());
        }
    });
});

router.post('/add_cardholder', multiparty(), function(req, res, next) {
    Auth.auth_check(req.body.user_id, req.body.api_key, function(key) {
        if (key) {
            Auth.check_admin(req.body.user_id, req.body.privilege, reserved_tokens.function_name.add_cardholder, function(user) {
                if (user) {
                    console.log(req);
                    var file_temp_path = req.files.file.path;
                    var file_name = req.files.file.originalFilename;
                    if (req.files.file.type.indexOf('pdf') == -1) {
                        console.log("NOt valid");
                        res.json({
                            valid: false,
                            msg: "Can not upload this type of files",
                        });
                    }
                    else {
                        var file_new_name =  randomstring.generate(7) + file_name;
                        var file_upload_path = reserved_tokens.upload_dir + '/' + file_new_name;
                        fs.readFile(file_temp_path, function(err, data) {
                            fs.writeFile(file_upload_path, data, function(err) {
                                if (err) {
                                    res.json(messeges.interna_error());
                                }
                                else {
                                    console.log(req.body.new_cardholder)
                                    var d = {
                                        name: req.body.new_cardholder.name,
                                        type: req.body.new_cardholder.type,
                                        offer: req.body.new_cardholder.offer,
                                        address: req.body.new_cardholder.address,
                                        location: [
                                            parseFloat(req.body.new_cardholder.location.lat),
                                            parseFloat(req.body.new_cardholder.location.lng)
                                        ],
                                        zone:  req.body.new_cardholder.zone,
                                        contacts:  req.body.new_cardholder.contacts,
                                        notification_date: new Date(Date.now()),
                                        deleteDate: req.body.new_cardholder.delete_date,
                                        creation_date: new Date(Date.now()),
                                        pdf_path: "/data/uploads/" + file_new_name
                                    };
                                    var card = new Cardholder(d);
                                    card.save(function(err, nCard) {
                                        if (err) {
                                            console.log(err);
                                            res.json(messeges.interna_error());
                                        }
                                        else {
                                            res.json(messeges.valid_operation());
                                        }
                                    });
                                }
                            })
                        });
                    }
                }
                else {
                    res.json(messeges.not_valid_operation());
                }
            });
        }
        else {
            res.json(messeges.not_valid_operation());
        }
    });
});


router.post('/delete_user', function(req, res, next) {
    var id = req.body.to_delete_id;
    console.log(req.body);
    console.log("this is the ID");
    console.log(id);
    User.findByIdAndRemove(id, function(err) {
        if (err) {

            res.json(messeges.not_valid_operation());
        }
        else {
            console.log("Ahmed Alaa Remove");
            res.json(messeges.valid_operation());
        }
    });
});

router.post('/delete_feedback', function(req, res, next) {
    var id = req.body.to_delete_id;
    console.log(req.body);
    console.log("this is the ID");
    console.log(id);
    FeedBack.findByIdAndRemove(id, function(err) {
        if (err) {

            res.json(messeges.not_valid_operation());
        }
        else {
            console.log("Ahmed Alaa Remove 2");
            res.json(messeges.valid_operation());
        }
    });
});

router.post('/delete_atm', function(req, res, next) {
    var id = req.body.to_delete_id;
    ATMs.findByIdAndRemove(id, function(err) {
        if (err) {
            res.json(messeges.not_valid_operation());
        }
        else {
            res.json(messeges.valid_operation());
        }
    });
});

router.post('/delete_cards', function(req, res, next) {
    var id = req.body.to_delete_id;
    Cardholder.findByIdAndRemove(id, function(err) {
        if (err) {

            res.json(messeges.not_valid_operation());
        }
        else {
            res.json(messeges.valid_operation());
        }
    });
});

router.post('/delete_benefit', function(req, res, next) {
    var id = req.body.to_delete_id;
    Benefit.findByIdAndRemove(id, function(err) {
        if (err) {
            res.json(messeges.not_valid_operation());
        }
        else {
            res.json(messeges.valid_operation());
        }
    });
});

router.post('/delete_medical', function(req, res, next) {
    var id = req.body.to_delete_id;
    Medical.findByIdAndRemove(id, function(err) {
        if (err) {

            res.json(messeges.not_valid_operation());
        }
        else {
            res.json(messeges.valid_operation());
        }
    });
});

router.post('/delete_area', function(req, res, next) {
    var id = req.body.to_delete_id;
    Areas.findByIdAndRemove(id, function(err) {
        if (err) {

            res.json(messeges.not_valid_operation());
        }
        else {
            res.json(messeges.valid_operation());
        }
    });
});

router.post('/delete_category', function(req, res, next) {
    var id = req.body.to_delete_id;
    Categories.findByIdAndRemove(id, function(err) {
        if (err) {

            res.json(messeges.not_valid_operation());
        }
        else {
            res.json(messeges.valid_operation());
        }
    });
});

router.post('/delete_news', function(req, res, next) {
    var id = req.body.to_delete_id;
    News.findByIdAndRemove(id, function(err) {
        if (err) {
            res.json(messeges.not_valid_operation());
        }
        else {
            res.json(messeges.valid_operation());
        }
    });
});


router.get('/get_privilege/:privilege', function(req, res, next) {
    var privilege = req.params.privilege;
    if (privilege == validation_tokens.privilege.GM) {
        var respond = {
            valid: true,
            functions: reserved_tokens.function_name,
            msg: "Done"
        };
        res.json(respond);
    }
    else if (privilege == validation_tokens.privilege.root) {
        Privilege.find({}, function(err, privileges) {
            if(err) {
                res.json(messeges.interna_error());
            }
            else {
                var privilege = privileges[0];
                console.log(privilege);
                res.json({
                    valid: true,
                    msg: "Done",
                    functions: privilege.root
                });
            }
        });
    }
    else if (privilege == validation_tokens.privilege.admin) {
        Privilege.find({}, function(err, privileges) {
            if(err) {
                res.json(messeges.interna_error());
            }
            else {
                var privilege = privileges[0];
                console.log(privilege);
                res.json({
                    valid: true,
                    msg: "Done",
                    functions: privilege.admin
                });
            }
        });
    }
    else {
        res.json(messeges.not_valid_operation());
    }
});

router.post('/set_privilege', function(req, res, next) {
    API_Key.find({api_key: req.body.api_key}, function(err, valid) {
        if (err) {
            res.json(messeges.not_valid_operation());
        }
        else {
            if (valid.length == 1) {
                Auth.check_admin(req.body.user_id, req.body.privilege,
                   reserved_tokens.function_name.set_privilege, function(user) {
                    if (user) {
                        Privilege.find({}, function(err, privileges) {
                            if (err) {
                                res.json(messeges.interna_error());
                            }
                            else {
                                if (privileges.length == 1) {
                                    privileges[0].root = req.body.request.root_privilege;
                                    privileges[0].admin = req.body.request.admin_privilege;
                                    privileges[0].last_update = new Date(Date.now());
                                    privileges[0].save(function(err, p) {
                                        if (err) {
                                            res.json(messeges.interna_error());
                                        }
                                        else {
                                            res.json(messeges.valid_operation());
                                        }
                                    });
                                }
                                else {
                                    if (privileges.length > 1) {
                                        res.json(messeges.interna_error());
                                    }
                                    else {
                                        var p = {
                                            root: req.body.request.root_privilege,
                                            admin: req.body.request.admin_privilege,
                                            last_update: new Date(Date.now())
                                        };
                                        var pri = new Privilege(p);
                                        pri.save(function(err, pr) {
                                            if(err) {
                                                res.json(messeges.interna_error());
                                            }
                                            else {
                                                res.json(messeges.valid_operation());
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    }
                    else {
                        res.json(messeges.not_valid_operation());
                    }
                });
            }
            else {
                res.json(messeges.not_valid_operation());
            }
        }
    });
});


router.post('/add_GM', function(req, res) {
  var data = {
    name: "System General admin",
    password: "JustForTrial",
    privilege: tokens.privilege.GM,
    subscribed_in: [reserved_tokens.all_user_api_key],
    email: "trial@aaib.com"
  };
  var x = new User(data);
  x.save(function(err, d) {
    if (err) {
      res.json(err);
    }
    else {
      console.log(d._id);
      res.json("Valid");
    }
  });
});


router.post('/list_users', function(req, res, next) {

  User.find({}, function(err, users) {
    if(err) {
      res.json({
        valid: false,
        msg: "Internal Error"
      });
    }
    else {
      res.json({
        valid : true,
        result : users,
        msg : "Done"
      })
    }
  })
});

router.post('/show_feedbacks', function(req, res, next) {
    FeedBack.find({}, function(err, feedbacks) {
        if(err) {
            res.json(messeges.not_valid_operation());
        }
        else {
            console.log(feedbacks);
            res.json({
                valid: true,
                msg: "Done",
                result: feedbacks
            });
        }
    });
});

router.post('/show_news', function(req, res, next) {
    News.find({}, function(err, news) {
        if(err) {
            res.json(messeges.not_valid_operation());
        }
        else {
            res.json({
                valid: true,
                msg: "Done",
                result: news
            });
        }
    });
});

router.post('/show_areas', function(req, res, next) {
    Areas.find({}, function(err, areas) {
        if(err) {
            res.json(messeges.not_valid_operation());
        }
        else {
            res.json({
                valid: true,
                msg: "Done",
                result: areas
            });
        }
    });
});

router.post('/show_categories', function(req, res, next) {
    Categories.find({}, function(err, cats) {
        if(err) {
            res.json(messeges.not_valid_operation());
        }
        else {
            res.json({
                valid: true,
                msg: "Done",
                result: cats
            });
        }
    });
});

router.post('/show_benefits', function(req, res, next) {
    Benefit.find({}, function(err, bens) {
        if(err) {
            res.json(messeges.not_valid_operation());
        }
        else {
            res.json({
                valid: true,
                msg: "Done",
                result: bens
            });
        }
    });
});

router.post('/show_medicals', function(req, res, next) {
    Medical.find({}, function(err, meds) {
        if(err) {
            res.json(messeges.not_valid_operation());
        }
        else {
            res.json({
                valid: true,
                msg: "Done",
                result: meds
            });
        }
    });
});

router.post('/show_cards', function(req, res, next) {
    Cardholder.find({}, function(err, cards) {
        if(err) {
            res.json(messeges.not_valid_operation());
        }
        else {
            res.json({
                valid: true,
                msg: "Done",
                result: cards
            });
        }
    });
});

router.post('/show_atms', function(req, res, next) {

    ATMs.find({}, function(err, atms) {
        if(err) {
            res.json(messeges.not_valid_operation());
        }
        else {
            res.json({
                valid: true,
                msg: "Done",
                result: atms
            });
        }
    });

});


router.post('/get_areas', function(req, res, next) {
    if(req.body.sector != 'undefined') {
        Areas.find({sector: req.body.sector}, 'name', function(err, areas) {
            if (err) {
                res.json(messeges.interna_error());
            }
            else {
                res.json({
                    valid: true,
                    msg: "Done",
                    results: areas
                });
            }
        });
    }
    else {
        Areas.find({}, 'name', function(err, areas) {
            if (err) {
                res.json(messeges.interna_error());
            }
            else {
                res.json({
                    valid: true,
                    msg: "Done",
                    results: areas
                });
            }
        });
    }
});

router.post('/get_categories', function(req, res, next) {
    if (req.body.sector != 'undefined') {
        Categories.find({sector: req.body.sector}, 'name', function(err, cats) {
            if(err) {
                res.json(messeges.interna_error());
            }
            else {
                res.json({
                    valid: true,
                    msg: "Done",
                    results: cats
                });
            }
        });
    }
    else {
        Categories.find({}, 'name', function(err, cats) {
            if(err) {
                res.json(messeges.interna_error());
            }
            else {
                res.json({
                    valid: true,
                    msg: "Done",
                    results: cats
                });
            }
        });
    }
});


router.get('/get_newsData/:id', function(req, res, next) {
    var id = req.params.id;
    News.findById(id, function(err, news) {
        if(err) {
            res.json(messeges.not_valid_operation());
        }
        else {
            res.json({
                valid: true,
                msg: "Done",
                result: news
            });
        }
    });
});

router.post('/remove_media', function(req, res, next) {
    console.log(req.body);
    if(req.body.model == "news") {
        News.findById(req.body.to_delete_id, function(err, n) {
            if (err) {
                res.json(messeges.not_valid_operation());
            }
            else {
                console.log(n);
                n.media_path = "";
                n.save(function(err, o){
                    if(err) {
                        res.json(messeges.not_valid_operation());
                    }
                    else {
                        res.json(messeges.valid_operation());
                    }
                });
            }
        });
    }
});

router.post('/edit_news/:id', function(req, res, next) {

    var news_id = req.params.id;
    Auth.auth_check(req.body.user_id, req.body.api_key, function(key) {
        if (key) {
            Auth.check_admin(req.body.user_id, req.body.privilege, "Edit", function(user) {
                if (user) {
                    var updated_news = {
                        "title" : req.body.news_data.title,
                        "Body" : req.body.news_data.Body,
                        "_id" : mongoose.Types.ObjectId()
                    };
                    News.findByIdAndUpdate(news_id, updated_news, function(err, obj) {
                        if(err) {
                            res.json(messeges.not_valid_operation());
                        }
                        else {
                            res.json(messeges.valid_operation());
                        }
                    });
                }
                else {

                }
            });
        }
        else {

        }
    });
});

router.post('/upload_media/:id', multiparty(), function(req, res, next) {

    var news_id = req.params.id;
    if (req.body.request.model == "news") {
        var file_temp_path = req.files.file.path;
        var file_name = req.files.file.originalFilename;
        var file_new_name = randomstring.generate(7) + file_name;
        var file_upload_path = reserved_tokens.upload_dir + '/' +  file_new_name;
        fs.readFile(file_temp_path, function(err, data) {
            fs.writeFile(file_upload_path, data, function(err) {
                if (err) {
                    res.json(messeges.interna_error());
                }
                else {
                    News.findById(news_id, function(err, current_news) {
                        fs.unlink(file_temp_path);
                        current_news.media_path = "data/uploads/" + file_new_name;
                        current_news.save(function(err, s) {
                            if(err) {
                                res.json(messeges,not_valid_operation());
                            }
                            else {
                                res.json(messeges.valid_operation());
                            }
                        });
                    });
                }
            });
        });
    }
    else {
        res.json(messeges.not_valid_operation());
    }
});

router.post('/upload_logo/:id', multiparty(), function(req, res, next) {

    var news_id = req.params.id;
    if (req.body.request.model == "news") {
        var file_temp_path = req.files.file.path;
        var file_name = req.files.file.originalFilename;
        var file_new_name = randomstring.generate(7) + file_name;
        var file_upload_path = reserved_tokens.upload_dir + '/' +  file_new_name;
        fs.readFile(file_temp_path, function(err, data) {
            fs.writeFile(file_upload_path, data, function(err) {
                if (err) {
                    res.json(messeges.interna_error());
                }
                else {
                    News.findById(news_id, function(err, current_news) {
                        fs.unlink(file_temp_path);
                        current_news.img_path = "data/uploads/" + file_new_name;
                        current_news.save(function(err, s) {
                            if(err) {
                                res.json(messeges,not_valid_operation());
                            }
                            else {
                                res.json(messeges.valid_operation());
                            }
                        });
                    });
                }
            });
        });
    }
    else {
        res.json(messeges.not_valid_operation());
    }
});


router.get('/get_userData/:id', function(req, res, next) {
    var id = req.params.id;
    User.findById(id, function(err, users) {
        if(err) {
            res.json(messeges.not_valid_operation());
        }
        else {
            res.json({
                valid: true,
                msg: "Done",
                result: users
            });
        }
    });
});

router.post('/edit_user/:id', function(req, res, next) {

    var user_id = req.params.id;
    Auth.auth_check(req.body.user_id, req.body.api_key, function(key) {
        if (key) {
            Auth.check_admin(req.body.user_id, req.body.privilege, "Edit", function(user) {
                if (user) {
                    var updated_user = {
                        "name" : req.body.user_data.name,
                        "email" : req.body.user_data.email,
                        "password" : req.body.user_data.password,
                        "login_status" : reserved_tokens.logout
                    };
                    User.findByIdAndUpdate(user_id, updated_user, function(err, obj) {

                        if(err) {
                            res.json(messeges.not_valid_operation());
                        }
                        else {
                            res.json(messeges.valid_operation());
                        }
                    });
                }
                else {
                    res.json(messeges.valid_operation());
                }
            });
        }
        else {
            res.json(messeges.valid_operation());
        }
    });
});


router.get('/get_areaData/:id', function(req, res, next) {
    var id = req.params.id;
    Areas.findById(id, function(err, areas) {
        if(err) {
            res.json(messeges.not_valid_operation());
        }
        else {
            console.log("In server in get area data")
            res.json({
                valid: true,
                msg: "Done",
                result: areas
            });
        }
    });
});

router.post('/edit_area/:id', function(req, res, next) {

    var area_id = req.params.id;
    Auth.auth_check(req.body.user_id, req.body.api_key, function(key) {
        if (key) {
            Auth.check_admin(req.body.user_id, req.body.privilege, "Edit", function(user) {
                if (user) {
                    var updated_area = {
                        "name" : req.body.area_data.name,
                        "sector" : req.body.area_data.sector,
                    };
                    Areas.findByIdAndUpdate(area_id, updated_area, function(err, obj) {

                        if(err) {
                            res.json(messeges.not_valid_operation());
                        }
                        else {
                            res.json(messeges.valid_operation());
                        }
                    });
                }
                else {
                    res.json(messeges.valid_operation());
                }
            });
        }
        else {
            res.json(messeges.valid_operation());
        }
    });
});


router.get('/get_categoryData/:id', function(req, res, next) {
    var id = req.params.id;
    Categories.findById(id, function(err, cats) {
        if(err) {
            res.json(messeges.not_valid_operation());
        }
        else {
            res.json({
                valid: true,
                msg: "Done",
                result: cats
            });
        }
    });
});

router.post('/edit_category/:id', function(req, res, next) {

    var category_id = req.params.id;
    Auth.auth_check(req.body.user_id, req.body.api_key, function(key) {
        if (key) {
            Auth.check_admin(req.body.user_id, req.body.privilege, "Edit", function(user) {
                if (user) {
                    var updated_category = {
                        "name" : req.body.category_data.name,
                        "sector" : req.body.category_data.sector,
                    };
                    Areas.findByIdAndUpdate(area_id, updated_category, function(err, obj) {

                        if(err) {
                            res.json(messeges.not_valid_operation());
                        }
                        else {
                            res.json(messeges.valid_operation());
                        }
                    });
                }
                else {
                    res.json(messeges.valid_operation());
                }
            });
        }
        else {
            res.json(messeges.valid_operation());
        }
    });
});

module.exports = router;