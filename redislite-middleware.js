
module.exports = function(options){

    var express = require('express');
    var router = new express.Router();


    //app.use('/api', redisLiteMiddleware({provider: redisLiteFS}).middleware);
    var provider = options.provider;

    if (!provider && options.dataDir){
        provider  =   require('./redislite-fs.js')({rootDataDir:options.dataDir});
    }

    //provider.test('abcdxyzpqrst',10000);


    function getHash(input){
        var crypto = require('crypto');
        var md5 = crypto.createHash('md5');
        md5.update(input);
        return md5.digest('hex');
    }

    var usersDb = provider.getOrCreateUserDB('users');

    router.get('/test', function(req, res){ res.send(200, "test successful..."); });

    //TODO: caching & async for '/redis/util.js'

    router.get('/helper.js', function(req, res){
        var jsPath = require('path').resolve(__dirname, 'redislitejs.js');
        var jsContent = require('fs').readFileSync(jsPath);
        res.end(jsContent);
    });

    router.post('/register', function(req, res){
        var uname = req.body.uname;
        var pwd = req.body.pwd;

        if (usersDb.exists(getHash(uname))) {
            res.send(200);
        }else{
            usersDb.set(getHash(uname), {uname:getHash(uname), pwd:getHash(pwd), userDBList:{}});
            res.send(200);
        }
    });

    router.post('/user', function(req, res){
        var user = {loggedIn: false};
        if (req.session.authenticatedUserInfo){
            var userInfo = usersDb.get(req.session.authenticatedUserInfo.uname);
            var arrDBs = [];
            for(key in userInfo.userDBList) {arrDBs.push(key);};
            user.loggedIn = true;
            user.dblist = arrDBs;
        }
        res.set('Content-Type', 'application/json');
        res.send(200, JSON.stringify(user));
    });

    router.post('/login', function(req, res){
        var uname = req.body.uname;
        var pwd = req.body.pwd;
        if (usersDb.exists(getHash(uname))) {
            var userObj = usersDb.get(getHash(uname));
            if (userObj.pwd === getHash(pwd)) {
                req.session.authenticatedUserInfo = userObj;
                res.send(200);
            }else{
                res.send(401);
            }
        }else res.send(401);
    });

    router.post('/logout', function(req, res){
        if (req.session.authenticatedUserInfo){
            req.session.authenticatedUserInfo = null;
            res.send(200);
        }else res.send(500);
    });

    function reply(res, json){
        res.set('Content-Type', 'application/json');
        res.send(200, JSON.stringify(json));
    }

    router.post('/action', function(req, res){

        if (!req.session.authenticatedUserInfo) { res.send(401); return; }

        var action = req.body.action;
        var key = req.body.key;
        var newKey = req.body.newKey;
        var field = req.body.field;
        var value = req.body.value;
        var index = req.body.index;
        var dbname = req.body.db;

        var userDBList = req.session.authenticatedUserInfo.userDBList;

        var internalDBName;
        if (userDBList.hasOwnProperty(dbname)){
            var internalDBName = userDBList[dbname];
        }else{
            var hashedUserName = req.session.authenticatedUserInfo.uname;
            userDBList = usersDb.get(hashedUserName).userDBList;
            if (userDBList.hasOwnProperty(dbname)){
                var internalDBName = userDBList[dbname];
            }else{
                var internalDBName = provider.getNewRandomDBName();
                provider.getOrCreateUserDB(internalDBName); // just create new db so that rarest concurrency issue can be solved.
                userDBList[dbname] = internalDBName;
                req.session.authenticatedUserInfo.userDBList = userDBList;
                usersDb.set(hashedUserName, req.session.authenticatedUserInfo);
            }
        }

        var userDB = provider.getOrCreateUserDB(internalDBName);

        if (action==='get') reply(res, userDB.get(key));
        else if (action==='set') reply(res, userDB.set(key, value));
        else if (action==='keys') reply(res, userDB.keys());
        else if (action==='exists') reply(res, userDB.exists(key));
        else if (action==='rename') reply(res, userDB.rename(key, newKey));
        else if (action==='delete') reply(res, userDB.delete(key));
        else if (action==='hset') reply(res, userDB.hset(key, field, value));
        else if (action==='hget') reply(res, userDB.hget(key, field));
        else if (action==='allGet') {
            var arrKeys = userDB.keys();
            var retObj = arrKeys.map(function(key){
                return { key: key, value: userDB.get(key) };
            });
            reply(res, retObj);
        }else res.send(500);

    });


    var udb = provider.getOrCreateUserDB('testdb');
    udb.set('day', {title:'good day', scores:[1,23]});
    console.log(udb.get('day').title);
    console.log(udb.get('day').scores);
    console.log(udb.get('day').scores.length);
    console.log(':>'+udb.hget('day','title'));
    udb.hset('day','title', 'very good day');
    console.log(':>'+udb.hget('day','title'));
    console.log("Available DB's");
    console.log(provider.getUserDBList());

    return router;

};