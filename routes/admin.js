

var path = require('path');
var multiparty = require('connect-multiparty');
var util = require('util')
var express = require('express');
const fs = require('fs');
var router = express.Router();

var Auth = require('../Utils/auth_layer');
var User = require('../models/user_model');
var Areas = require('../models/area_model');
var Categories = require('../models/category_model');
var API_Key = require('../models/api_key_model');
var reserved_tokens = require('../Strings/reserved_tokens');
var messeges = require('../Strings/messeges');
var tokens = require('../Strings/validation_tokens');
var News = require('../models/news_model');
var helpers = require('../Utils/helpers');



router.post('/add_user', function (req, res) {
    Auth.auth_check(req.body.user_id, req.body.api_key, function(key) {
      if (key) {
          Auth.check_admin(req.body.user_id, req.body.privilege, function(user) {
              if (user) {
                if (user.privilege == tokens.privilege.root ||
                    user.privilege == tokens.privilege.GM ||
                    user.privilege == tokens.privilege.admin) {
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

    console.log("files");
    console.log(req.files);
    console.log("file");
    console.log(req.file);
    res.json(messeges.valid_operation());
    /*
    form.parse(req, function(err, fields, files) {
        if (err) {
            res.json(messeges.interna_error());
        }
        else {
            var user_id = fields.user_id;
            var api_key = fields.api_key;
            var privilege = fields.privilege;
            var news = fields.news;

        }
    });
    */
    /*
    form.parse(req, function(err, fields, files) {
        if (err) {
            res.json(messeges.interna_error());
        }
        else {
            var user_id = fields.user_id;
            var api_key = fields.api_key;
            var privilege = fields.privilege;
            var news = fields.news;
            Auth.auth_check(user_id, api_key, function(validations) {
                if(validations) {
                    Auth.check_admin(user_id, privilege, function(user) {
                        if(user) {
                            if (user.privilege == tokens.privilege.root || user.privilege == tokens.privilege.GM ||
                                    user.privilege == tokens.privilege.admin) {
                                var to_delete_date = new Date(Date.now())
                                to_delete_date.setDate(to_delete_date.getDate() + 7);
                                var data = {
                                    title: news.title,
                                    Body: news.body,
                                    creation_date: new Date(Date.now()),
                                    to_delete_date: to_delete_date,
                                    creator: user_id
                                };
                                var news = new News(data);

                                var newPath = "../public/uploads/uploadedFileName.jpg";
                                fs.readFile(files.file1[0].path, function (err, data) {
                                    if (err) {
                                        res.json(messeges.interna_error());
                                    }
                                    else {
                                        fs.writeFile(newPath, data, function (err) {
                                           if (err) {
                                               res.json(messeges.interna_error());
                                           }
                                           else {
                                               news.save(function(err, sNews) {
                                                   if(err) {
                                                       res.json(messeges.interna_error());
                                                   }
                                                   else {
                                                       helpers['users'].schedule_news_deletion(sNews._id);
                                                       res.json(messeges.valid_operation())
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
        }
    });

    */
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

router.post('/add_offer', function(req, res, next) {

});

router.post('/add_category', function(req, res, next) {
    Auth.auth_check(req.body.user_id, req.body.api_key, function(key) {
       if (key) {
            Auth.check_admin(req.body.user_id, req.body.privilege, function(user) {
                if (user) {
                    if (user.privilege == tokens.privilege.root ||
                        user.privilege == tokens.privilege.GM ||
                        user.privilege == tokens.privilege.admin) {

                        var data = {
                            name: req.body.category.name,
                            search_name: req.body.category.name,
                            creation_date: new Date(Date.now())
                        };

                        var cat = new Categories(data);
                        cat.save(function(err, sCat) {
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
                }
                else {
                    res.json(messeges.not_valid_operation());
                }
            })
       }
       else {
          res.json(messeges.not_valid_operation());
       }
    });
});

router.get('/upload_test', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'upload_form.html'));
});

router.post('/upload_trial', multiparty(),function(req, res, next) {
  res.json(req.files);
  /*
  var form = new multiparty.Form();
  console.log(req.files);
  console.log("tttttt");
  form.parse(req, function(err, fields, files) {

      console.log(req.body);
      console.log(files.file1[0].path);
      console.log(fields);
      var newPath = "../public/uploads/uploadedFileName.jpg";
      fs.readFile(files.file1[0].path, function (err, data) {
        fs.writeFile(newPath, data, function (err) {
        res.redirect("back");
      });
    });

    });
    */
});

router.post('/add_area', function(req, res, next) {
  Auth.auth_check(req.body.user_id, req.body.api_key, function(key) {
    if (key) {
      Auth.check_admin(req.body.user_id, req.body.privilege, function(user) {
        if (user) {
          if (user.privilege == tokens.privilege.root ||
                    user.privilege == tokens.privilege.GM ||
                    user.privilege == tokens.privilege.admin) {
            var new_area_data = req.body.new_area;
            var data = {
              api_key: "1698c2bea6c8000723d5bb70363a8352d846917et41GuPJ",
              user_id : user._id,
              privilege: user.privilege,
              new_area: {
                name: new_area_data.name,
                search_name: new_area_data.search_name,
                creation_date: new Date(Date.now())
              }
            }
            var area = new Areas(new_area_data);
            area.save(function(err, ar) {
              if (err) {
                res.json(messeges.not_valid_operation());
              } 
              else {
                res.json(messeges.valid_operation());
              }
            });
          }
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

module.exports = router;
