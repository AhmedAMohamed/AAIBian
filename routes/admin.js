

var express = require('express');
var router = express.Router();

var Auth = require('../Utils/auth_layer');
var User = require('../models/user_model');
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
                              console.log("RRRRRRRRRRRRRRRR");
                              console.log(err);
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

router.post('/add_news', function (req, res) {
    Auth.auth_check(req.body.user_id, req.body.api_key, function(validations) {
      if(validations) {
        Auth.check_admin(req.body.user_id, req.body.privilege, function(user) {
          if(user) {
            if(user.privilege == tokens.privilege.root || user.privilege == tokens.privilege.GM) {
              var to_delete_date = new Date(Date.now());
              to_delete_date.setDate(to_delete_date.getDate() + 7);
              var data = {
                title: req.body.news.title,
                Body: req.body.news.Body,
                creation_date: new Date(Date.now()),
                to_delete_date: to_delete_date,
                creator: user._id,
                to_view: true
              };
              var news = new News(data);
              news.save(function(err, n) {
                if(err) {
                  res.json(messeges.interna_error());
                }
                else {
                  helpers['users'].schedule_news_deletion(n._id);
                  res.json(messeges.valid_operation());
                }
              })
            }
            else {
              res.json(messeges.not_valid_operation());
            }
          }
          else {
              res.json(messeges.interna_error());
          }
        });
      }
      else {
        res.json(messeges.not_valid_operation());
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
