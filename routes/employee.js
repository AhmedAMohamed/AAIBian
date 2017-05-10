/**
 * Created by ahmedalaa on 4/21/17.
 */

var express = require('express');
var router = express.Router();

var Auth = require('../Utils/auth_layer');
var User = require('../models/user_model');
var API_Key = require('../models/api_key_model');
var reserved_tokens = require('../Strings/reserved_tokens');
var messeges = require('../Strings/messeges');
var tokens = require('../Strings/validation_tokens');
var News = require('../models/news_model');
var Benefits = require('../models/benefit_model');
var Categories = require('../models/category_model');
var mhelper = require('../Utils/helpers');


var get_mongoose_ids = function(ids) {
    var arr = [];
    var counter = 0;
    ids.forEach(function(id) {
        arr.push(mongoose.Types.ObjectId(id));
        counter += 1;
        if (arr.length == ids.length) {
            return arr;
        }
    });
};

router.get('/get_news', function(req, res, next) {
    API_Key.find({api_key:  req.body.api_key}, function(error, valid) {
        if (error) {
            res.json(messeges.not_valid_operation());
        }
        else {
            if (valid.length == 1) {
                mhelper['users'].get_user_data(req.body.user_id, function(user) {
                    if (user) {
                        News.find({_id : {$in: get_mongoose_ids(req.body.request.news_ids)},
                                   creation_data: { $gte : new Date(req.body.request.since_date)},
                        },
                        function(err, news) {
                            if (err) {
                                res.json(messeges.interna_error);
                            }
                            else {
                                res.json({
                                    valid: true,
                                    msg: "Done",
                                    result: { news }
                                });
                            }
                        });
                    }
                    else {
                        res.json(messeges.interna_error());
                    }
                });
            }
            else {
                res.json(messeges.not_valid_operation());
            }
        }
    });
});

router.post('/get_benefits', function(req, res, next) {
   API_Key.find({api_key:  req.body.api_key}, function(error, valid) {
           if (error) {
               res.json(messeges.not_valid_operation());
           }
           else {
               if (valid.length == 1) {
                   mhelper['users'].get_user_data(req.body.user_id, function(user) {
                       if (user) {
                           Benefits.find({_id : {$in: get_mongoose_ids(req.body.request.ben_ids)},
                                      creation_data: { $gte : new Date(req.body.request.since_date)},
                           },
                           function(err, bens) {
                               if (err) {
                                   res.json(messeges.interna_error);
                               }
                               else {
                                   res.json({
                                       valid: true,
                                       msg: "Done",
                                       result: { bens }
                                   });
                               }
                           });
                       }
                       else {
                           res.json(messeges.interna_error());
                       }
                   });
               }
               else {
                   res.json(messeges.not_valid_operation());
               }
           }
       });
});

router.post('/get_categories', function(req, res, next) {
   API_Key.find({api_key:  req.body.api_key}, function(error, valid) {
           if (error) {
               res.json(messeges.not_valid_operation());
           }
           else {
               if (valid.length == 1) {
                   mhelper['users'].get_user_data(req.body.user_id, function(user) {
                       if (user) {
                           Categories.find({_id : {$in: get_mongoose_ids(req.body.request.categories_ids)},
                                      creation_data: { $gte : new Date(req.body.request.since_date)},
                                      name: req.body.request.name,
                                      search_name: req.body.request.search_name
                           },
                           function(err, cats) {
                               if (err) {
                                   res.json(messeges.interna_error);
                               }
                               else {
                                   res.json({
                                       valid: true,
                                       msg: "Done",
                                       result: { cats }
                                   });
                               }
                           });
                       }
                       else {
                           res.json(messeges.interna_error());
                       }
                   });
               }
               else {
                   res.json(messeges.not_valid_operation());
               }
           }
       });
});

module.exports = router;