var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var cheerio = require("cheerio");
var request = require("request");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser')
var session = require('express-session');

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/practice1';

// connect to the database
var db = mongoose.connect(connectionString);

// to configure :
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data
app.use(session({
    secret: 'this is secret',
    resave: true,
    saveUninitialized: true
}));
app.use(cookieParser());  // parse cookie and create a map we can use 
app.use(passport.initialize());
app.use(passport.session()); // U NEED TO CONFIGURE PASSPORT'S SESSION AFTER U CONFIGURE EXPRESSES SESSION. THIS ORDER IS VERY IMP

app.use(express.static(__dirname + '/public'));

// var userModel = require("./server/models/user.model.server.js")(db,mongoose);
// var userScrapeModel = require("./server/models/userScrapeData.model.server.js")(db,mongoose);
// var userUrlDataModel = require("./server/models/userUrlData.model.server.js")(db, mongoose);

// pass db and mongoose reference to server side application module
require("./server/app.js")(app, db, mongoose);

app.listen(port, ip);
