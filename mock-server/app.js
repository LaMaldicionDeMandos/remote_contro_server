var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var leds = [false, false, false];

const ON = 'on';
const OFF = 'off';

app.get('/ping', function(req, res, next) {
    res.sendStatus(200);
});

app.get('/status/:id', function(req, res, next) {
    var result = leds[req.params.id] ? "on" : "off";
    res.send(result);
});

app.get('/leds', function(req, res, next) {
    res.send("[0,1,2]");
});

app.put('/led/:id/:command', function(req, res, next) {
    var id = req.params.id;
    var command = req.params.command;
    console.log("LED " + id + " " + command);
    if (id < 0 || id > 2) {
        console.log("LED " + id + " no exist");
        res.sendStatus(404);
        return;
    } 
    if (command != ON && command != OFF) {
        console.log("INVALID COMMAND " + command);
        res.sendStatus(400);
        return;
    }
    var flag = command == ON;
    if (leds[id] == flag) {
        console.log("LED " + id + " already is " + command);
        res.sendStatus(304);
        return;
    }
    leds[id] = flag;
    res.sendStatus(200);
    //res.send("OK");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
