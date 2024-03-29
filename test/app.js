var fs      =   require('fs');
var path    =   require('path');

var express =   require('express');

var app = express();
var port = process.env.PORT || 6060;

app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session( {secret : "my !@#!@#! secret"}));
    app.use(function(req, res, next) {
        console.log('Request received for: ['+req.method+'] :'+req.url);
        next();
    });
    app.use(function(err, req, res, next){
        console.error(err.stack);
        res.send(500, 'Something broke!');
    });
    app.use(express.static('public'));

    var redisLiteMiddleware  =   require('./../redislite-middleware.js');
    app.use('/api', redisLiteMiddleware({dataDir:'db-fs'}).middleware);


});


var server = app.listen(port);
