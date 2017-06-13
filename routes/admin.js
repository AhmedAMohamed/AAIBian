

var path = require('path');
var multiparty = require('connect-multiparty');
var util = require('util')
var express = require('express');
var fs = require('fs');
var router = express.Router();

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
var News = require('../models/news_model');
var Privilege = require('../models/privileges_model');
var helpers = require('../Utils/helpers');

//var sha1 = require('sha1');
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
    console.log("THe news");
    console.log(news);
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
                    var file_temp_path = req.files.FIELDNAME.path;
                    var file_name = req.files.FIELDNAME.originalFileName;
                    var file_upload_path = reserved_tokens.upload_dir + '/' + sha1(file_name) + randomstring.generate(7);
                    fs.readFile(file_temp_path, function(err, data) {
                        fs.writeFile(file_upload_path, data, function(err) {
                            if (err) {
                                res.json(messeges.interna_error());
                            }
                            else {
                                var dat = {
                                    sector: req.body.category.sector,
                                    name: req.body.category.name,
                                    search_name: req.body.category.name,
                                    creation_date: new Date(Date.now()),
                                    img_path: file_upload_path
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
                var file_temp_path = req.files.FIELDNAME.path;
                var file_name = req.files.FIELDNAME.originalFileName;
                var file_upload_path = reserved_tokens.upload_dir + '/' + sha1(file_name) + randomstring.generate(7);
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

                            var to_delete_date = new Date(Date.now());
                            to_delete_date.setMinutes(to_delete_date.getMinutes() + 2);
                            to_delete_date.setSeconds(to_delete_date.getSeconds() + 2 * counter);
                            to_delete_date.setFullYear(to_delete_date.getFullYear() + 1);
                            to_delete_date.setHours(to_delete_date.getHours());
                            counter += 30;
                            var new_benefit;
                            var d = {
                                name: new_benefit.name,
                                address: new_benefit.address,
                                location: [
                                    parseFloat(new_benefit.lng),
                                    parseFloat(new_benefit.lat)
                                ],
                                zone: new_benefit.zone,
                                contacts: new_benefit.contacts,
                                industry: new_benefit.category,
                                creation_date: new Date(Date.now()),
                                notification_date: notify_date,
                                deleteDate: to_delete_date,
                                notified: false,
                                offer: new_benefit.offer,
                                img_path: file_upload_path,
                            };
                            benefit.save(function (err, da) {
                                if (err) {
                                    console.log(("error in inserting line"));
                                }
                                else {
                                    console.log("Notify id " + da.id + " at " + da.notification_date);
                                    console.log("Delete id " + da.id + " at " + da.deleteDate);
                                    var j = schedule.scheduleJob("benefit_staff_" + da.id, da.notification_date, function () {
                                        helpers[1].notifyAndScheduleBenefitDeletion(da, helpers[2].get_interested(da._id));
                                    });
                                }
                            });
                        }
                    })
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
                        ]
                    }
                    var atm = new ATMs(d);
                    atm.save(function(err, nATM) {
                        if (err) {
                            res.json(messeges.interna_error());
                        }
                        else {
                            res.json(messeges.valid_operation);
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

router.post('/add_cardholder', function(req, res, next) {
    Auth.auth_check(req.body.user_id, req.body.api_key, function(key) {
        if (key) {
            Auth.check_admin(req.body.user_id, req.body.privilege, reserved_tokens.function_name.add_cardholder, function(user) {
                if (user) {
                    var d = {
                        name: req.body.new_cardholder.name,
                        address: req.body.new_cardholder.address,
                        location: [
                            parseFloat(req.body.new_cardholder.location.lat),
                            parseFloat(req.body.new_cardholder.location.lng)
                        ],
                        merchant: req.body.new_cardholder.merchant,
                        zone: req.body.new_cardholder.zone,
                        industry: req.body.new_cardholder.category,
                        offer: req.body.new_cardholder.offer,
                        creation_date: new Date(Date.now())
                    };
                    var card = new Cardholder(d);
                    card.save(function(err, nCard) {
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

router.post('/delete_user', function(req, res, next) {
    var id = req.body.id;
    User.remove({_id: id}, function(err) {
        if (err) {
            res.json(messeges.not_valid_operation());
        }
        else {
            res.json(messeges.valid_operation());
        }
    })
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
                    console.log("first");
                    if (user) {
                        Privilege.find({}, function(err, privileges) {
                            console.log(err);
                            console.log("here");
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

module.exports = router;
