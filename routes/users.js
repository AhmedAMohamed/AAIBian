var express = require('express');
var router = express.Router();

var Auth = require('../Utils/auth_layer');
var User = require('../models/user_model');
var API_Key = require('../models/api_key_model');
var reserved_tokens = require('../Strings/reserved_tokens');
var messeges = require('../Strings/messeges');

router.post('/aaibian/user/login', function (req, res, next) {
    API_Key.find({api_key: req.body.api_key, valid_for: { $in: [req.body.email] }}, function (error, valid) {
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
                              privilege:users[0].privilege,
                              user_data: users[0],
                              login_status: users[0].login_status,
                              changing_session: (users[0].login_status == reserved_tokens.first_login) ?
                                  reserved_tokens.changing : null,
                              msg: messeges.operation_valid_msg()
                          };
                          res.json(response);
                      }
                    }
                });
            }
        }
    })
});



module.exports = router;
