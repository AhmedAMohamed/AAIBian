var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

var creator = require('./routes/creator');
var users = require('./routes/users');
var admins = require('./routes/admin');
var db_connector = require('./Utils/DBCOnnector');
var helpers = require('./Utils/helpers');
var employees = require('./routes/employee');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'logo.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

db_connector("mongodb://alaa:ahmed@ds161400.mlab.com:61400/aaibian", function (valid) {
   if(valid) {
       //helpers['starters'].benefit_schedules();
       //helpers['starters'].benefit_delete_schedule();
       //helpers['starters'].news_delete_schdule();
       app.use('/', creator, cors());
       app.use('/aaibian/user', users, cors());
       app.use('/aaibian/admin', admins, cors());
       app.usee('/aaibian/emp', employees, cors());
   }
});



module.exports = app;
