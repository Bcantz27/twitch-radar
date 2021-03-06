//Module Dependencies
var express = require("express");
var path = require('path');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var passport = require('passport');
var cors = require('cors');

//Load Config
var env = process.env.NODE_ENV || "development";
var config = require('./config/' + env + '.js');

var Logger = require('./services/logging-service.js');
var logger = new Logger().getInstance();


var GraphDatabaseHandlerSingleton = require('./services/neo4j-service.js');
var GraphDatabaseHandler = new GraphDatabaseHandlerSingleton().getInstance();
var User = require('./models/User.js');

//Connect to Database
mongoose.connect(config.mongoDb.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
logger.log('info','Initialized Mongo DB');

//App configuration
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
app.set('views', path.join(__dirname, 'layouts'));
app.set('view engine', 'jade');
app.use(require("prerender-node").set('prerenderToken', config.secret));
app.use(session({ secret: config.secret, resave: true, saveUninitialized: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
app.options('*', cors())
logger.log('info','Initialized App Config');

// required for passport
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//passport configuration
require('./passport.js')(passport);
logger.log('info','Initialized Passport');

//Define routes
app.use(require('./routes')(passport));
logger.log('info','Initialized Routes');

app.listen(config.port);
logger.log('info','Server Started on port ' + config.port);

//Start up reset code - Testing
/*
User.deleteMany({ name: 'secretbryan' }, function (err) {
    if(err) logger.log('error', err);
    logger.log('info','Deleted secretbryan from mongoDb');
});
GraphDatabaseHandler.query('MATCH (u) DETACH DELETE u').then(function(res){
    logger.log('info','Deleted Graph');
});*/