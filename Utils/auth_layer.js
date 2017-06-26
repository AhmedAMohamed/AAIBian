/**
 * Created by ahmedalaa on 4/17/17.
 */

var User = require('../models/user_model');
var APIKeys = require('../models/api_key_model');
var validation_tokens = require('../Strings/validation_tokens');
var reserved = require('../Strings/reserved_tokens');
var Privileges = require('../models/privileges_model');

var auth = {
    general_creation_root:   {
        auth_check: function (email, password, api_key, validation_token, privilege, task) {
            if (task == validation_tokens.checks.csv_addition) {
                if (validation_token == validation_tokens.GM) {
                    APIKeys.find({api_key: api_key, valid_for: {$in: [reserved.all_user_api_key()]}}, function (err, validations) {
                            if (err) {
                                console.log("Error");
                                return false;
                            }
                            else {
                                if(validations.length == 1) {
                                    var user = auth.check_admin(email, password, privilege);
                                    if (user == null) {
                                        return false;
                                    }
                                    else {
                                        return true;
                                    }
                                }
                            }
                    });
                }
            }
            else {
                return false;
            }

        }
    },
    auth_check: function (user_id, api_key, callback) {
      APIKeys.find({api_key: api_key, valid_for:{$in: [reserved.all_user_api_key]}}, function (err, validations) {
          if (err) {
              callback(null);
          }
          else {
              if (validations.length == 1) {
                  callback(validations[0]);
              }
              else {
                  callback(null);
              }
          }
      })
    },
    check_admin: function (email, password, privilege) {
        User.find({email: email, password: password, privilege: privilege}, function (err, users) {
            if (err) {
                console.log("Error");
                return null;
            }
            else {
                if (users.length == 1) {
                    return users[0];
                }
            }
        });
    },
    check_admin: function (user_id, privilege, function_name, callback) {
        var p_find_obj = {};
        if(function_name.indexOf("Edit") == -1) {
            if (privilege == validation_tokens.privilege.GM) {
                User.findOne({"_id": user_id, "privilege": privilege}, function (err, user) {
                   if (err) {
                       console.log("Error");
                       callback(null);
                   }
                   else {
                       callback(user);
                   }
                });
            }
            else if (privilege == validation_tokens.privilege.root) {
                p_find_obj['root'] = { $in : [function_name]};
                Privileges.find(p_find_obj, function(err, validations) {
                    if (err) {
                        callback(null);
                    }
                    else {
                        if (validations.length == 1) {
                            User.findById(user_id, function (err, users) {
                               if (err) {
                                   console.log("Error");
                                   callback(null);
                               }
                               else {
                                   callback(users);
                               }
                            });
                        }
                        else {
                            callback(null);
                        }
                    }
                });
            }
            else if (privilege == validation_tokens.privilege.admin) {
                p_find_obj['admin'] = { $in : [function_name]};
                Privileges.find(p_find_obj, function(err, validations) {
                    if (err) {
                        callback(null);
                    }
                    else {
                        if (validations.length == 1) {
                            User.findById(user_id, function (err, users) {
                               if (err) {
                                   console.log("Error");
                                   callback(null);
                               }
                               else {
                                   callback(users);
                               }
                            });
                        }
                        else {
                            callback(null);
                        }
                    }
                });
            }
            else {
                callback(null);
            }
        }
        else {
            User.findOne({"_id": user_id, "privilege": privilege}, function (err, user) {
               if (err) {
                   console.log("Error");
                   callback(null);
               }
               else {
                   callback(user);
               }
            });
        }
    }
};

module.exports = auth;
