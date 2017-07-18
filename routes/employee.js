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
var ATM = require('../models/atm_model');
var Feedback = require('../models/feedback_model');
var Medical = require('../models/medical_sector_model');
var Categories = require('../models/category_model');
var CardHolder = require('../models/cardholder_model');
var Areas = require('../models/area_model');
var mhelper = require('../Utils/helpers');

var mongoose = require('mongoose');
var async = require('async');

var get_mongoose_ids = function(ids, doneFunction) {
	 if (typeof ids == 'undefined') {
		return null;
	 }
	 else {
		console.log("here");
		console.log(ids);
		var arr = [];
		var counter = 0;
		async.each(ids, function(id, callback) {
			arr.push(mongoose.Types.ObjectId(id));
			counter += 1;
			if( counter == ids.length) {
				doneFunction(null, arr);
			}

		}, function(err) {
			doneFunction(err, arr);
		});
	 }
};

var get_find_request = function(selection, request, callback) {
	if (selection == reserved_tokens.news_required) {
		get_mongoose_ids(typeof request.news_ids == 'undefined' ? [] : request.news_ids, function(err, mongIds) {
		   console.log("after async finish");
		   callback(err, mongIds);
		});
	}
	if (selection == reserved_tokens.benefit_required) {
		get_mongoose_ids(typeof request.ben_ids == 'undefined' ? [] : request.ben_ids, function(err, mongIds) {
		   console.log("after async finish");
		   callback(err, mongIds);
		});
	}
	if (selection == reserved_tokens.category_required) {
		get_mongoose_ids(typeof request.cat_ids == 'undefined' ? [] : request.cat_ids, function(err, mongIds) {
		   console.log("after async finish");
		   callback(err, mongIds);
		});
	}
	if (selection == reserved_tokens.areas_required) {
	   get_mongoose_ids(typeof request.areas_ids == 'undefined' ? [] : request.areas_ids, function(err, mongIds) {
		  console.log("after async finish");
		  callback(err, mongIds);
	   });
	}
	if (selection == reserved_tokens.medical_required) {
        get_mongoose_ids(typeof request.med_ids == 'undefined' ? [] : request.med_ids, function(err, mongIds) {
   	        console.log("after async finish");
    		callback(err, mongIds);
    	});
    }
    if (selection == reserved_tokens.cardholders_required) {
        get_mongoose_ids(typeof request.card_ids == 'undefined' ? [] : request.cards_ids, function(err, mongIds) {
            console.log("after async finish");
            callback(err, mongIds);
        });
    }
    if (selection == reserved_tokens.atm_required) {
        get_mongoose_ids(typeof request.atm_ids == 'undefined' ? [] : request.med_ids, function(err, mongIds) {
            console.log("after async finish");
            callback(err, mongIds);
        });
    }
};

router.post('/get_news', function(req, res, next) {
	API_Key.find({api_key:  req.body.api_key}, function(error, valid) {
		if (error) {
			res.json(messeges.not_valid_operation());
		}
		else {
			if (valid.length == 1) {
				mhelper['users'].get_user_data(req.body.user_id, function(user) {
					if (user) {
						get_find_request(reserved_tokens.news_required,req.body.request, function(err,mongIds) {
							if(err) {
								res.json(messeges.interna_error());
							}
							else {
								var obj = {};
								if (mongIds.length != 0) {
									obj._id = {$in: mongIds};
								}
								News.find(obj,function(err, news) {
									if (err) {
										res.json(messeges.interna_error());
									}
									else {
                                        if (typeof req.body.request.since_date != 'undefined') {
                                            var ar = {};
                                            var ar_b = [];
                                            var ar_a = [];
                                            var counter = 0;
                                            news.forEach(function(n) {
                                              if (n.creation_date > new Date(req.body.request.since_date)) {
                                                  ar_a.push(n);
                                                  counter += 1;
                                              }
                                              else {
                                                  ar_b.push(n);
                                                  counter += 1;
                                              }
                                              if (counter == news.length) {
                                                  ar['before'] = ar_b;
                                                  ar['after'] = ar_a;
                                                  res.json({
                                                      valid: true,
                                                      msg: "Done",
                                                      result: {"news" : ar}
                                                  });
                                              }
                                          });
                                       }
                                       else {
                                           res.json({
                                               valid: true,
                                               msg: "Done",
                                               result: { "news" : news }
                                           });
                                       }
									}
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
					   get_find_request(reserved_tokens.benefit_required,req.body.request, function(err,mongIds) {
						   if(err) {
							   res.json(messeges.interna_error());
						   }
						   else {
							   var obj = {};
							   if (mongIds.length != 0) {
								   obj._id = {$in: mongIds};
							   }
							   if (typeof req.body.request.zone != 'undefined') {
								   obj.zone = req.body.request.zone;
							   }
							   if (typeof req.body.request.category != 'undefined') {
								   obj.industry = req.body.request.category;
							   }
                               obj.deleteDate = {"$gte": new Date(Date.now())};
							   Benefits.find(obj,function(err, bens) {
								   if (err) {
									   res.json(messeges.interna_error());
								   }
								   else {
								       if (typeof req.body.request.since_date != 'undefined') {
								          var ar = {};
                                          var ar_b = [];
                                          var ar_a = [];
                                          var counter = 0;
                                          bens.forEach(function(ben) {
                                              if (ben.creation_date > new Date(req.body.request.since_date)) {
                                                  ar_a.push(ben);
                                                  counter += 1;
                                              }
                                              else {
                                                  ar_b.push(ben);
                                                  counter += 1;
                                              }
                                              if (counter == bens.length) {
                                                  ar['before'] = ar_b;
                                                  ar['after'] = ar_a;
                                                  res.json({
                                                      valid: true,
                                                      msg: "Done",
                                                      result: {"benefits" : ar}
                                                  });
                                              }
                                          });
								       }
								       else {
								           res.json({
                                               valid: true,
                                               msg: "Done",
                                               result: { "benefits" : bens }
                                           });
								       }
								   }
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

router.post('/get_cardholder', function(req, res, next) {
    API_Key.find({api_key:  req.body.api_key}, function(error, valid) {
       if (error) {
           res.json(messeges.not_valid_operation());
       }
       else {
           if (valid.length == 1) {
               mhelper['users'].get_user_data(req.body.user_id, function(user) {
                   if (user) {
                       get_find_request(reserved_tokens.cardholders_required,req.body.request, function(err,mongIds) {
                           if(err) {
                               res.json(messeges.interna_error());
                           }
                           else {
                               var obj = {};
                               if (mongIds.length != 0) {
                                   obj._id = {$in: mongIds};
                               }
                               if (typeof req.body.request.zone != 'undefined') {
                                   obj.zone = req.body.request.zone;
                               }
                               if (typeof req.body.request.category != 'undefined') {
                                   obj.type = req.body.request.category;
                               }
                               obj.deleteDate = {"$gte": new Date(Date.now())};
                               CardHolder.find(obj,function(err, cards) {
                                   if (err) {
                                       res.json(messeges.interna_error());
                                   }
                                   else {
                                       if (typeof req.body.request.since_date != 'undefined') {
                                          var ar = {};
                                          var ar_b = [];
                                          var ar_a = [];
                                          var counter = 0;
                                          cards.forEach(function(card) {
                                              if (card.creation_date > new Date(req.body.request.since_date)) {
                                                  ar_a.push(card);
                                                  counter += 1;
                                              }
                                              else {
                                                  ar_b.push(card);
                                                  counter += 1;
                                              }
                                              if (counter == cards.length) {
                                                  ar['before'] = ar_b;
                                                  ar['after'] = ar_a;
                                                  res.json({
                                                      valid: true,
                                                      msg: "Done",
                                                      result: {"cardholders" : ar}
                                                  });
                                              }
                                          });
                                       }
                                       else {
                                           res.json({
                                               valid: true,
                                               msg: "Done",
                                               result: { "cardholders" : cards }
                                           });
                                       }
                                   }
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

router.post('/get_atms', function(req, res, next) {
    API_Key.find({api_key:  req.body.api_key}, function(error, valid) {
       if (error) {
           res.json(messeges.not_valid_operation());
       }
       else {
           if (valid.length == 1) {
                mhelper['users'].get_user_data(req.body.user_id, function(user) {
                   if (user) {
                       get_find_request(reserved_tokens.atm_required,req.body.request, function(err,mongIds) {
                           if(err) {
                               res.json(messeges.interna_error());
                           }
                           else {
                               var obj = {};
                               if (mongIds.length != 0) {
                                   obj._id = {$in: mongIds};
                               }
                               if (typeof req.body.request.category != 'undefined') {
                                   obj.zone = req.body.request.category;
                               }
                               if (typeof req.body.request.zone != 'undefined') {
                                   obj.loc_name = req.body.request.zone;
                               }
                               ATM.find(obj,function(err, atms) {
                                   if (err) {
                                       res.json(messeges.interna_error());
                                   }
                                   else {
                                       if (typeof req.body.request.since_date != 'undefined') {
                                          var ar = {};
                                          var ar_b = [];
                                          var ar_a = [];
                                          var counter = 0;
                                          atms.forEach(function(atm) {
                                              if (atm.creation_date > new Date(req.body.request.since_date)) {
                                                  ar_a.push(atm);
                                                  counter += 1;
                                              }
                                              else {
                                                  ar_b.push(atm);
                                                  counter += 1;
                                              }
                                              if (counter == atms.length) {
                                                  ar['before'] = ar_b;
                                                  ar['after'] = ar_a;
                                                  res.json({
                                                      valid: true,
                                                      msg: "Done",
                                                      result: {"ATMs" : ar}
                                                  });
                                              }
                                          });
                                       }
                                       else {
                                           res.json({
                                               valid: true,
                                               msg: "Done",
                                               result: { "ATMs" : atms }
                                           });
                                       }
                                   }
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

router.post('/get_medical', function(req, res, next) {
    API_Key.find({api_key:  req.body.api_key}, function(error, valid) {
       if (error) {
           res.json(messeges.not_valid_operation());
       }
       else {
           if (valid.length == 1) {
               mhelper['users'].get_user_data(req.body.user_id, function(user) {
                   if (user) {
                       get_find_request(reserved_tokens.medical_required,req.body.request, function(err,mongIds) {
                           if (err) {
                               res.json(messeges.interna_error());
                           }
                           else {
                               var obj = {};
                               if (mongIds.length != 0) {
                                   obj._id = {$in: mongIds};
                               }
                               if (typeof req.body.request.type != 'undefined') {
                                   obj.type = req.body.request.type;
                               }
                               if (typeof req.body.request.area != 'undefined') {
                                   obj.zone = req.body.request.area;
                               }
                               obj.deleteDate = {"$gte": new Date(Date.now())};
                               Medical.find(obj, function(err, meds) {
                                  if (err) {
                                      res.json(messeges.interna_error);
                                  }
                                  else {
                                      if (typeof req.body.request.since_date != 'undefined') {
                                             var ar = {};
                                             var ar_b = [];
                                             var ar_a = [];
                                             var counter = 0;
                                             meds.forEach(function(med) {
                                                 if (med.creation_date > new Date(req.body.request.since_date)) {
                                                     ar_a.push(med);
                                                     counter += 1;
                                                 }
                                                 else {
                                                     ar_b.push(med);
                                                     counter += 1;
                                                 }
                                                 if (counter == meds.length) {
                                                     ar['before'] = ar_b;
                                                     ar['after'] = ar_a;
                                                     res.json({
                                                         valid: true,
                                                         msg: "Done",
                                                         result: {"Medicals" : ar}
                                                     });
                                                 }
                                             });
                                         }
                                         else {
                                             console.log(meds);
                                             res.json({
                                                 valid: true,
                                                 msg: "Done",
                                                 result: { "Medicals" : meds }
                                             });
                                         }
                                  }
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
						   get_find_request(reserved_tokens.category_required,req.body.request, function(err,mongIds) {
							   if (err) {
								   res.json(messeges.interna_error());
							   }
							   else {
								   var obj = {};
								   if (mongIds.length != 0) {
									   obj._id = {$in: mongIds};
								   }
								   if (typeof req.body.request.sector != 'undefined') {
									   obj.sector = req.body.request.sector;
								   }

								   Categories.find(obj, function(err, cats) {
									  if (err) {
										  res.json(messeges.interna_error);
									  }
									  else {
									      if (typeof req.body.request.since_date != 'undefined') {
                                              var ar = {};
                                              var ar_b = [];
                                              var ar_a = [];
                                              var counter = 0;
                                              cats.forEach(function(cat) {
                                                  if (cat.creation_date > new Date(req.body.request.since_date)) {
                                                      ar_a.push(cat);
                                                      counter += 1;
                                                  }
                                                  else {
                                                      ar_b.push(cat);
                                                      counter += 1;
                                                  }
                                                  if (counter == cats.length) {
                                                      ar['before'] = ar_b;
                                                      ar['after'] = ar_a;
                                                      res.json({
                                                          valid: true,
                                                          msg: "Done",
                                                          result: {"categories" : ar}
                                                      });
                                                  }
                                              });
                                          }
                                          else {
                                              res.json({
                                                  valid: true,
                                                  msg: "Done",
                                                  result: { "categories" : cats }
                                              });
                                          }
									  }
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

router.post('/get_areas', function(req, res, next) {
	API_Key.find({api_key:  req.body.api_key}, function(error, valid) {
	   if (error) {
		   res.json(messeges.not_valid_operation());
	   }
	   else {
		   if (valid.length == 1) {
			   mhelper['users'].get_user_data(req.body.user_id, function(user) {
				   if (user) {
					   get_find_request(reserved_tokens.areas_required,req.body.request, function(err,mongIds) {
						  if (err) {
							  res.json(messeges.interna_error());
						  }
						  else {
							  var obj = {};
							  if (mongIds.length != 0) {
								  obj._id = {$in: mongIds};
							  }
                              if (typeof req.body.request.sector != 'undefined') {
								  obj.sector = req.body.request.sector;
							  }
							  Areas.find(obj, function(err, areas) {
								 if (err) {
									 res.json(messeges.interna_error);
								 }
								 else {
									 if (typeof req.body.request.since_date != 'undefined') {
										var ar = {};
                                        var ar_b = [];
                                        var ar_a = [];
                                        var counter = 0;
                                        areas.forEach(function(area) {
											if (area.creation_date > new Date(req.body.request.since_date)) {
												ar_a.push(area);
												counter += 1;
											}
											else {
												ar_b.push(area);
												counter += 1;
											}
											if (counter == areas.length ) {
												ar['before'] = ar_b;
												ar['after'] = ar_a;
												res.json({
													valid: true,
													msg: "Done",
													result: { "areas" : ar }
												});
											}
										});
									 }
									 else {
										res.json({
											valid: true,
											msg: "Done",
											result: { "areas" : areas }
										});
									 }
								 }
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

router.post('/get_nearest', function(req, res, next) {
    API_Key.find({api_key:  req.body.api_key}, function(error, valid) {
        if (error) {
            res.json(messeges.not_valid_operation());
        }
        else {
            if (valid.length == 1) {
                mhelper['users'].get_user_data(req.body.user_id, function(user) {
                    if (user) {
                        if (typeof req.body.request.sector != 'undefined') {
                            if (req.body.request.sector == reserved_tokens.medical_selected) {
                                var obj = {};
                                if (typeof req.body.request.category != 'undefined') {
                                    obj.type = req.body.request.category;
                                }
                                var location = req.body.request.location;
                                obj.location = {
                                    $geoWithin:{
                                        $centerSphere: [ [ Number(location[0]), Number(location[1]) ], reserved_tokens.radius ]
                                    }
                                }
                                Medical.find(obj, function(err, locs) {
                                    console.log(locs.length)
                                    res.json(locs);
                                });
                            }
                            else if (req.body.request.sector == reserved_tokens.benefit_selected) {
                                var obj = {};
                                if (typeof req.body.request.category != 'undefined') {
                                    obj.industry = req.body.request.category;
                                }
                                var location = req.body.request.location;
                                obj.location = {
                                    $geoWithin:{
                                        $centerSphere: [ [ Number(location[0]), Number(location[1]) ], reserved_tokens.radius ]
                                    }
                                }
                                Benefits.find(obj, function(err, locs) {
                                    console.log(locs.length)
                                    res.json(locs);
                                });
                            }
                            else if (req.body.request.sector == reserved_tokens.atm_selected) {
                                var obj = {};
                                if (typeof req.body.request.category != 'undefined') {
                                    obj.industry = req.body.request.category;
                                }
                                var location = req.body.request.location;
                                obj.location = {
                                    $geoWithin:{
                                        $centerSphere: [ [ Number(location[0]), Number(location[1]) ], reserved_tokens.radius ]
                                    }
                                }
                                ATM.find(obj, function(err, locs) {
                                    console.log(locs.length)
                                    res.json(locs);
                                });
                            }
                            else if (req.body.request.sector == reserved_tokens.card_selected) {
                                var obj = {};
                                if (typeof req.body.request.category != 'undefined') {
                                    obj.type = req.body.request.category;
                                }
                                var location = req.body.request.location;
                                obj.location = {
                                    $geoWithin:{
                                        $centerSphere: [ [ Number(location[0]), Number(location[1]) ], reserved_tokens.radius ]
                                    }
                                }
                                CardHolder.find(obj, function(err, locs) {
                                    console.log(locs.length)
                                    res.json(locs);
                                });
                            }
                            else {
                                res.json(messeges.not_valid_operation());
                            }
                        }
                        else { // get all near by
                            console.log("No sector selected");
                            var nearby = {};
                            var location = req.body.request.location;
                            Medical.find({location:{
                                $geoWithin: {
                                        $centerSphere: [[Number(location[0]),Number(location[1])], reserved_tokens.radius ]
                                    }
                                }
                              },
                              function(err, medicals) {
                                  if (err) {
                                       console.log("here medical");
                                       console.log(err);
                                       res.json(messeges.interna_error());
                                  }
                                  else {
                                       console.log("medical added")
                                       nearby.medicals = medicals;
                                       Benefits.find({location:{$geoWithin: {$centerSphere: [ [ Number(location[0]),
                                        Number(location[1]) ], reserved_tokens.radius ]}}}, function(err, bens) {
                                            if (err) {
                                                res.json(messeges.interna_error());
                                            }
                                            else {
                                                console.log("benefit added");
                                                nearby.benefits = bens;

                                                ATM.find({location:{$geoWithin: {$centerSphere: [ [ Number(location[0]),
                                                   Number(location[1]) ], reserved_tokens.radius ]}}}, function(err, atms) {
                                                       if (err) {
                                                           res.json(messeges.interna_error());
                                                       }
                                                       else {
                                                           console.log("ATM added");
                                                           nearby.atms = atms;

                                                           // to add cardholders when it is added
                                                           CardHolder.find({location:{$geoWithin:
                                                                {$centerSphere: [ [ Number(location[0]),
                                                                Number(location[1]) ], reserved_tokens.radius ]}}},
                                                                function(err, cards){
                                                                    if (err) {
                                                                        res.json(messeges.interna_error());
                                                                    }
                                                                    else {
                                                                        console.log("Cards added");
                                                                        nearby.cards = cards;
                                                                        res.json({
                                                                           valid: true,
                                                                           msg: "Done",
                                                                           result: {"offers" : nearby}
                                                                       });
                                                                    }
                                                           })

                                                       }
                                                 });
                                            }
                                        });
                                  }
                              });
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
        }
    });
});

router.post('/test_card', function(req, res, next) {
    CardHolder.find({}, function(err, obj) {
        console.log(err);
        res.json(obj);
    });
});

router.post('/add_card_test', function(req, res, next) {
    var card = {
        name: "Ahmed",
        address: "Alaa",
        location: [1,1],
        img_path: "/data/uploads/logo.jpg",
        merchant: "Mohamed",
        zone: "Alaa",
        id: 1000,
        industry: "visa",
        offer: "THis is the offer",
        creation_date: new Date(Date.now())
    };
    var m = new CardHolder(card);
    m.save(function(err, id) {
        res.json(id);
    })
});

router.post('/feedback', function(req, res, next) {

    API_Key.find({api_key:  req.body.api_key}, function(error, valid) {
        if (error) {
            res.json(messeges.not_valid_operation());
        }
        else {
            if (valid.length == 1) {
                mhelper['users'].get_user_data(req.body.user_id, function(user) {
                    console.log(req.body);
                    if (user) {
                        var d = {
                            "body": req.body.request.feedback.body,
                             "about": req.body.request.feedback.about,
                             "creation_date": new Date(Date.now()),
                             creator: user._id
                        };
                        var feed = new Feedback(d);
                        feed.save(function(err, f) {
                            if (err) {
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
            else {
                res.json(messeges.not_valid_operation());
            }
        }
    });
});

module.exports = router;