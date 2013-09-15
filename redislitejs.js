


var RedisLiteJs = {};

// keys
RedisLiteJs.register= function(uname, pwd, callback){
    $.ajax({
        type: 'post',
        url: '/api/redis/register',
        data: { uname: uname, pwd: pwd }
    }).done(function() {
        alert("success");
    }).fail(function() {
        alert("error");
    });
};
RedisLiteJs.login   = function(uname, pwd, callback){
    $.ajax({
        type: 'post',
        url: '/api/redis/login',
        data: { uname: uname, pwd: pwd }
    }).done(function() {
        alert("success");
    }).fail(function() {
        alert("error");
    });
};
RedisLiteJs.userInfo   = function(callback){
    $.ajax({
        type: 'post',
        url: '/api/redis/user',
        data: { }
    }).done(function(data) {
            console.log('success');
            console.log(data);
        }).fail(function() {
            alert("error");
        });
};
RedisLiteJs.logout  = function(callback){
    $.ajax({
        type: 'post',
        url: '/api/redis/logout',
        data: {}
    }).done(function() {
        alert("success");
    }).fail(function() {
        alert("error");
    });
};


var RedisLiteJsDb = function(dbName){ this.dbName = dbName; };
RedisLiteJsDb.prototype.exists = function(){};


// keys
RedisLiteJsDb.prototype.exists  = function(key, callback){};
RedisLiteJsDb.prototype.delete  = function(key, callback){};

RedisLiteJsDb.prototype.keys    = function(keyPattern, callback){
    $.ajax({
        type: 'post',
        url: '/api/redis/action',
        data: { action: 'keys', db:this.dbName }
    }).done(function(data) {
            //alert("success"+data);
            callback(JSON.parse(data));
        }).fail(function() {
            alert("error");
        });
};

RedisLiteJsDb.prototype.rename  = function(key, newKey, callback){};

// simple
RedisLiteJsDb.prototype.get = function(key, callback){
    $.ajax({
        type: 'post',
        url: '/api/redis/action',
        data: { action: 'get', key: key , db:this.dbName }
    }).done(function(data) {
        //alert("success"+data);
        callback(JSON.parse(data));
    }).fail(function() {
        alert("error");
    });
};
RedisLiteJsDb.prototype.set = function(key, value, callback){
    $.ajax({
        type: 'post',
        url: '/api/redis/action',
        data: { action: 'set', key: key, value:value , db:this.dbName }
    }).done(function(data) {
        alert("success"+data);
    }).fail(function() {
        alert("error");
    });
};

// little more
RedisLiteJsDb.prototype.hget = function(key, field, callback){};
RedisLiteJsDb.prototype.hset = function(key, field, value, callback){};


