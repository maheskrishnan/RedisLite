

var RemoteKeyValueStore = function(endPointPrefix){ this.endPointPrefix = endPointPrefix; };

RemoteKeyValueStore.prototype.register = function(uname, pwd, callback){};
RemoteKeyValueStore.prototype.login = function(uname, pwd, callback){};
RemoteKeyValueStore.prototype.userInfo = function(callback){};
RemoteKeyValueStore.prototype.logout = function(callback){};

// keys
RemoteKeyValueStore.prototype.keys  = function(bucket, keyPattern, callback){};
RemoteKeyValueStore.prototype.exists= function(bucket, key, callback){};
RemoteKeyValueStore.prototype.delete= function(bucket, key, callback){};
RemoteKeyValueStore.prototype.rename= function(bucket, key, newKey, callback){};

RemoteKeyValueStore.prototype.get   = function(bucket, key, callback){};
RemoteKeyValueStore.prototype.set   = function(bucket, key, value, callback){};
RemoteKeyValueStore.prototype.allGet= function(bucket, callback){};

RemoteKeyValueStore.prototype.hget = function(bucket, key, field, callback){};
RemoteKeyValueStore.prototype.hset = function(bucket, key, field, value, callback){};


//TODO: remove end point '/api/' hardcoding...

var kvStore = new RemoteKeyValueStore('/api');

kvStore.login('','');
kvStore.hset('health-journal','2013-09-12','wgt',240);
kvStore.hset('health-journal','2013-09-12','calories',2400);



var RedisLiteJs = {};

// keys
RedisLiteJs.register= function(uname, pwd, callback){
    $.ajax({
        type: 'post',
        url: '/api/redis/register',
        data: { uname: uname, pwd: pwd }
    }).done(function() {
        console.log("success");
        if (callback) callback(null);
    }).fail(function() {
        console.log("error");
        if (callback) callback('error');
    });
};
RedisLiteJs.login   = function(uname, pwd, callback){
    $.ajax({
        type: 'post',
        url: '/api/redis/login',
        data: { uname: uname, pwd: pwd }
    }).done(function() {
        console.log("success");
        if (callback) callback(null);
    }).fail(function() {
        console.log("error");
        callback('error');
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
        if (callback) callback(null, JSON.parse(data));
    }).fail(function() {
        console.log("error");
        callback('error');
    });
};
RedisLiteJs.logout  = function(callback){
    $.ajax({
        type: 'post',
        url: '/api/redis/logout',
        data: {}
    }).done(function() {
        console.log("success");
        if (callback) callback(null);
    }).fail(function() {
        if (callback) callback('error');
        console.log("error");
    });
};


var RedisLiteJsDb = function(dbName){ this.dbName = dbName; };

// keys

RedisLiteJsDb.prototype.exists  = function(key, callback){
    $.ajax({
        type: 'post',
        url: '/api/redis/action',
        data: { action: 'exists', key: key , db:this.dbName }
    }).done(function(data) {
        var exists = data;

        console.log(exists);

        //console.log("success"+data);
        if (callback) callback(null);
    }).fail(function() {
        console.log("error");
        if (callback) callback('error');
    });
};

RedisLiteJsDb.prototype.delete  = function(key, callback){
    $.ajax({
        type: 'post',
        url: '/api/redis/action',
        data: { action: 'delete', key: key , db:this.dbName }
    }).done(function(data) {
        //console.log("success"+data);
        if (callback) callback(null);
    }).fail(function(err) {
        console.log("error");
        console.log(err);
        if (callback) callback('error');
    });
};

RedisLiteJsDb.prototype.keys    = function(keyPattern, callback){
    $.ajax({
        type: 'post',
        url: '/api/redis/action',
        data: { action: 'keys', db:this.dbName }
    }).done(function(data) {
        //alert("success"+data);
        if (callback) callback(null, data);
    }).fail(function() {
        if (callback) callback('error');
    });
};

RedisLiteJsDb.prototype.rename  = function(key, newKey, callback){
    $.ajax({
        type: 'post',
        url: '/api/redis/action',
        data: { action: 'rename', key: key, newKey:newKey, db:this.dbName }
    }).done(function(data) {
            console.log("success"+data);
            if (callback) callback(null, data);
        }).fail(function() {
            if (callback) callback();
            console.log("error");
        });
};

// simple
RedisLiteJsDb.prototype.get = function(key, callback){
    $.ajax({
        type: 'post',
        url: '/api/redis/action',
        data: { action: 'get', key: key , db:this.dbName }
    }).done(function(data) {
        //alert("success"+data);
        if (callback) callback(null, data);
    }).fail(function() {
        console.log("error");
        if (callback) callback('error');
    });
};
RedisLiteJsDb.prototype.set = function(key, value, callback){
    $.ajax({
        type: 'post',
        url: '/api/redis/action',
        data: { action: 'set', key: key, value:value, db:this.dbName }
    }).done(function(data) {
        console.log("success"+data);
        if (callback) callback(null, data);
    }).fail(function() {
        if (callback) callback();
        console.log("error");
    });
};

RedisLiteJsDb.prototype.allGet = function(callback){
    $.ajax({
        type: 'post',
        url: '/api/redis/action',
        data: { action: 'allGet', db:this.dbName }
    }).done(function(data) {
            callback(null, data);
        }).fail(function() {
            console.log("error");
        });
};

// little more
RedisLiteJsDb.prototype.hget = function(key, field, callback){
    $.ajax({
        type: 'post',
        url: '/api/redis/action',
        data: { action: 'hget', key: key, field:field, db:this.dbName }
    }).done(function(data) {
        if (callback) callback(null, data);
    }).fail(function() {
        console.log("error");
        if (callback) callback('error');
    });
};

RedisLiteJsDb.prototype.hset = function(key, field, value, callback){
    $.ajax({
        type: 'post',
        url: '/api/redis/action',
        data: { action: 'hset', key: key, field:field, value:value,  db:this.dbName }
    }).done(function(data) {
        if (callback) callback(null, data);
    }).fail(function() {
        console.log("error");
        if (callback) callback('error');
    });
};


