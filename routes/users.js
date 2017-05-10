var express = require('express');
var router = express.Router();

var Auth = require('../Utils/auth_layer');
var User = require('../models/user_model');
var API_Key = require('../models/api_key_model');
var reserved_tokens = require('../Strings/reserved_tokens');
var messeges = require('../Strings/messeges');
var mhelper = require('../Utils/helpers');


router.post('/login', function (req, res, next) {
    API_Key.find({api_key: req.body.api_key}, function (error, valid) {
        if (error) {
            res.json(messeges.not_valid_operation());
        }
        else {
            if (valid.length == 1) {
                User.find({email: req.body.email, password: req.body.password}, function (err, users) {
                    if (err) {
                        res.json({
                          valid: false,
                          msg: "Not valid email or password"
                        });
                    }
                    else {
                        if (users.length == 1) {
                          var response = {
                              valid: true,
                              result: {
                                  user_id: users[0]._id,
                                  privilege:users[0].privilege,
                                  user_data: users[0],
                                  login_status: users[0].login_status
                              },
                              msg: messeges.operation_valid_msg()
                          };
                          mhelper['users'].update_user_time(users[0]._id, function(u) {
                            if (u != null) {
                                response.result.user_id = u._id;
                                res.json(response);
                            }
                            else {
                              res.json(messeges.not_valid_operation());
                            }
                          });
                        }
                        else {
                          res.json({
                            valid: false,
                            msg: "Wrong username or password"
                          });
                        }
                    }
                });
            }
            else {
              res.json(messeges.not_valid_operation());
            }
        }
    });
});

router.post('/change_password', function (req, res, next) {
    API_Key.find({api_key:  req.body.api_key}, function(error, valid) {
        if(error) {
            res.json(messeges.not_valid_operation());
        }
        else {
            if (valid.length == 1) {
                mhelper['users'].get_user_data(req.body.user_id, function(user) {
                    if(user) {
                        if (user.login_status == reserved_tokens.first_login) {
                            user.password = req.body.request.new_password;
                            user.login_status = reserved_tokens.old_login;
                            user.save(function(err, user) {
                                if(err) {
                                    res.json(res.json(messeges.interna_error()));
                                }
                                else {
                                    res.json(messeges.valid_operation());
                                }
                            });
                        }
                        else {
                            res.json(messeges.change_password_not_valid());
                        }
                    }
                    else {
                        res.json(messeges.interna_error());
                    }
                });
            }
            else {
                res.json(messeges.interna_error());
            }
        }
    });

});

router.post('/set_fcm_regId', function(req, res, next) {
    API_Key.find({api_key: req.body.api_key}, function(err, valid) {
       if(err) {
           res.json(messeges.not_valid_operation());
       }
       else {
           mhelper['users'].get_user_data(req.body.user_id, function(user) {
               if(user) {
                   user.reg_id = req.body.request.reg_id;
                   user.save(function(err, u) {
                       if(err) {
                           res.json(messeges.interna_error());
                       }
                       else {
                           res.json(messeges.valid_operation());
                       }
                   });
               }
               else {
                   res.json(messeges.interna_error());
               }
           });
       }
    });
});

module.exports = router;
