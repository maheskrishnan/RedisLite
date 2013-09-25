


/*
 var kvStore = new RemoteKeyValueStore('/api');

 kvStore.register('username','password');
 kvStore.login('username','password');
 kvStore.userInfo(function(userinfo){});
 kvStore.logout();

 kvStore.set('health-journal','current-wgt',240);
 kvStore.get('health-journal','current-wgt');

 kvStore.hset('health-journal','2013-09-12','wgt',240);
 kvStore.hget('health-journal','2013-09-12','wgt');

 */


function action(url, data, callback){
    $.ajax({
        type: 'post',
        url: url,
        data: data
    }).done(function(data) {
            if (callback) callback(null, data);
        }).fail(function() {
            console.log("error");
            if (callback) callback('error');
        });
}

var RemoteKeyValueStore = function(endPointPrefix){ this.endPointPrefix = endPointPrefix; };

RemoteKeyValueStore.prototype.register = function(uname, pwd, callback){
    action(this.endPointPrefix+'/register', { uname: uname, pwd: pwd }, callback);
};

RemoteKeyValueStore.prototype.login = function(uname, pwd, callback){
    action(this.endPointPrefix+'/login', { uname: uname, pwd: pwd }, callback);
};

RemoteKeyValueStore.prototype.userInfo = function(callback){
    action(this.endPointPrefix+'/user', { }, callback);
};

RemoteKeyValueStore.prototype.logout = function(callback){
    action(this.endPointPrefix+'/logout', { }, callback);
};

// keys
RemoteKeyValueStore.prototype.keys  = function(bucket, keyPattern, callback){};

RemoteKeyValueStore.prototype.exists= function(bucket, key, callback){
    action(this.endPointPrefix+'/action', { action: 'exists', key: key , db:bucket }, callback);
};

RemoteKeyValueStore.prototype.delete= function(bucket, key, callback){
    action(this.endPointPrefix+'/action', { action: 'delete', key: key , db:bucket }, callback);
};

RemoteKeyValueStore.prototype.rename= function(bucket, key, newKey, callback){
    action(this.endPointPrefix+'/action', { action: 'rename', key: key, newKey: newKey, db:bucket }, callback);
};

RemoteKeyValueStore.prototype.get   = function(bucket, key, callback){
    action(this.endPointPrefix+'/action', { action: 'get', key: key, db:bucket }, callback);
};

RemoteKeyValueStore.prototype.set   = function(bucket, key, value, callback){
    action(this.endPointPrefix+'/action', { action: 'set', key: key, value:value, db:bucket }, callback);
};

RemoteKeyValueStore.prototype.allGet= function(bucket, callback){
    action(this.endPointPrefix+'/action', { action: 'allGet', db:bucket }, callback);
};

RemoteKeyValueStore.prototype.hget = function(bucket, key, field, callback){
    action(this.endPointPrefix+'/action', { action: 'hget', key: key, field:field, db:bucket }, callback);
};

RemoteKeyValueStore.prototype.hset = function(bucket, key, field, value, callback){
    action(this.endPointPrefix+'/action', { action: 'hset', key: key, field:field, value:value, db:bucket }, callback);
};



