var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var db_connector = require('./Utils/DBCOnnector');
var startup = require('./Utils/startup_midelwares');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
console.log("here again");

db_connector("mongodb://alaa:ahmed@ds161400.mlab.com:61400/aaibian", function (valid) {
   if(valid) {
       console.log("heellllo");
       startup[0].benefit_schedules();
       startup[0].benefit_delete_schedule();
       app.use('/', index);
       app.use('/users', users);
       console.log("HHHHHHHHH");
   }
});



module.exports = app;
