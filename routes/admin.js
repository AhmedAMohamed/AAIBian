

var express = require('express');
var router = express.Router();

var Auth = require('../Utils/auth_layer');
var User = require('../models/user_model');
var API_Key = require('../models/api_key_model');
var reserved_tokens = require('../Strings/reserved_tokens');
var messeges = require('../Strings/messeges');
var tokens = require('../Strings/validation_tokens');
var News = require('../models/news_model');

router.post('/aaibian/admin/add_user', function (req, res) {
    if (Auth.auth_check(req.body.user_id, req.body.api_key)) {
        var user = Auth.check_admin(req.body.user_id, req.body.privilege);
        if (user.privilege == tokens.privilege.root || user.privilege == tokens.privilege.GM) {
            if (user != null) {
                var new_user_data = req.body.new_user;
                var data = {
                    name: new_user_data.name,
                    email: new_user_data.email,
                    password: reserved_tokens.default_password,
                    privilege: (new_user_data.privilege == tokens.privilege.GM && user.privilege == tokens.privilege.root)
                        ?tokens.privilege.root : new_user_data.privilege,
                    subscribed_in: [reserved_tokens.all_categories],
                    area: new_user_data.area,
                    job_desc: new_user_data.job_desc,
                    login_status: true,
                    last_login: new Date(Date.now())
                };
                var new_user = new User(data);
                new_user.save(function (err, emp) {
                    if (err) {
                        res.json(messeges.not_valid_operation());
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
    }
    else {
        res.json(messeges.not_valid_operation());
    }
});

router.post('/aaibian/admin/add_news', function (req, res) {
    if (Auth.auth_check(req.body.user_id, req.body.api_key)) {
        var user = Auth.check_admin(req.body.user_id, req.body.privilege);
        if (user != null) {
            if (user.privilege == tokens.privilege.root || user.privilege == tokens.privilege.GM
                || user.privilege == tokens.privilege.admin) {
                // add news then notify
                // take care that date is now creator id from user
            }
        }
        else {
            res.json(messeges.not_valid_operation());
        }
    }
});