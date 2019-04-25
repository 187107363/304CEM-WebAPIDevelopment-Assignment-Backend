//import express
var Express = require("express");
var BodyParser = require("body-parser");
var logger = require('morgan');
//import mongoose
var mongoose = require('mongoose');

//import jwt
var jwt = require('jsonwebtoken');
var cors = require('cors');
//import controllers
var public = require('./routes/public');
var private = require('./routes/private');
var cookieParser = require('cookie-parser');

var app = Express();
//logger
app.use(logger('dev'));
//Set up default mongoose connection
var CONNECTION_URL = "mongodb+srv://readwrite:Ptx3SpNh233SGpj@304cem-assignment-c3cpk.azure.mongodb.net/example?retryWrites=true";

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors());
app.use(cookieParser());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({
    extended: true
}));

// jwt secret token
app.set('secretKey', 'nodeRestApi');

app.use('/public', public);
app.use('/private', validateUser, private);
app.get('/', function(req, res){
    res.json({"Page" : "REST API with node.js"});
    });
function validateUser(req, res, next) {
    jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
        if (err) {
            res.json({
                status: "error",
                message: err.message,
                data: null
            });
        } else {
            // add user id to request
            req.body.userId = decoded.id;
            next();
        }
    });
}
//Server
app.listen(process.env.PORT || 3000, function () {
    mongoose.connect(CONNECTION_URL, {
        useNewUrlParser: true
    }, function (error) {
        if (error) {
            throw error;
        } else {
            console.log('Node server listening on port 3000');
        }
    });
});